import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  verifyVocabularyDependencyBehavior,
  verifyVocabularyLearningSequence,
} from "./verify-vocabulary-dependencies.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const content = read("src/content.json");
const narrations = read("public/audio/scripts.json");
const audio = read("public/audio/manifest.json");
const demos = read("public/media/demos.json");
const vocabulary = read("public/audio/vocabulary.json");
const paperPath = "/files/SSTPA-Methodology-White-Paper-v17.docx";
const preservationBaseline = read("scripts/preservation-baseline.json");
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
assert.equal(vocabulary.terms.length, 41, "All 41 vocabulary terms must be present");
assert.equal(
  new Set(vocabulary.terms.map((term) => term.slug)).size,
  41,
  "Vocabulary term slugs must be unique",
);
verifyVocabularyDependencyBehavior();
verifyVocabularyLearningSequence(vocabulary.terms);
assert.ok(!/\bcertifiability\b/i.test(JSON.stringify(vocabulary.terms)),
  "Certifiability is outside this vocabulary revision");
const primarySourceHosts = new Set([
  "doi.org", "csrc.nist.gov", "nvlpubs.nist.gov", "www.nist.gov",
  "standards.nasa.gov", "www.nasa.gov", "www.faa.gov",
  "psas.scripts.mit.edu", "dspace.mit.edu", "sebokwiki.org",
  "scsc.uk", "www.schneier.com",
  "www.esd.whs.mil", "www.cdse.edu",
]);
const prohibitedPaperReference = /sstpa[-_\s]*(?:methodology[-_\s]*)?(?:white[-_\s]*paper|srs)|\bSSTPA\b.{0,80}\b(?:white[\s-]*paper|SRS)\b|\b(?:white[\s-]*paper|SRS)\b.{0,80}\bSSTPA\b|\bv(?:ersion\s*)?16\b/i;
const vocabularyAudio = new Set();
const vocabularyAudioHashes = new Set();
const existingAudio = new Set(Object.values(audio).map((track) => track.src));
for (const term of vocabulary.terms) {
  assert.match(term.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid vocabulary slug");
  for (const field of ["term", "category", "definition", "script", "sourceLabel"])
    assert.ok(
      typeof term[field] === "string" && term[field].trim().length > 0,
      `Missing vocabulary ${field}: ${term.slug}`,
    );
  assert.ok(term.sources?.length > 0, `Missing vocabulary references: ${term.slug}`);
  assert.ok(!prohibitedPaperReference.test(term.sourceLabel),
    `SSTPA white-paper or SRS attribution on vocabulary card: ${term.slug}`);
  for (const source of term.sources) {
    assert.ok(source.label?.trim(), `Unlabeled vocabulary reference: ${term.slug}`);
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:", `Vocabulary reference must use HTTPS: ${term.slug}`);
    assert.ok(primarySourceHosts.has(url.hostname), `Unreviewed primary-source host: ${source.url}`);
    assert.ok(!prohibitedPaperReference.test(`${source.label} ${decodeURIComponent(source.url)}`),
      `SSTPA white-paper or SRS reference on vocabulary card: ${term.slug}`);
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
  const audioHash = createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
  assert.ok(!vocabularyAudioHashes.has(audioHash), `Vocabulary recordings have duplicate audio bytes: ${term.slug}`);
  vocabularyAudioHashes.add(audioHash);
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

// Preserve the published baseline while permitting this release's explicit changes.
// Existing recordings, guides, vocabulary, content, and other downloads remain exact.
const authorizedChanges = new Set([
  "src/App.tsx", "src/styles.css", "src/components/ParticleScene.tsx",
  "src/components/ParticleScene.css", "public/sitemap.xml", "vercel.json",
  "scripts/verify-site.mjs", "README.md", "CONTENT_SOURCE.md", "FloorPlan.md",
  "package.json",
]);
const retiredPaper = "public/files/SSTPA-Methodology-White-Paper-v16.docx";
let preservedVocabularyClips = 0;
let preservedFiles = 0;
for (const [filename, expectedHash] of Object.entries(preservationBaseline)) {
  if (filename === retiredPaper || authorizedChanges.has(filename)) continue;
  const filepath = path.join(root, filename);
  assert.ok(fs.existsSync(filepath), `Existing file removed: ${filename}`);
  const actualHash = createHash("sha256").update(fs.readFileSync(filepath)).digest("hex");
  assert.equal(actualHash, expectedHash, `Protected baseline file changed: ${filename}`);
  preservedFiles++;
  if (/^public\/audio\/vocabulary-[^/]+\.mp3$/.test(filename)) preservedVocabularyClips++;
}
assert.equal(preservedVocabularyClips, 41, "All 41 existing vocabulary recordings must remain byte-for-byte unchanged");
assert.ok(preservedFiles >= 200, "The preservation baseline must include the complete existing site");
const app = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
for (const href of ["/installation", "/tools", "/methodology", "/vocabulary", "/docs/", "/tutorials"])
  assert.ok(app.includes(`href="${href}"`), `Missing navigation target: ${href}`);
for (const label of ["Explore SSTPA Tools", "Discover the method", "Speak the vocabulary", "Experience a Tutorial"])
  assert.ok(app.includes(label), `Missing landing-page action: ${label}`);
assert.ok(app.includes('path === "/tutorials"') && app.includes("<Tutorials />"), "Tutorial route must render its page");
assert.ok(app.includes('VERSION 17') && app.includes(paperPath), "Site must advertise the version 17 white paper");
asset("/Audio/Systems(1).wav");
asset("/files/SSTPA-Tools-White-Paper-v2.docx");
asset("/media/introduction.mp4");
asset("/media/introduction-poster.jpg");

const vercel = read("vercel.json");
assert.ok(vercel.rewrites.some((rule) => rule.source === "/vocabulary" && rule.destination === "/index.html"), "Vocabulary direct navigation must have a production rewrite");
const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
assert.ok(sitemap.includes("<loc>https://www.sstpa.app/vocabulary</loc>"), "Vocabulary page missing from sitemap");
assert.ok(vercel.rewrites.some((rule) => rule.source === "/tutorials" && rule.destination === "/index.html"), "Tutorial direct navigation must have a production rewrite");
assert.ok(sitemap.includes("<loc>https://www.sstpa.app/tutorials</loc>"), "Tutorial page missing from sitemap");
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
  assert.ok(fs.readFileSync(built).equals(fs.readFileSync(path.join(root, "public", track))), `Built vocabulary recording differs: ${track}`);
}
assert.deepEqual(read("dist/audio/vocabulary.json"), vocabulary, "Production vocabulary manifest is stale");
assert.ok(fs.readFileSync(path.join(root, "dist", paperPath)).equals(paper), "Production white paper differs from version 17 source");
for (const directory of ["public", "dist"]) {
  const files = fs.readdirSync(path.join(root, directory), { recursive: true });
  assert.ok(!files.some((file) => /SSTPA[-_]Methodology[-_]White[-_]Paper[-_]v(?:14|16)\.docx$/i.test(file)), `A retired version 14 or 16 white paper remains in ${directory}`);
}
console.log(
  "Verified: 22 existing narrations, 41 distinct same-voice vocabulary clips measured at 30–60 seconds, dependency order and filtered prerequisite closure, primary-source references, all 41 vocabulary clips and protected baseline assets unchanged, four landing actions, 18 silent FireSat walkthroughs, version 17 white paper, vocabulary and tutorial routing, and production assets.",
);
