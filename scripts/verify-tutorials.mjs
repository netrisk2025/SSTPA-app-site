import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const publicOnly = process.argv.includes("--public-only");
const decode = process.argv.includes("--decode");
const read = (filename) => JSON.parse(fs.readFileSync(path.join(root, filename), "utf8"));
const hash = (filename) => createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
const ffprobe = process.env.FFPROBE || "ffprobe";
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const scriptBaseline = read("scripts/tutorial-content-baseline.json");
const manifestPath = "public/media/tutorials.json";
assert.ok(fs.existsSync(path.join(root, manifestPath)), "Final tutorial manifest is missing; media release is incomplete");
const manifest = read(manifestPath);
assert.equal(manifest.version, 1, "Unsupported tutorial manifest version");
const course = manifest.course;
assert.equal(course?.slug, "loss-tool-attack-trees", "Unexpected tutorial course");
assert.equal(course.title, "Loss Tool: Attack Trees");
assert.equal(course.project, "FireSat");
assert.ok(typeof course.description === "string" && course.description.trim().length > 40, "Course description is required");
assert.ok(typeof course.note === "string" && /illustrative|training|educational/i.test(course.note), "Explain the educational additions and illustrative assumptions in the course note");
const existingNarrator = read("public/audio/manifest.json").home.voice;
assert.equal(course.voice, existingNarrator, "Tutorial narrator metadata must match the existing Systems voice");
assert.equal(course.lessons?.length, 8, "The final course must include all eight lessons");
assert.equal(scriptBaseline.lessons.length, 8, "The approved script baseline must contain eight lessons");
assert.deepEqual(course.lessons.map((lesson) => lesson.slug), scriptBaseline.lessons.map((lesson) => lesson.slug), "Lesson sequence differs from the reviewed course");

const uniquePaths = new Set();
const uniqueVideoHashes = new Set();
const uniqueTranscriptHashes = new Set();
const sourcePaths = [];
const summaries = [];

