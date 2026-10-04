import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const content = read("src/content.json");
const narrations = read("public/audio/scripts.json");
const audio = read("public/audio/manifest.json");
const demos = read("public/media/demos.json");
const vocabulary = read("public/audio/vocabulary.json");
const paperPath = "/files/SSTPA-Methodology-White-Paper-v16.docx";
const retiredPaper = "public/files/SSTPA-Methodology-White-Paper-v14.docx";
const pageSlugs = [
  "home",
  "tools",
  "methodology",
  "installation-admin",
  ...content.tools.map((t) => t.slug),
];
const expected = new Set(pageSlugs);
assert.equal(expected.size, 22, "All 22 narrated pages must be present");
assert.equal(
  content.tools.length,
  18,
  "Workspace and all 17 add-ons must be present",
);

function asset(url) {
  assert.ok(
    typeof url === "string" && url.startsWith("/") && !url.includes(".."),
    `Invalid asset path: ${url}`,
  );
  const filename = path.join(root, "public", url);
  assert.ok(fs.existsSync(filename), `Missing asset: ${url}`);
  assert.ok(fs.statSync(filename).size > 0, `Empty asset: ${url}`);
  return filename;
}

for (const slug of expected) {
  const script = narrations.pages.find((p) => p.slug === slug);
  assert.ok(
    script?.script?.length > 500,
    `Missing substantive narration: ${slug}`,
  );
  assert.ok(audio[slug]?.src, `Missing generated narration: ${slug}`);
  asset(audio[slug].src);
  assert.ok(
    audio[slug].durationSeconds >= 60 && audio[slug].durationSeconds <= 120,
    `Narration outside 1–2 minutes: ${slug}`,
  );
}
assert.equal(
  new Set(Object.values(audio).map((a) => a.src)).size,
  22,
  "Pages must have distinct audio assets",
);

