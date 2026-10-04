import { useEffect, useState } from "react";
import {
  selectVocabularyTerms,
  validateVocabularyDependencies,
  VocabularyDependencyError,
} from "./vocabularyDependencies";
import "./Vocabulary.css";

type VocabularyTerm = {
  slug: string;
  term: string;
  category: string;
  prerequisites: string[];
  definition: string;
  script: string;
  sourceLabel: string;
  sources: { label: string; url: string }[];
  audio: {
    src: string;
    durationSeconds: number;
    duration: string;
    voice: string;
  };
};
type VocabularyManifest = { version: number; terms: VocabularyTerm[] };

function TermCard({
  term,
  index,
  selection,
}: {
  term: VocabularyTerm;
  index: number;
  selection?: "Prerequisite" | "Search match" | "Selected term";
}) {
  const [audioFailed, setAudioFailed] = useState(false);
  return (
    <article className="vocabulary-card" id={term.slug} aria-labelledby={`${term.slug}-title`}>
      <div className="vocabulary-card-top">
        <span className="eyebrow">{term.category}</span>
        <span className="vocabulary-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      </div>
      {selection && <p className={`vocabulary-selection${selection === "Prerequisite" ? " is-prerequisite" : ""}`}>{selection}</p>}
      <h3 id={`${term.slug}-title`}>{term.term}</h3>
      <p className="vocabulary-definition">{term.definition}</p>
      <div className="vocabulary-listen">
        <div className="vocabulary-listen-label">
          <span>LISTEN TO THE TERM</span>
          <span>{term.audio.duration}</span>
        </div>
        <audio
          controls
          preload="none"
          src={term.audio.src}
          aria-label={`${term.term}: definition and importance in SSTPA`}
          onPlay={(event) => {
            setAudioFailed(false);
            const current = event.currentTarget;
            document.querySelectorAll("audio").forEach((audio) => {
              if (audio !== current) audio.pause();
            });
          }}
          onError={() => setAudioFailed(true)}
        >
          <a href={term.audio.src}>Listen to the {term.term} audio</a>
        </audio>
        {audioFailed && (
          <p role="status" className="audio-error">
            Audio could not load. <a href={term.audio.src}>Open the audio file</a> or read the transcript below.
          </p>
        )}
      </div>
      <details className="transcript vocabulary-transcript">
        <summary>Read transcript <span aria-hidden="true">+</span></summary>
        <p>{term.script}</p>
      </details>
      {(term.sourceLabel || term.sources.length > 0) && (
        <div className="vocabulary-sources">
          {term.sourceLabel && <p>{term.sourceLabel}</p>}
          {term.sources.length > 0 && (
            <ul aria-label={`References for ${term.term}`}>
              {term.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url}>{source.label} <span aria-hidden="true">↗</span></a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}

export default function Vocabulary() {
  const [terms, setTerms] = useState<VocabularyTerm[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All terms");
  const [sequenceError, setSequenceError] = useState(false);

  useEffect(() => {
    const abort = new AbortController();
    setStatus("loading");
    setSequenceError(false);
    fetch("/audio/vocabulary.json", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Vocabulary unavailable");
        return response.json() as Promise<VocabularyManifest>;
      })
      .then((manifest) => {
        validateVocabularyDependencies(manifest.terms);
        setTerms(manifest.terms);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (!abort.signal.aborted) {
          setSequenceError(error instanceof VocabularyDependencyError);
          setStatus("error");
        }
      });
    return () => abort.abort();
  }, [attempt]);

  const categories = ["All terms", ...new Set(terms.map((term) => term.category))];
  const search = query.trim().toLowerCase();
  const filtering = category !== "All terms" || search.length > 0;
  const selected = terms.length > 0
    ? selectVocabularyTerms(terms, (term) =>
        (category === "All terms" || category === term.category) &&
        `${term.term} ${term.definition} ${term.script}`.toLowerCase().includes(search),
      )
    : { terms: [], matchedSlugs: new Set<string>(), prerequisiteSlugs: new Set<string>() };
  const shown = selected.terms;

  return (
    <>
      <section className="vocabulary-intro shell">
        <div className="vocabulary-intro-copy">
          <p className="eyebrow">SSTPA VOCABULARY / A SHARED LANGUAGE</p>
          <h1>Clear terms.<br /><em>Connected understanding.</em></h1>
          <p className="vocabulary-description">
            Explore the ideas behind the method, one short explanation at a time.
            Each track explains what a term means in SSTPA, why it matters, and where the idea comes from.
          </p>
          <a className="text-link" href="#vocabulary-terms">Explore the vocabulary <span aria-hidden="true">↓</span></a>
        </div>
        <div className="vocabulary-intro-note">
          <p>
            These audio summaries explain the system security terminology used in SSTPA.
            Terms follow concept dependency order: later explanations build on earlier
            concepts, and filtered results include their prerequisites.
          </p>
        </div>
      </section>
      <section className="vocabulary-library shell" id="vocabulary-terms" aria-label="SSTPA vocabulary terms">
        <div className="section-label">
          <span>FROM SYSTEMS THINKING TO ASSURANCE</span>
          <span>LISTEN / READ / EXPLORE</span>
        </div>
        <h2 className="vocabulary-library-title">Audio vocabulary</h2>
        <div className="vocabulary-context">
          <p>
            Some words carry a specific meaning here. SSTPA’s <strong>Loss</strong> describes attacker effort for
            one asset, one Assurance, and one environment. In STPA, a loss is an unacceptable outcome for stakeholders.
            The entries below make these distinctions explicit.
          </p>
        </div>
        {status === "loading" && <p className="vocabulary-status" role="status">Loading the vocabulary…</p>}
        {status === "error" && (
          <div className="vocabulary-status" role="status">
            <h3>The vocabulary could not load.</h3>
            <p>{sequenceError
              ? "The learning sequence is unavailable, so complete results cannot be shown. Please try again."
              : "Please try again to load the vocabulary and its audio summaries."}</p>
            <button className="button outline" onClick={() => setAttempt((value) => value + 1)}>Try again <span aria-hidden="true">↻</span></button>
          </div>
        )}
        {status === "ready" && (
          <>
            <div className="vocabulary-controls">
              <div className="filters vocabulary-filters" role="group" aria-label="Filter vocabulary by category">
                {categories.map((name) => (
                  <button key={name} className={name === category ? "active" : ""} aria-pressed={name === category} onClick={() => setCategory(name)}>{name}</button>
                ))}
              </div>
              <label className="search vocabulary-search">
                <span className="sr-only">Search vocabulary terms and definitions</span>
                <input type="search" placeholder="Find a term or idea…" value={query} onChange={(event) => setQuery(event.target.value)} />
                <span aria-hidden="true">⌕</span>
              </label>
            </div>
            <p className="vocabulary-filter-note">Categories and search include prerequisite terms automatically, in learning order.</p>
            <p className="directory-count vocabulary-count" aria-live="polite">
              {filtering
                ? `${selected.matchedSlugs.size} ${search ? "MATCHING" : "SELECTED"} ${selected.matchedSlugs.size === 1 ? "TERM" : "TERMS"} · ${selected.prerequisiteSlugs.size} ${selected.prerequisiteSlugs.size === 1 ? "PREREQUISITE" : "PREREQUISITES"} · ${shown.length} OF ${terms.length} TERMS`
                : `${shown.length} TERMS IN LEARNING ORDER`}
            </p>
            <div className="vocabulary-grid">
              {shown.map((term) => (
                <TermCard
                  key={term.slug}
                  term={term}
                  index={terms.indexOf(term)}
                  selection={filtering
                    ? selected.prerequisiteSlugs.has(term.slug) ? "Prerequisite" : search ? "Search match" : "Selected term"
                    : undefined}
                />
              ))}
            </div>
            {!shown.length && (
              <div className="empty">
                <h3>No matching terms.</h3>
                <p>Try a different word or return to the complete vocabulary.</p>
                <button className="button outline" onClick={() => { setQuery(""); setCategory("All terms"); }}>Show all terms <span aria-hidden="true">↗</span></button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
