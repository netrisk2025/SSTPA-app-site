import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve(import.meta.dirname, "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const content = read("src/content.json");
const narrations = read("public/audio/scripts.json");
const audio = read("public/audio/manifest.json");
const demos = read("public/media/demos.json");
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
    url.startsWith("/") && !url.includes(".."),
    `Invalid asset path: ${url}`,
  );
  const filename = path.join(root, "public", url);
  assert.ok(fs.existsSync(filename), `Missing asset: ${url}`);
  assert.ok(fs.statSync(filename).size > 0, `Empty asset: ${url}`);
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
asset("/files/SSTPA-Methodology-White-Paper-v14.docx");
const paper = fs.readFileSync(
  path.join(root, "public/files/SSTPA-Methodology-White-Paper-v14.docx"),
);
assert.equal(
  paper.subarray(0, 2).toString(),
  "PK",
  "White paper must be a DOCX archive",
);
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
  "media/demos.json",
  "docs/index.html",
  "files/SSTPA-Methodology-White-Paper-v14.docx",
]) {
  assert.ok(
    fs.existsSync(path.join(root, "dist", file)),
    `Build omitted ${file}`,
  );
}
console.log(
  "Verified: 22 distinct 1–2 minute narrations, 18 silent FireSat walkthroughs, captions, source content, guide links, and production assets.",
);