assert.equal(vocabulary.version, 1, "Unsupported vocabulary manifest version");
assert.equal(vocabulary.terms.length, 28, "All 28 vocabulary terms must be present");
assert.equal(
  new Set(vocabulary.terms.map((term) => term.slug)).size,
  28,
  "Vocabulary term slugs must be unique",
);
const vocabularyAudio = new Set();
const existingAudio = new Set(Object.values(audio).map((track) => track.src));
for (const term of vocabulary.terms) {
  assert.match(term.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid vocabulary slug");
  for (const field of ["term", "category", "definition", "script", "sourceLabel"])
    assert.ok(
      typeof term[field] === "string" && term[field].trim().length > 0,
      `Missing vocabulary ${field}: ${term.slug}`,
    );
  assert.ok(term.sources?.length > 0, `Missing vocabulary references: ${term.slug}`);
  for (const source of term.sources) {
    assert.ok(source.label?.trim(), `Unlabeled vocabulary reference: ${term.slug}`);
    assert.ok(
      source.url === paperPath || /^https:\/\//.test(source.url),
      `Invalid vocabulary reference: ${term.slug}`,
    );
  }
  const track = term.audio;
  assert.ok(track?.src, `Missing vocabulary audio: ${term.slug}`);
  assert.ok(!existingAudio.has(track.src), `Vocabulary overwrites existing narration: ${term.slug}`);
  assert.ok(!vocabularyAudio.has(track.src), `Vocabulary terms share a recording: ${term.slug}`);
  vocabularyAudio.add(track.src);
  assert.equal(track.voice, audio.home.voice, `Vocabulary voice differs from the existing site: ${term.slug}`);
  assert.match(track.duration, /^0:[0-5][0-9]$|^1:00$/, `Invalid vocabulary duration display: ${term.slug}`);
  assert.ok(
    Number.isFinite(track.durationSeconds) && track.durationSeconds >= 30 && track.durationSeconds <= 60,
    `Vocabulary duration metadata outside 30–60 seconds: ${term.slug}`,
  );
  const filename = asset(track.src);
  const probe = JSON.parse(execFileSync(process.env.FFPROBE || "ffprobe", [
    "-v", "error", "-show_entries", "format=duration:stream=codec_type",
    "-of", "json", filename,
  ], { encoding: "utf8", timeout: 30000 }));
  const duration = Number(probe.format?.duration);
  assert.ok(probe.streams?.some((stream) => stream.codec_type === "audio"), `No audio stream: ${term.slug}`);
  assert.ok(Number.isFinite(duration) && duration >= 30 && duration <= 60, `Measured vocabulary duration outside 30–60 seconds: ${term.slug}`);
  assert.ok(Math.abs(duration - track.durationSeconds) <= 0.25, `Vocabulary duration metadata differs from recording: ${term.slug}`);
}
for (const tool of content.tools) {
  asset(tool.guidePath === "/docs/" ? "/docs/index.html" : tool.guidePath);
  asset(tool.posterPath);
  const demo = demos[tool.slug];
  assert.ok(demo, `Missing FireSat demonstration: ${tool.slug}`);
  assert.equal(demo.project, "FireSat");
  assert.equal(demo.silent, true);
  asset(demo.src);
  asset(demo.poster);
  asset(demo.captions);
  const vtt = fs.readFileSync(path.join(root, "public", demo.captions), "utf8");
  assert.ok(
    vtt.startsWith("WEBVTT") && vtt.includes("-->"),
    `Invalid walkthrough captions: ${tool.slug}`,
  );
  assert.ok(
    tool.exampleSteps.length >= 2,
    `Missing written walkthrough: ${tool.slug}`,
  );
  assert.deepEqual(tool.exampleSteps, demo.steps, `Written steps differ from the recorded tour: ${tool.slug}`);
}
for (const step of content.methodology.workflow) {
  for (const slug of step.tools)
    assert.ok(
      content.tools.some((t) => t.slug === slug),
      `Broken methodology tool link: ${slug}`,
    );
}
const paper = fs.readFileSync(asset(paperPath));
assert.equal(
  paper.subarray(0, 2).toString(),
  "PK",
  "White paper must be a DOCX archive",
);

// This release adds content. The superseded v14 download is its only removal.
const preservedFiles = execFileSync("git", [
  "ls-tree", "-r", "--name-only", "-z", "HEAD", "--", "public",
], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean);
for (const filename of preservedFiles) {
  if (filename !== retiredPaper)
    assert.ok(fs.existsSync(path.join(root, filename)), `Existing public asset removed: ${filename}`);
}
asset("/Audio/Systems(1).wav");
asset("/files/SSTPA-Tools-White-Paper-v2.docx");
asset("/media/introduction.mp4");
asset("/media/introduction-poster.jpg");

const vercel = read("vercel.json");
assert.ok(vercel.rewrites.some((rule) => rule.source === "/vocabulary" && rule.destination === "/index.html"), "Vocabulary direct navigation must have a production rewrite");
const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
assert.ok(sitemap.includes("<loc>https://www.sstpa.app/vocabulary</loc>"), "Vocabulary page missing from sitemap");
assert.ok(
  !JSON.stringify(content).match(
    /Sentinel Mission|Environmental Monitoring System/,
  ),
  "Wrong demonstration project in content",
);
assert.ok(
  fs.existsSync(path.join(root, "dist/index.html")),
  "Build the production site before validation",
);
for (const file of [
  "audio/manifest.json",
  "audio/vocabulary.json",
  "media/demos.json",
  "docs/index.html",
  paperPath.slice(1),
]) {
  assert.ok(
    fs.existsSync(path.join(root, "dist", file)),
    `Build omitted ${file}`,
  );
}
for (const track of vocabularyAudio) {
  const built = path.join(root, "dist", track);
  assert.ok(fs.existsSync(built), `Build omitted vocabulary recording: ${track}`);
  assert.equal(fs.statSync(built).size, fs.statSync(path.join(root, "public", track)).size, `Built vocabulary recording differs: ${track}`);
}
assert.deepEqual(read("dist/audio/vocabulary.json"), vocabulary, "Production vocabulary manifest is stale");
assert.ok(fs.readFileSync(path.join(root, "dist", paperPath)).equals(paper), "Production white paper differs from version 16 source");
for (const directory of ["public", "dist"]) {
  const files = fs.readdirSync(path.join(root, directory), { recursive: true });
  assert.ok(!files.some((file) => /SSTPA[-_]Methodology[-_]White[-_]Paper[-_]v14\.docx$/i.test(file)), `Retired version 14 white paper remains in ${directory}`);
}
console.log(
  "Verified: 22 existing narrations, 28 distinct same-voice vocabulary clips measured at 30–60 seconds, 18 silent FireSat walkthroughs, captions, preserved public assets, version 16 white paper, vocabulary routing, and production assets.",
);
