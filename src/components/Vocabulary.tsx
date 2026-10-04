import { useEffect, useState } from "react";
import "./Vocabulary.css";

type VocabularyTerm = {
  slug: string;
  term: string;
  category: string;
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

function TermCard({ term, index }: { term: VocabularyTerm; index: number }) {
  const [audioFailed, setAudioFailed] = useState(false);
  return (
    <article className="vocabulary-card" id={term.slug} aria-labelledby={`${term.slug}-title`}>
      <div className="vocabulary-card-top">
        <span className="eyebrow">{term.category}</span>
        <span className="vocabulary-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h2 id={`${term.slug}-title`}>{term.term}</h2>
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
      <div className="vocabulary-sources">
        <p>{term.sourceLabel}</p>
        <ul aria-label={`References for ${term.term}`}>
          {term.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url}>{source.label} <span aria-hidden="true">↗</span></a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Vocabulary() {
  const [terms, setTerms] = useState<VocabularyTerm[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All terms");

  useEffect(() => {
    const abort = new AbortController();
    setStatus("loading");
    fetch("/audio/vocabulary.json", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Vocabulary unavailable");
        return response.json() as Promise<VocabularyManifest>;
      })
      .then((manifest) => {
        if (!Array.isArray(manifest.terms) || !manifest.terms.length) {
          throw new Error("Vocabulary unavailable");
        }
        setTerms(manifest.terms);
        setStatus("ready");
      })
      .catch(() => {
        if (!abort.signal.aborted) setStatus("error");
      });
    return () => abort.abort();
  }, [attempt]);

  const categories = ["All terms", ...new Set(terms.map((term) => term.category))];
  const search = query.trim().toLowerCase();
  const shown = terms.filter((term) =>
    (category === "All terms" || category === term.category) &&
    `${term.term} ${term.definition} ${term.script}`.toLowerCase().includes(search),
  );

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
          <div className="vocabulary-sound-mark" aria-hidden="true">
            {[14, 24, 44, 30, 58, 40, 70, 48, 58, 30, 44, 24, 14].map((height, index) => (
              <i key={index} style={{ height }} />
            ))}
          </div>
          <p className="eyebrow">A MINUTE TO MAKE A CONNECTION</p>
          <p>Listen to a single idea. Read its transcript. Follow the source when you want to go deeper.</p>
          <div className="vocabulary-intro-meta">
            <span><strong>30–60</strong> seconds per track</span>
            <span><strong>v16</strong> white paper vocabulary</span>
          </div>
        </div>
      </section>
      <section className="vocabulary-library shell" id="vocabulary-terms" aria-label="SSTPA vocabulary terms">
        <div className="section-label">
          <span>FROM SYSTEMS THINKING TO ASSURANCE</span>
          <span>LISTEN / READ / EXPLORE</span>
        </div>
        <div className="vocabulary-context">
          <p>
            Some words carry a specific meaning here. SSTPA’s <strong>Loss</strong> describes attacker effort for
            one asset, one Assurance, and one environment. In STPA, a loss is an unacceptable outcome for stakeholders.
            The entries below make these distinctions explicit.
          </p>
          <a href="/files/SSTPA-Methodology-White-Paper-v16.docx" download>Read the white paper <span aria-hidden="true">↓</span></a>
        </div>
        {status === "loading" && <p className="vocabulary-status" role="status">Loading the vocabulary…</p>}
        {status === "error" && (
          <div className="vocabulary-status" role="status">
            <h2>The vocabulary could not load.</h2>
            <p>Please try again. The white paper is also available above.</p>
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
            <p className="directory-count vocabulary-count" aria-live="polite">{shown.length} OF {terms.length} TERMS</p>
            <div className="vocabulary-grid">
              {shown.map((term) => <TermCard key={term.slug} term={term} index={terms.indexOf(term)} />)}
            </div>
            {!shown.length && (
              <div className="empty">
                <h2>No matching terms.</h2>
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