function mediaAsset(url, extension) {
  assert.ok(typeof url === "string" && url.startsWith("/media/") && !url.includes("..") && !/[?#\\]/.test(url), `Invalid local tutorial path: ${url}`);
  assert.match(url, extension, `Unexpected asset extension: ${url}`);
  assert.ok(!uniquePaths.has(url), `Lessons must not share an asset path: ${url}`);
  uniquePaths.add(url);
  const filename = path.join(root, "public", url);
  assert.ok(fs.existsSync(filename) && fs.statSync(filename).isFile(), `Missing tutorial asset: ${url}`);
  assert.ok(fs.statSync(filename).size > 0, `Empty tutorial asset: ${url}`);
  sourcePaths.push(url);
  return filename;
}

function probe(filename) {
  return JSON.parse(execFileSync(ffprobe, ["-v", "error", "-show_entries",
    "format=duration:stream=codec_type,codec_name,width,height,duration", "-of", "json", filename],
  { encoding: "utf8", timeout: 30000 }));
}

function timestamp(value) {
  const match = value.match(/^(?:(\d{2,}):)?([0-5]\d):([0-5]\d)\.(\d{3})$/);
  assert.ok(match, `Invalid WebVTT timestamp: ${value}`);
  return Number(match[1] || 0) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
}

function words(value) {
  return value.normalize("NFKC").replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#(?:39|x27);/gi, "'").replace(/&nbsp;/g, " ")
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function captionCues(filename, measuredDuration, transcript, slug) {
  const text = fs.readFileSync(filename, "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  assert.match(text, /^WEBVTT(?:[^\n]*)\n/, `Missing WebVTT header: ${slug}`);
  const blocks = text.trim().split(/\n\s*\n/).slice(1);
  const cues = [];
  for (const block of blocks) {
    if (/^(?:NOTE(?:\s|$)|STYLE\n|REGION\n)/.test(block)) continue;
    const lines = block.split("\n");
    const index = lines.findIndex((line) => line.includes("-->"));
    assert.ok(index === 0 || index === 1, `Malformed caption cue: ${slug}`);
    const timing = lines[index].match(/^(\S+)\s+-->\s+(\S+)(?:\s+.*)?$/);
    assert.ok(timing, `Invalid caption cue timing: ${slug}`);
    const start = timestamp(timing[1]), end = timestamp(timing[2]);
    const caption = lines.slice(index + 1).join(" ").trim();
    assert.ok(caption.length > 0, `Empty caption cue: ${slug}`);
    assert.ok(start >= 0 && end > start && end <= measuredDuration + 0.1, `Caption outside video duration: ${slug}, ${timing[0]}`);
    if (cues.length) assert.ok(start >= cues.at(-1).end - 0.001, `Overlapping or unordered captions: ${slug}`);
    cues.push({ start, end, caption });
  }
  assert.ok(cues.length >= 6, `Insufficient timed narration captions: ${slug}`);
  assert.equal(words(cues.map((cue) => cue.caption).join(" ")), words(transcript), `Captions omit or differ from the reviewed transcript: ${slug}`);
  return cues.length;
}

for (const [index, lesson] of course.lessons.entries()) {
  const approved = scriptBaseline.lessons[index];
  assert.match(lesson.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  for (const field of ["title", "description", "transcript"]) {
    assert.equal(lesson[field]?.trim(), approved[field].trim(), `Lesson ${field} differs from the reviewed script: ${lesson.slug}`);
  }
  assert.ok(Number.isFinite(lesson.durationSeconds) && lesson.durationSeconds > 0 && lesson.durationSeconds <= 180, `Invalid lesson runtime metadata: ${lesson.slug}`);
  const videoFile = mediaAsset(lesson.src, /\.mp4$/i);
  const posterFile = mediaAsset(lesson.poster, /\.(?:jpe?g|png|webp)$/i);
  const captionFile = mediaAsset(lesson.captions, /\.vtt$/i);
  const videoHash = hash(videoFile);
  assert.ok(!uniqueVideoHashes.has(videoHash), `Duplicate tutorial video bytes: ${lesson.slug}`);
  uniqueVideoHashes.add(videoHash);
  const transcriptHash = createHash("sha256").update(lesson.transcript).digest("hex");
  assert.ok(!uniqueTranscriptHashes.has(transcriptHash), `Duplicate tutorial transcript: ${lesson.slug}`);
  uniqueTranscriptHashes.add(transcriptHash);
  const video = probe(videoFile);
  const visual = video.streams?.find((stream) => stream.codec_type === "video");
  const audio = video.streams?.find((stream) => stream.codec_type === "audio");
  assert.ok(visual && visual.width > 0 && visual.height > 0, `No playable video stream: ${lesson.slug}`);
  assert.ok(audio, `Narrated tutorial has no audio stream: ${lesson.slug}`);
  assert.equal(visual.codec_name, "h264", `Use broadly supported H.264 video: ${lesson.slug}`);
  assert.equal(audio.codec_name, "aac", `Use broadly supported AAC narration: ${lesson.slug}`);
  const measured = Number(video.format?.duration);
  assert.ok(Number.isFinite(measured) && measured > 0 && measured <= 180, `Measured video exceeds 3 minutes: ${lesson.slug} (${measured}s)`);
  assert.ok(Math.abs(measured - lesson.durationSeconds) <= 0.25, `Duration metadata differs from actual media: ${lesson.slug}`);
  const poster = probe(posterFile).streams?.find((stream) => stream.codec_type === "video");
  assert.ok(poster && poster.width > 0 && poster.height > 0, `Poster is not a readable image: ${lesson.slug}`);
  const captions = captionCues(captionFile, measured, lesson.transcript, lesson.slug);
  if (decode) {
    execFileSync(ffmpeg, ["-v", "error", "-xerror", "-i", videoFile,
      "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"], { timeout: 180000, maxBuffer: 1024 * 1024 });
    execFileSync(ffmpeg, ["-v", "error", "-xerror", "-i", posterFile, "-frames:v", "1", "-f", "null", "-"],
      { timeout: 30000, maxBuffer: 1024 * 1024 });
  }
  summaries.push({ lesson: lesson.slug, durationSeconds: measured, width: visual.width, height: visual.height, captionCues: captions });
}

if (!publicOnly) {
  assert.deepEqual(read("dist/media/tutorials.json"), manifest, "Built tutorial manifest is stale");
  for (const url of sourcePaths) {
    const built = path.join(root, "dist", url);
    assert.ok(fs.existsSync(built), `Build omitted tutorial asset: ${url}`);
    assert.equal(hash(built), hash(path.join(root, "public", url)), `Built tutorial asset differs from its source: ${url}`);
  }
}
console.table(summaries);
console.log(`Verified all eight narrated tutorial lessons, exact approved transcripts, matching timed captions, readable posters, distinct video assets, and measured runtimes ≤180 seconds${publicOnly ? " (public assets only)" : ", including production copies"}${decode ? "; full audio/video decode passed" : ". Use --decode for a full audio/video decode"}.`);
