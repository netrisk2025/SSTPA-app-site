import assert from "node:assert/strict";
import {
  selectVocabularyTerms,
  validateVocabularyDependencies,
  VocabularyDependencyError,
} from "../src/components/vocabularyDependencies.ts";

export function verifyVocabularyDependencyBehavior() {
  // Two selected terms share an indirect foundation. Unrelated material stays hidden.
  const terms = [
    { slug: "foundation", prerequisites: [] },
    { slug: "unrelated", prerequisites: [] },
    { slug: "left", prerequisites: ["foundation"] },
    { slug: "right", prerequisites: ["foundation"] },
    { slug: "application", prerequisites: ["left", "right"] },
    { slug: "evidence", prerequisites: ["right"] },
  ];
  const unchanged = structuredClone(terms);
  const selected = selectVocabularyTerms(terms, (term) =>
    ["application", "evidence"].includes(term.slug),
  );
  assert.deepEqual(selected.terms.map((term) => term.slug), [
    "foundation", "left", "right", "application", "evidence",
  ], "Selection must include shared transitive prerequisites once, in learning order");
  assert.deepEqual(selected.matchedSlugs, new Set(["application", "evidence"]));
  assert.deepEqual(selected.prerequisiteSlugs, new Set(["foundation", "left", "right"]));
  assert.deepEqual(terms, unchanged, "Filtering must not mutate the learning sequence");

  const overlap = selectVocabularyTerms(terms, (term) =>
    ["right", "application"].includes(term.slug),
  );
  assert.ok(overlap.matchedSlugs.has("right"));
  assert.ok(!overlap.prerequisiteSlugs.has("right"), "A direct match must retain its match label");
  const empty = selectVocabularyTerms(terms, () => false);
  assert.deepEqual(empty.terms, []);
  assert.equal(empty.matchedSlugs.size + empty.prerequisiteSlugs.size, 0);
  assert.deepEqual(selectVocabularyTerms(terms, () => true).terms, terms);

  const invalid = [
    {
      message: /Missing prerequisite/,
      terms: [{ slug: "dependent", prerequisites: ["missing"] }],
    },
    {
      message: /Cyclic vocabulary prerequisites/,
      terms: [
        { slug: "one", prerequisites: ["three"] },
        { slug: "two", prerequisites: ["one"] },
        { slug: "three", prerequisites: ["two"] },
      ],
    },
    {
      message: /must appear before/,
      terms: [
        { slug: "dependent", prerequisites: ["foundation"] },
        { slug: "foundation", prerequisites: [] },
      ],
    },
    {
      message: /Duplicate vocabulary term/,
      terms: [
        { slug: "same", prerequisites: [] },
        { slug: "same", prerequisites: [] },
      ],
    },
  ];
  for (const fixture of invalid) {
    for (const operation of [
      () => validateVocabularyDependencies(fixture.terms),
      () => selectVocabularyTerms(fixture.terms, () => false),
    ]) {
      assert.throws(operation, (error) =>
        error instanceof VocabularyDependencyError && fixture.message.test(error.message),
      "Invalid prerequisites must be rejected, even when filtering hides the offending term");
    }
  }
}

export function verifyVocabularyLearningSequence(terms) {
  validateVocabularyDependencies(terms);
  const slugs = terms.map((term) => term.slug);
  const criticalityBlock = [
    "asset", "criticality", "mission-critical", "safety-critical",
    "flight-critical", "security-critical", "assurance-property",
  ];
  const assuranceBlock = [
    "assurance-confidence", "confidentiality", "integrity", "availability",
    "authenticity", "non-repudiation", "trustworthy", "sstpa-loss",
  ];
  for (const block of [criticalityBlock, assuranceBlock]) {
    const start = slugs.indexOf(block[0]);
    assert.ok(start >= 0, `Missing learning-sequence anchor: ${block[0]}`);
    assert.deepEqual(slugs.slice(start, start + block.length), block,
      `Required vocabulary order differs after ${block[0]}`);
  }

  function checkSelection(predicate, description, expectMatch = true) {
    const selected = selectVocabularyTerms(terms, predicate);
    const selectedSlugs = selected.terms.map((term) => term.slug);
    const positions = new Map(selectedSlugs.map((slug, index) => [slug, index]));
    const expectedMatches = new Set(terms.filter(predicate).map((term) => term.slug));
    assert.deepEqual(selected.matchedSlugs, expectedMatches, `${description}: matches differ`);
    assert.equal(expectedMatches.size > 0, expectMatch, `${description}: unexpected search coverage`);
    assert.equal(positions.size, selected.terms.length, `${description}: duplicate prerequisite`);
    assert.deepEqual(selectedSlugs, slugs.filter((slug) => positions.has(slug)),
      `${description}: result changed the learning order`);
    for (const term of selected.terms) {
      assert.notEqual(selected.matchedSlugs.has(term.slug), selected.prerequisiteSlugs.has(term.slug),
        `${description}: each term must be classified as a match or prerequisite`);
      for (const prerequisite of term.prerequisites) {
        assert.ok(positions.has(prerequisite), `${description}: omitted ${prerequisite}`);
        assert.ok(positions.get(prerequisite) < positions.get(term.slug),
          `${description}: ${prerequisite} follows its dependent`);
      }
    }
    validateVocabularyDependencies(selected.terms.length > 0 ? selected.terms : terms);
  }

  checkSelection(() => true, "All terms");
  for (const category of new Set(terms.map((term) => term.category)))
    checkSelection((term) => term.category === category, `Category ${category}`);
  for (const query of ["authenticity", "loss", "firmware", "critical", "non-repudiation"])
    checkSelection((term) =>
      `${term.term} ${term.definition} ${term.script}`.toLowerCase().includes(query),
    `Search ${query}`);
  checkSelection((term) =>
    `${term.term} ${term.definition} ${term.script}`.includes("no-such-vocabulary-result"),
  "Unmatched search", false);
}
