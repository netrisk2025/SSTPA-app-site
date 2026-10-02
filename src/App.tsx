import { useEffect, useRef, useState } from "react";
import source from "./content.json";
import ParticleScene from "./components/ParticleScene";

type Tool = {
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  overview: string;
  capabilities: string[];
  exampleSteps: string[];
  guidePath: string;
  posterPath: string;
  sourceNotes?: string[];
};
type Clip = {
  src: string;
  poster?: string;
  captions?: string;
  duration?: string;
  title?: string;
  description?: string;
  note?: string;
  steps?: string[];
  transcript?: string;
};
type Script = {
  slug: string;
  title: string;
  script: string;
  estimatedDurationSeconds: number;
};
type AudioEntry = { src: string; duration?: string; voice?: string };
const tools = source.tools as Tool[];
const paper = "/files/SSTPA-Methodology-White-Paper-v14.docx";
const count = (n: number) => String(n).padStart(2, "0");
const Arrow = ({ down = false }: { down?: boolean }) => (
  <span aria-hidden="true">{down ? "↓" : "↗"}</span>
);
function useJson<T>(path: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    const abort = new AbortController();
    fetch(path, { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Unavailable");
        return r.json();
      })
      .then(setValue)
      .catch(() => {});
    return () => abort.abort();
  }, [path]);
  return value;
}
function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`ornament ${className}`}
      viewBox="0 0 320 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 32h100c25 0 27-22 43-22 10 0 17 12 17 22s-7 22-17 22c-16 0-18-22-43-22m220 0H220c-25 0-27-22-43-22-10 0-17 12-17 22s7 22 17 22c16 0 18-22 43-22"
        stroke="currentColor"
      />
      <path d="m160 20 7 12-7 12-7-12Z" stroke="currentColor" />
      <circle cx="89" cy="32" r="2" fill="currentColor" />
      <circle cx="231" cy="32" r="2" fill="currentColor" />
    </svg>
  );
}
function Brand() {
  return (
    <a className="brand" href="/" aria-label="SSTPA Tools home">
      <svg
        className="brand-flower"
        viewBox="0 0 48 56"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 51V24M24 41C5 37 2 21 9 13c8 1 13 13 15 23M24 41c19-4 22-20 15-28-8 1-13 13-15 23M24 32C12 19 12 8 24 3c12 5 12 16 0 29Z"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M24 48C12 52 7 46 9 40c8-3 12 2 15 8Zm0 0c12 4 17-2 15-8-8-3-12 2-15 8Z"
          stroke="currentColor"
        />
        <path
          d="M24 4v24M10 14l14 26 14-26"
          stroke="currentColor"
          strokeWidth=".5"
        />
        <circle cx="24" cy="53" r="1.5" fill="currentColor" />
      </svg>
      <span>
        SSTPA <small>TOOLS</small>
      </span>
    </a>
  );
}
function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <Brand />
      <button
        className="menu-button"
        aria-controls="primary-nav"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"} <span>{open ? "−" : "+"}</span>
      </button>
      <nav
        id="primary-nav"
        className={open ? "is-open" : ""}
        aria-label="Primary"
      >
        <a
          href="/installation"
          aria-current={path === "/installation" ? "page" : undefined}
        >
          Get started
        </a>
        <a
          href="/tools"
          aria-current={path.startsWith("/tools") ? "page" : undefined}
        >
          The tools
        </a>
        <a
          href="/methodology"
          aria-current={path === "/methodology" ? "page" : undefined}
        >
          The methodology
        </a>
        <a href="/docs/">
          Documentation <Arrow />
        </a>
      </nav>
      <a className="header-paper" href={paper} download>
        White paper <Arrow down />
      </a>
    </header>
  );
}
function Footer() {
  return (
    <footer className="site-footer shell">
      <div className="footer-call">
        <p className="eyebrow">FROM THE MISSION TO THE EVIDENCE</p>
        <a href="/tools">
          See the whole system.
          <Arrow />
        </a>
      </div>
      <div className="footer-grid">
        <Brand />
        <p>
          System Security-Theoretic
          <br />
          Process Analysis
        </p>
        <div>
          <a href="/installation">Installation & administration</a>
          <a href="/tools/workspace">The workspace</a>
          <a href="/docs/">Online documentation</a>
          <a href={paper} download>
            Methodology white paper ↓
          </a>
        </div>
      </div>
      <div className="footer-meta">
        <span>Systems thinking. Engineering intent.</span>
        <span>
          © {new Date().getFullYear()} Nicholas Triska. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
function AudioGuide({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const scripts = useJson<{ pages: Script[] }>("/audio/scripts.json", {
    pages: [],
  });
  const tracks = useJson<Record<string, AudioEntry>>(
    "/audio/manifest.json",
    {},
  );
  const script = scripts.pages.find((p) => p.slug === slug);
  const track = tracks[slug];
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  async function toggle() {
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else {
      try {
        await audio.current.play();
        setError(false);
      } catch {
        setError(true);
      }
    }
  }
  return (
    <div className={`audio-guide ${compact ? "compact" : ""}`}>
      <div className="audio-main">
        <button
          className="audio-play"
          onClick={toggle}
          disabled={!track}
          aria-label={`${playing ? "Pause" : "Play"} ${script?.title || "page"} narration`}
          aria-pressed={playing}
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
        </button>
        <div className="audio-info">
          <span className="eyebrow">
            {track ? "A GUIDED PERSPECTIVE" : "THE GUIDED PERSPECTIVE"}
          </span>
          <strong>
            {playing
              ? "Listening…"
              : track
                ? "Listen to this page"
                : "Read the page introduction"}
          </strong>
        </div>
        <div
          className={`waveform ${playing ? "is-playing" : ""}`}
          aria-hidden="true"
        >
          {Array.from({ length: 29 }, (_, i) => (
            <i
              key={i}
              style={{
                height: `${7 + ((i * 17 + 9) % 29)}px`,
                animationDelay: `${i * 0.065}s`,
              }}
            />
          ))}
        </div>
        <span className="audio-duration">{track?.duration || "READ"}</span>
      </div>
      {track && (
        <>
          <audio
            ref={audio}
            src={track.src}
            preload="none"
            onPlay={() => {
              document.querySelectorAll("audio").forEach((a) => {
                if (a !== audio.current) a.pause();
              });
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => setError(true)}
            onTimeUpdate={() => {
              const a = audio.current;
              if (a)
                setProgress(
                  a.duration ? (a.currentTime / a.duration) * 100 : 0,
                );
            }}
          />
          <label className="audio-seek">
            <span className="sr-only">Seek narration</span>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (audio.current && Number.isFinite(audio.current.duration)) {
                  audio.current.currentTime =
                    (audio.current.duration * value) / 100;
                  setProgress(value);
                }
              }}
            />
          </label>
        </>
      )}
      {error && (
        <p role="status" className="audio-error">
          Audio could not play. <a href={track?.src}>Open the audio file</a> or
          read the transcript below.
        </p>
      )}
      {script && (
        <details className="transcript">
          <summary>
            {track ? "Read transcript" : "Read introduction"} <span>+</span>
          </summary>
          <p>{script.script}</p>
        </details>
      )}
    </div>
  );
}
function Demo({ tool }: { tool: Tool }) {
  const demos = useJson<Record<string, Clip>>("/media/demos.json", {});
  const clip = demos[tool.slug];
  const [failed, setFailed] = useState(false);
  return (
    <div className="demo">
      <div className="demo-top">
        <span>
          <i /> FIRESAT / {tool.name.toUpperCase()}
        </span>
        <span>
          {clip ? "SILENT SCREEN WALKTHROUGH" : "WORKSPACE REFERENCE"}
        </span>
      </div>
      {clip && !failed ? (
        <video
          key={clip.src}
          controls
          playsInline
          muted
          preload="metadata"
          poster={clip.poster}
          aria-label={`${tool.name} FireSat silent screen walkthrough`}
          onError={() => setFailed(true)}
        >
          <source src={clip.src} type="video/mp4" />
          {clip.captions && (
            <track
              kind="captions"
              src={clip.captions}
              srcLang="en"
              label="Walkthrough steps"
            />
          )}
        </video>
      ) : (
        <div className="demo-reference">
          <img
            src={tool.posterPath}
            alt={`${tool.name} interface reference; not a FireSat recording`}
            loading="lazy"
          />
          <p>
            {failed
              ? "The walkthrough could not load. Use the written steps below."
              : "Interface reference. Follow the FireSat steps below in your project."}
          </p>
        </div>
      )}
      <div className="demo-bottom">
        <span>
          {clip?.description || "Explore the interface with the written guide."}
        </span>
        {clip && <span>{clip.duration} · NO AUDIO</span>}
      </div>
      {clip?.note && <p className="demo-note">{clip.note}</p>}
      {clip?.steps && (
        <details className="transcript">
          <summary>
            Walkthrough steps <span>+</span>
          </summary>
          <ol>
            {clip.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
function Home() {
  return (
    <>
      <section className="hero shell">
        <div className="hero-orbit" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="spark" /> SYSTEM SECURITY, BY DESIGN
          </p>
          <h1>
            Complex systems.
            <br />
            <em>Connected</em>
            <br />
            thinking.
          </h1>
          <p className="hero-description">
            See the relationships. Understand the losses.
            <br />
            Engineer the confidence to move forward.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/tools">
              Enter the workspace <Arrow />
            </a>
            <a className="quiet-link" href="/methodology">
              Discover the method
            </a>
          </div>
        </div>
        <div className="hero-scene">
          <ParticleScene kind="home" />
        </div>
        <div className="hero-bottom">
          <span>01 — A UNIVERSE OF CONNECTIONS</span>
          <Ornament />
          <a href="#discover">
            Explore the system <Arrow down />
          </a>
        </div>
      </section>
      <section className="intro-section shell" id="discover">
        <div className="section-label">
          <span>THE ART OF SEEING THE WHOLE</span>
          <span>01 / PERSPECTIVE</span>
        </div>
        <div className="intro-grid">
          <h2>
            A system is more
            <br />
            than its <em>parts.</em>
          </h2>
          <div>
            <p className="lead">Security takes shape in the relationships.</p>
            <p>
              Between a satellite and its ground station. A train and its
              signaling system. A person, a decision, and the information they
              trust.
            </p>
            <p>
              SSTPA Tools brings architecture, assets, loss analysis,
              requirements, and assurance into one connected engineering model.
              Follow the reasoning from what matters to the evidence for its
              protection.
            </p>
            <a className="text-link" href="/methodology">
              Explore the methodology <Arrow />
            </a>
          </div>
        </div>
        <div className="assurance-thread">
          {[
            "Mission",
            "System",
            "Assets",
            "Losses",
            "Requirements",
            "Assurance",
          ].map((s, i) => (
            <span key={s}>
              <small>{count(i + 1)}</small>
              {s}
            </span>
          ))}
        </div>
        <AudioGuide slug="home" />
      </section>
      <section className="journey-section shell">
        <div className="section-label">
          <span>YOUR WAY INTO SSTPA TOOLS</span>
          <span>02 / THE APPLICATION</span>
        </div>
        <h2>
          One shared model.
          <br />
          <em>A world of perspectives.</em>
        </h2>
        <div className="journey-links">
          {[
            {
              n: "01",
              title: "Establish the foundation",
              desc: "Installation, administration, and the backend.",
              href: "/installation",
            },
            {
              n: "02",
              title: "Step inside the workspace",
              desc: "Navigate a project. Find your system. Inspect the model.",
              href: "/tools/workspace",
            },
            {
              n: "03",
              title: "Extend your perspective",
              desc: "Seventeen specialist tools for connected engineering.",
              href: "/tools",
            },
          ].map((x) => (
            <a key={x.n} href={x.href}>
              <span className="journey-number">{x.n}</span>
              <div>
                <h3>{x.title}</h3>
                <p>{x.desc}</p>
              </div>
              <Arrow />
            </a>
          ))}
        </div>
      </section>
      <section className="firesat-section shell">
        <div className="firesat-visual">
          <div className="orbital-map" aria-hidden="true">
            <span className="orbit-one" />
            <span className="orbit-two" />
            <span className="planet" />
            <i />
            <b>FIRESAT</b>
          </div>
          <span className="coordinate">
            SYSTEM OF INTEREST / FIRE DETECTION PAYLOAD
          </span>
        </div>
        <div>
          <p className="eyebrow">A REAL EXAMPLE. A CONNECTED STORY.</p>
          <h2>
            Follow <em>FireSat.</em>
            <br />
            From orbit to insight.
          </h2>
          <p>
            Explore the same wildfire detection mission across the workspace and
            its add-on tools. See how the Fire Detection Payload’s structure,
            functions, interfaces, and operating states fit together.
          </p>
          <a className="button outline" href="/tools/workspace">
            Explore the FireSat walkthrough <Arrow />
          </a>
        </div>
      </section>
      <PaperPanel />
    </>
  );
}
function PaperPanel() {
  return (
    <section className="paper-panel shell">
      <div className="paper-cover" aria-hidden="true">
        <span>SSTPA / RESEARCH & METHODOLOGY</span>
        <Ornament />
        <strong>
          System
          <br />
          Security-Theoretic
          <br />
          <em>Process Analysis</em>
        </strong>
        <small>
          THE METHODOLOGY WHITE PAPER
          <br />
          VERSION 14
        </small>
      </div>
      <div>
        <p className="eyebrow">THE THINKING BEHIND THE TOOLS</p>
        <h2>
          Grounded in theory.
          <br />
          <em>Built for practice.</em>
        </h2>
        <p>
          Read the definitions, analytical foundations, and reasoning behind the
          SSTPA methodology.
        </p>
        <a className="button primary" href={paper} download>
          Download the white paper <Arrow down />
        </a>
        <span className="file-note">VERSION 14 · MICROSOFT WORD DOCUMENT</span>
        <a className="text-link" href="/docs/">
          Browse the online documentation <Arrow />
        </a>
      </div>
    </section>
  );
}
function PageIntro({
  eyebrow,
  title,
  em,
  description,
  kind,
  slug,
}: {
  eyebrow: string;
  title: string;
  em: string;
  description: string;
  kind: string;
  slug: string;
}) {
  return (
    <section className="page-intro shell">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {title}
          <br />
          <em>{em}</em>
        </h1>
        <p className="page-description">{description}</p>
      </div>
      <div className="page-scene">
        <ParticleScene kind={kind} compact />
      </div>
      <div className="page-audio">
        <AudioGuide slug={slug} compact />
      </div>
    </section>
  );
}
function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(tools.map((t) => t.category))];
  const shown = tools.filter(
    (t) =>
      (category === "All" || t.category === category) &&
      `${t.name} ${t.subtitle} ${t.overview}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageIntro
        eyebrow="THE SPECIALIST TOOL COLLECTION"
        title="Many perspectives."
        em="One source of truth."
        description="Move between architecture, analysis, and assurance. Each tool opens a different view into the same engineering model."
        kind="connection"
        slug="tools"
      />
      <section className="directory shell">
        <div className="directory-controls">
          <div className="filters" aria-label="Filter tools">
            {categories.map((c) => (
              <button
                key={c}
                className={c === category ? "active" : ""}
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="search">
            <span className="sr-only">Search tools</span>
            <input
              type="search"
              placeholder="Find your perspective…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span aria-hidden="true">⌕</span>
          </label>
        </div>
        <div className="directory-count" aria-live="polite">
          {count(shown.length)} PERSPECTIVES TO EXPLORE
        </div>
        <div className="tool-list">
          {shown.map((t) => (
            <a className="tool-row" href={`/tools/${t.slug}`} key={t.slug}>
              <span className="tool-index">{count(tools.indexOf(t) + 1)}</span>
              <div>
                <span className="eyebrow">{t.category}</span>
                <h2>{t.name}</h2>
              </div>
              <p>{t.subtitle}</p>
              <Arrow />
            </a>
          ))}
        </div>
        {!shown.length && (
          <div className="empty">
            <h2>No matching tools.</h2>
            <p>Try another term or return to the complete collection.</p>
            <button
              className="button outline"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Show all tools <Arrow />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
const toolHeadlines: Record<string, string> = {
  workspace: "The system, in view.",
  navigator: "Find your perspective.",
  requirements: "Intent, made explicit.",
  reports: "Evidence, ready to review.",
  reference: "Knowledge in context.",
  state: "Protection in every state.",
  flow: "Behavior, connected.",
  assets: "Begin with what matters.",
  context: "Understand the environment.",
  trace: "Follow what matters.",
  loss: "Understand the path to loss.",
  goalkeeper: "Make the argument.",
  usecase: "Put the mission in motion.",
  connection: "The links matter.",
  messagecenter: "Keep the team connected.",
  admin: "A foundation for the team.",
  attack: "Bring threats into focus.",
  controls: "From control to design.",
};
function ToolPage({ tool }: { tool: Tool }) {
  const next = tools[(tools.indexOf(tool) + 1) % tools.length];
  return (
    <>
      <div className="breadcrumb shell">
        <a href="/tools">The tools</a>
        <span>/</span>
        <span>{tool.name}</span>
      </div>
      <PageIntro
        eyebrow={`${count(tools.indexOf(tool) + 1)} / ${tool.category.toUpperCase()}`}
        title={tool.name}
        em={toolHeadlines[tool.slug]}
        description={tool.subtitle}
        kind={tool.slug}
        slug={tool.slug}
      />
      <section className="tool-purpose shell">
        <div>
          <p className="eyebrow">WHY THIS PERSPECTIVE MATTERS</p>
          <h2>
            See the detail.
            <br />
            <em>Keep the context.</em>
          </h2>
          <p>{tool.overview}</p>
          <a className="text-link" href={tool.guidePath}>
            Open the detailed guide <Arrow />
          </a>
        </div>
        <div className="capabilities">
          {tool.capabilities.map((c, i) => (
            <div key={c}>
              <span>{count(i + 1)}</span>
              <p>{c}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="demo-section shell">
        <div className="section-label">
          <span>THE TOOL IN PRACTICE</span>
          <span>FIRESAT / SILENT WALKTHROUGH</span>
        </div>
        <h2>
          From a mission
          <br />
          to <em>the model.</em>
        </h2>
        <Demo tool={tool} />
      </section>
      <section className="steps-section shell">
        <div>
          <p className="eyebrow">FOLLOW THE EXAMPLE</p>
          <h2>
            Explore FireSat.
            <br />
            <em>Connect the ideas.</em>
          </h2>
          <p>
            Use FireSat’s Fire Detection Payload as the shared System of
            Interest. The supplied architecture is the starting point; further
            analysis is an engineering exercise.
          </p>
        </div>
        <ol className="steps">
          {tool.exampleSteps.map((s, i) => (
            <li key={s}>
              <span>{count(i + 1)}</span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="next-tool shell">
        <p className="eyebrow">CONTINUE EXPLORING</p>
        <a href={`/tools/${next.slug}`}>
          {next.name}
          <Arrow />
        </a>
        <p>{next.subtitle}</p>
      </section>
    </>
  );
}
function Installation() {
  const info = source.installationAdmin;
  return (
    <>
      <PageIntro
        eyebrow="INSTALLATION & ADMINISTRATION"
        title="A sound foundation."
        em="A shared workspace."
        description={info.subtitle}
        kind="admin"
        slug="installation-admin"
      />
      <section className="architecture shell">
        <div className="section-label">
          <span>FOUR CONNECTED SEGMENTS</span>
          <span>THE APPLICATION ARCHITECTURE</span>
        </div>
        <div className="architecture-grid">
          {[
            {
              name: "Installer",
              body: "Packages the platform-specific application and deployment helpers.",
            },
            {
              name: "Startup",
              body: "Starts the backend, supports sign-in, and opens the engineering workspace.",
            },
            {
              name: "Backend",
              body: "Owns the authoritative graph and validates changes before committing them.",
            },
            {
              name: "Desktop GUI",
              body: "Presents the System of Interest, model records, and specialist add-on tools.",
            },
          ].map((s, i) => (
            <div key={s.name}>
              <span>{count(i + 1)}</span>
              <h3>{s.name}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="steps-section shell">
        <div>
          <p className="eyebrow">FROM INSTALLATION TO FIRST PROJECT</p>
          <h2>
            Set the stage.
            <br />
            <em>Then explore.</em>
          </h2>
          <p>{info.introduction}</p>
          <p className="install-note">
            Follow the installation guide supplied with your release for the
            exact prerequisites, commands, and host configuration.
          </p>
          <a className="text-link" href={info.guidePath}>
            {info.guideLabel} <Arrow />
          </a>
        </div>
        <ol className="steps installation-steps">
          {info.steps.map((s) => (
            <li key={s.number}>
              <span>{count(s.number)}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="backend-section shell">
        <div>
          <p className="eyebrow">THE BACKEND, ORGANIZED</p>
          <h2>
            One graph.
            <br />
            <em>Clear responsibilities.</em>
          </h2>
          <p>{info.backend.description}</p>
          <div className="data-partitions">
            {info.backend.partitions.map((p) => (
              <div key={p.name}>
                <strong>{p.name}</strong>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="service-list">
          {info.backend.services.map((service, i) => (
            <div key={service.name}>
              <span>{count(i + 1)}</span>
              <div>
                <h3>{service.name}</h3>
                <p>{service.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="tool-purpose shell">
        <div>
          <p className="eyebrow">THE ADMIN TOOL</p>
          <h2>
            Steward the
            <br />
            <em>environment.</em>
          </h2>
          <p>{info.admin.description}</p>
          <a className="button outline" href="/tools/admin">
            Explore the Admin tool <Arrow />
          </a>
        </div>
        <div className="capabilities">
          {info.admin.capabilities.map((c, i) => (
            <div key={c}>
              <span>{count(i + 1)}</span>
              <p>{c}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="next-tool shell">
        <p className="eyebrow">YOUR NEXT PERSPECTIVE</p>
        <a href="/tools/workspace">
          The main workspace
          <Arrow />
        </a>
        <p>
          Navigate an established project and make its relationships visible.
        </p>
      </section>
    </>
  );
}
function Methodology() {
  return (
    <>
      <PageIntro
        eyebrow="SYSTEM SECURITY-THEORETIC PROCESS ANALYSIS"
        title="Begin with purpose."
        em="Reason about security."
        description="Understand what the system must achieve, what it must protect, and how its interactions can create paths to loss."
        kind="trace"
        slug="methodology"
      />
      <section className="intro-section shell">
        <div className="intro-grid">
          <h2>
            Security is a property
            <br />
            of the <em>whole system.</em>
          </h2>
          <div>
            <p className="lead">
              Components matter. Their interactions matter, too.
            </p>
            <p>
              SSTPA connects system structure, functions, states, assets, and
              operating context. The method makes the reasoning behind security
              decisions explicit and traceable.
            </p>
            <p>{source.methodology.workflowNote}</p>
          </div>
        </div>
      </section>
      <section className="method-workflow shell">
        <div className="section-label">
          <span>THE METHOD IN PRACTICE</span>
          <span>FOURTEEN STEPS / ITERATIVE BY DESIGN</span>
        </div>
        <h2>
          Follow the reasoning.
          <br />
          <em>Return as you learn.</em>
        </h2>
        {source.methodology.workflow.map((s) => (
          <details className="workflow-item" key={s.number}>
            <summary>
              <span>{count(s.number)}</span>
              <h3>{s.title}</h3>
              <b>+</b>
            </summary>
            <div className="workflow-body">
              <p>{s.description}</p>
              <p>
                <strong>The outcome</strong> {s.output}
              </p>
              <div>
                {s.tools.map((slug) => (
                  <a href={`/tools/${slug}`} key={slug}>
                    {tools.find((t) => t.slug === slug)?.name || slug} <Arrow />
                  </a>
                ))}
              </div>
            </div>
          </details>
        ))}
        <div className="principles">
          {source.methodology.loops.map((s) => (
            <div key={s.title}>
              <span>↺</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="assurance-section shell">
        <p className="eyebrow">AN ARGUMENT THAT CAN BE EXAMINED</p>
        <h2>
          Make the claim.
          <br />
          <em>Show the evidence.</em>
        </h2>
        <p>{source.methodology.assurance.body}</p>
        <p>{source.methodology.assurance.arv}</p>
      </section>
      <PaperPanel />
    </>
  );
}
function NotFound() {
  return (
    <section className="not-found shell">
      <p className="eyebrow">404 / A MISSING CONNECTION</p>
      <h1>
        Beyond this
        <br />
        <em>system boundary.</em>
      </h1>
      <p>
        This page could not be found. Return to the tools to continue exploring.
      </p>
      <a className="button primary" href="/tools">
        Explore the tools <Arrow />
      </a>
    </section>
  );
}
export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const tool = tools.find((t) => path === `/tools/${t.slug}`);
  useEffect(() => {
    const name =
      tool?.name ||
      (path === "/"
        ? "Connected systems thinking"
        : path === "/tools"
          ? "The tools"
          : path === "/installation"
            ? "Installation & administration"
            : path === "/methodology"
              ? "The methodology"
              : "Page not found");
    document.title = `${name} — SSTPA Tools`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        tool?.overview ||
          "Explore SSTPA Tools: connected systems security engineering, from system architecture and loss analysis to requirements and assurance.",
      );
  }, [path, tool]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header path={path} />
      <main id="main">
        {path === "/" ? (
          <Home />
        ) : path === "/tools" ? (
          <ToolsPage />
        ) : path === "/installation" ? (
          <Installation />
        ) : path === "/methodology" ? (
          <Methodology />
        ) : tool ? (
          <ToolPage tool={tool} />
        ) : (
          <NotFound />
        )}
      </main>
      <Footer />
    </>
  );
}
