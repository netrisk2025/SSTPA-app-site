export type VocabularyDependencyTerm = {
  slug: string;
  prerequisites: string[];
};

export class VocabularyDependencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VocabularyDependencyError";
  }
}

/** A manifest is a complete learning sequence: each prerequisite precedes its dependents. */
export function validateVocabularyDependencies(
  terms: readonly VocabularyDependencyTerm[],
): void {
  if (!Array.isArray(terms) || terms.length === 0) {
    throw new VocabularyDependencyError("The vocabulary learning sequence is empty.");
  }

  const bySlug = new Map<string, VocabularyDependencyTerm>();
  const positions = new Map<string, number>();
  terms.forEach((term, index) => {
    if (!term || typeof term.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(term.slug)) {
      throw new VocabularyDependencyError(`Invalid vocabulary slug at position ${index + 1}.`);
    }
    if (bySlug.has(term.slug)) {
      throw new VocabularyDependencyError(`Duplicate vocabulary term: ${term.slug}.`);
    }
    if (!Array.isArray(term.prerequisites) || term.prerequisites.some((slug: unknown) => typeof slug !== "string" || !slug)) {
      throw new VocabularyDependencyError(`Invalid prerequisites for ${term.slug}.`);
    }
    if (new Set(term.prerequisites).size !== term.prerequisites.length) {
      throw new VocabularyDependencyError(`Duplicate prerequisite for ${term.slug}.`);
    }
    bySlug.set(term.slug, term);
    positions.set(term.slug, index);
  });

  for (const term of terms) {
    for (const prerequisite of term.prerequisites) {
      if (!bySlug.has(prerequisite)) {
        throw new VocabularyDependencyError(`Missing prerequisite ${prerequisite} for ${term.slug}.`);
      }
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  function visit(slug: string): void {
    if (visiting.has(slug)) {
      throw new VocabularyDependencyError(`Cyclic vocabulary prerequisites include ${slug}.`);
    }
    if (visited.has(slug)) return;
    visiting.add(slug);
    for (const prerequisite of bySlug.get(slug)!.prerequisites) visit(prerequisite);
    visiting.delete(slug);
    visited.add(slug);
  }
  for (const term of terms) visit(term.slug);

  for (const term of terms) {
    for (const prerequisite of term.prerequisites) {
      if (positions.get(prerequisite)! >= positions.get(term.slug)!) {
        throw new VocabularyDependencyError(`Prerequisite ${prerequisite} must appear before ${term.slug}.`);
      }
    }
  }
}

/** Include every transitive prerequisite without changing the manifest's learning order. */
export function selectVocabularyTerms<T extends VocabularyDependencyTerm>(
  terms: readonly T[],
  matches: (term: T) => boolean,
): { terms: T[]; matchedSlugs: Set<string>; prerequisiteSlugs: Set<string> } {
  validateVocabularyDependencies(terms);
  const bySlug = new Map(terms.map((term) => [term.slug, term]));
  const matchedSlugs = new Set(terms.filter(matches).map((term) => term.slug));
  const included = new Set<string>();

  function include(slug: string): void {
    if (included.has(slug)) return;
    included.add(slug);
    for (const prerequisite of bySlug.get(slug)!.prerequisites) include(prerequisite);
  }
  for (const slug of matchedSlugs) include(slug);

  return {
    terms: terms.filter((term) => included.has(term.slug)),
    matchedSlugs,
    prerequisiteSlugs: new Set([...included].filter((slug) => !matchedSlugs.has(slug))),
  };
}
