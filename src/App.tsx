import { useEffect, useRef, useState, type CSSProperties } from "react";
import source from "./content.json";

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
type Media = {
  src: string;
  poster?: string;
  captions?: string;
  transcript?: string;
  duration?: string;
  title?: string;
};
type MediaIndex = Record<string, Media>;
const tools = source.tools as Tool[];
const whitePaper = "/files/SSTPA-Methodology-White-Paper-v14.docx";
const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <span aria-hidden="true">{diagonal ? "↗" : "↗"}</span>
);
const number = (i: number) => String(i).padStart(2, "0");

function useMedia() {
  const [media, setMedia] = useState<MediaIndex>({});
  useEffect(() => {
    const abort = new AbortController();
    fetch("/media/manifest.json", { signal: abort.signal })
      .then((r) => (r.ok ? r.json() : {}))
      .then(setMedia)
      .catch(() => {});
    return () => abort.abort();
  }, []);
  return media;
}
function Header({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="SSTPA Tools home">
        <span className="brand-emblem" aria-hidden="true">
          ✳
        </span>
        <span>
          SSTPA<span className="wordmark-tools">TOOLS</span>
        </span>
      </a>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}{" "}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <nav
        id="main-nav"
        className={open ? "main-nav is-open" : "main-nav"}
        aria-label="Primary"
      >
        <a
          aria-current={current === "tools" ? "page" : undefined}
          href="/tools"
        >
          Explore the tools
        </a>
        <a
          aria-current={current === "methodology" ? "page" : undefined}
          href="/methodology"
        >
          The methodology
        </a>
        <a href="/docs/">
          User guide <Arrow />
        </a>
      </nav>
      <a className="header-action" href={whitePaper} download>
        Read the white paper <span aria-hidden="true">↓</span>
      </a>
    </header>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p className="eyebrow">THE WHOLE SYSTEM. A CLEARER PICTURE.</p>
        <a className="footer-invite" href="/tools">
          See how it all connects.
          <Arrow />
        </a>
      </div>
      <div className="footer-bottom">
        <a className="wordmark" href="/">
          <span className="brand-emblem" aria-hidden="true">
            ✳
          </span>
          <span>
            SSTPA<span className="wordmark-tools">TOOLS</span>
          </span>
        </a>
        <p>System Security-Theoretic Process Analysis</p>
        <div>
          <a href="/methodology">Methodology</a>
          <a href="/docs/">Documentation</a>
          <a href={whitePaper} download>
            White paper ↓
          </a>
        </div>
      </div>
      <div className="footer-note">
        <span>Built for the complexity of real systems.</span>
        <span>© {new Date().getFullYear()} SSTPA Tools</span>
      </div>
    </footer>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      width = 0,
      height = 0,
      active = true,
      visible = true;
    const points = Array.from({ length: 1250 }, (_, i) => {
      const y = 1 - (i / 1249) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, i };
    });
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);
    const start = performance.now();
    const render = (now: number) => {
      if (!active) return;
      if (visible) {
        const t = reduce.matches || paused ? 4 : (now - start) * 0.00012;
        ctx.clearRect(0, 0, width, height);
        const radius = Math.min(width * 0.365, height * 0.365),
          cx = width * 0.52,
          cy = height * 0.48;
        const rotation = t + pointer.current.x * 0.12;
        const tilt = -0.23 + pointer.current.y * 0.06;
        const cycle =
          reduce.matches || paused ? 0.1 : (Math.sin(t * 0.4 - 1.5) + 1) * 0.5;
        const morph = Math.max(0, (cycle - 0.68) / 0.32);
        const projected = points
          .map((p) => {
            const x = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
            const z = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
            const y = p.y * Math.cos(tilt) - z * Math.sin(tilt);
            const depth = p.y * Math.sin(tilt) + z * Math.cos(tilt);
            const shieldX = x * (1 - Math.max(0, y) * 0.35);
            const shieldY = y * 1.08;
            const perspective = 2.7 / (2.7 - depth * 0.35);
            return {
              x:
                cx + (x * (1 - morph) + shieldX * morph) * radius * perspective,
              y:
                cy + (y * (1 - morph) + shieldY * morph) * radius * perspective,
              depth,
              i: p.i,
            };
          })
          .sort((a, b) => a.depth - b.depth);
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
        glow.addColorStop(0, "rgba(156,183,128,0.04)");
        glow.addColorStop(0.62, "rgba(178,206,149,0.025)");
        glow.addColorStop(1, "rgba(178,206,149,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.37);
        ctx.strokeStyle = "rgba(190,214,164,.17)";
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.2, radius * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.rotate(0.98);
        ctx.strokeStyle = "rgba(190,214,164,.09)";
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.16, radius * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        for (const p of projected) {
          const front = (p.depth + 1) / 2;
          const pulse = 0.78 + 0.22 * Math.sin(t * 4 + p.i * 0.087);
          ctx.fillStyle = `rgba(${p.i % 7 === 0 ? "225,218,176" : "190,217,169"},${(0.15 + front * 0.75) * pulse})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 0.65 + front * 1.12, 0, Math.PI * 2);
          ctx.fill();
        }
        const nodes = [
          projected[1150],
          projected[1090],
          projected[950],
          projected[1000],
        ];
        ctx.strokeStyle = "rgba(216,227,188,.15)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        nodes.forEach((p, i) => {
          if (i) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
        });
        ctx.stroke();
        for (const p of nodes) {
          ctx.strokeStyle = "rgba(203,222,176,.45)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      observer.disconnect();
    };
  }, [paused]);
  return (
    <div
      className="particle-field"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current = {
          x: (e.clientX - r.left) / r.width - 0.5,
          y: (e.clientY - r.top) / r.height - 0.5,
        };
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label="An animated constellation of interconnected points, forming a system"
        role="img"
      />
      <div className="particle-label label-top">
        <i />
        SYSTEM OF INTEREST
      </div>
      <div className="particle-label label-bottom">
        STRUCTURE / BEHAVIOR / ASSURANCE
      </div>
      <span className="crosshair crosshair-one" aria-hidden="true">
        +
      </span>
      <span className="crosshair crosshair-two" aria-hidden="true">
        +
      </span>
      <button
        className="motion-control"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
      >
        {paused ? "Resume motion" : "Pause motion"}{" "}
        <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
      </button>
    </div>
  );
}
function MediaPlayer({
  slug,
  media,
  poster,
  title,
  variant = "",
}: {
  slug: string;
  media: MediaIndex;
  poster: string;
  title: string;
  variant?: string;
}) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const item = media[slug];
  return (
    <div className={`media-block ${variant}`}>
      <div className={`media-stage ${!item ? "media-pending" : ""}`}>
        {item ? (
          <video
            controls
            preload="metadata"
            poster={item.poster || poster}
            playsInline
            aria-label={title}
          >
            <source src={item.src} type="video/mp4" />
            {item.captions && (
              <track
                kind="captions"
                label="English"
                srcLang="en"
                src={item.captions}
                default
              />
            )}
            Your browser does not support video.{" "}
            <a href={item.src}>Download the demonstration.</a>
          </video>
        ) : (
          <>
            <img
              src={poster}
              alt={
                slug === "introduction"
                  ? "The SSTPA Tools emblem"
                  : `${title} application screenshot`
              }
              loading="lazy"
            />
            <div className="pending-label">
              <span className="status-dot" />
              {slug === "introduction"
                ? "THE SSTPA TOOLS IDENTITY"
                : "APPLICATION PREVIEW"}
              <small>
                {slug === "introduction"
                  ? "Design. Analyze. Build assurance."
                  : "A look inside the workspace"}
              </small>
            </div>
          </>
        )}
      </div>
      <div className="media-caption">
        <span>
          {item ? "▶" : "◉"} <span>{title}</span>
        </span>
        <span>
          {item?.duration || (item ? "PRODUCT WALKTHROUGH" : "STILL PREVIEW")}
        </span>
      </div>
      {item?.transcript && (
        <div className="transcript">
          <button
            aria-expanded={transcriptOpen}
            onClick={() => setTranscriptOpen(!transcriptOpen)}
          >
            Read the transcript <span>{transcriptOpen ? "−" : "+"}</span>
          </button>
          {transcriptOpen && <p>{item.transcript}</p>}
        </div>
      )}
    </div>
  );
}
function Home({ media }: { media: MediaIndex }) {
  const features = tools.filter((t) =>
    ["workspace", "loss", "goalkeeper"].includes(t.slug),
  );
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-rule" />
            SYSTEMS SECURITY, BY DESIGN
          </p>
          <h1>
            Security begins
            <br />
            with the <em>system.</em>
          </h1>
          <p className="hero-description">
            See the relationships. Understand the losses.
            <br />
            Build the argument for a more secure system.
          </p>
          <a className="button button-light" href="/tools">
            Explore SSTPA Tools <Arrow />
          </a>
        </div>
        <ParticleField />
        <div className="hero-footer">
          <span>SYSTEM SECURITY-THEORETIC PROCESS ANALYSIS</span>
          <a href="#perspective">
            A wider perspective <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section className="perspective section-shell" id="perspective">
        <div className="section-kicker">
          <span>01 / THE BIGGER PICTURE</span>
          <span>FROM COMPLEXITY TO UNDERSTANDING</span>
        </div>
        <div className="perspective-grid">
          <h2>
            A system is more
            <br />
            than the sum
            <br />
            of its <em>parts.</em>
          </h2>
          <div className="perspective-copy">
            <p>
              Security lives in the relationships between people, assets,
              functions, and the environments they operate in.
            </p>
            <p>
              SSTPA Tools brings those relationships into one connected
              engineering model. Follow the thread from what you value, through
              what could be lost, to the requirements and evidence that support
              an assurance argument.
            </p>
            <a className="text-link" href="/methodology">
              Discover the methodology <Arrow />
            </a>
          </div>
        </div>
        <div className="relationship-line" aria-label="Model relationships">
          <span>Mission</span>
          <i />
          <span>Assets</span>
          <i />
          <span>Losses</span>
          <i />
          <span>Requirements</span>
          <i />
          <span>Assurance</span>
        </div>
      </section>
      <section className="film-section section-shell">
        <div className="section-kicker">
          <span>02 / ENGINEER WITH INTENT</span>
          <span>THE SSTPA TOOLS STORY</span>
        </div>
        <div className="film-grid">
          <div className="film-copy">
            <p className="eyebrow">A CONNECTED WAY OF THINKING</p>
            <h2>
              The whole picture.
              <br />
              <em>Within reach.</em>
            </h2>
            <p>
              Purpose-built tools. One shared model. A workspace for turning
              complex systems into traceable engineering decisions.
            </p>
            <a className="text-link" href="/tools/workspace">
              Step inside the workspace <Arrow />
            </a>
          </div>
          <MediaPlayer
            slug="introduction"
            media={media}
            poster="/sstpa-logo-large.png"
            title="Introducing SSTPA Tools"
            variant="brand-film"
          />
        </div>
      </section>
      <section className="tools-preview section-shell">
        <div className="section-kicker">
          <span>03 / YOUR ENGINEERING WORKSPACE</span>
          <span>
            {tools.filter((t) => t.slug !== "workspace").length || 17}{" "}
            SPECIALIST TOOLS. ONE CONNECTED MODEL.
          </span>
        </div>
        <div className="section-heading">
          <h2>
            One model.
            <br />
            <em>Many perspectives.</em>
          </h2>
          <a className="button button-outline" href="/tools">
            Explore every tool <Arrow />
          </a>
        </div>
        <div className="featured-tools">
          {features.map((tool, index) => (
            <a
              href={`/tools/${tool.slug}`}
              className="featured-tool"
              key={tool.slug}
            >
              <div className="featured-image">
                <img
                  src={tool.posterPath}
                  alt={`${tool.name} interface`}
                  loading="lazy"
                />
                <span className="round-arrow">
                  <Arrow />
                </span>
              </div>
              <div className="featured-meta">
                <span className="eyebrow">
                  {number(index + 1)} / {tool.category}
                </span>
                <h3>{tool.name}</h3>
                <p>{tool.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="tool-ribbon">
          <span>Model the system.</span>
          <span>Understand the exposure.</span>
          <span>Connect the evidence.</span>
        </div>
      </section>
      <section className="paper-section section-shell">
        <div className="paper-number" aria-hidden="true">
          S<span>2</span>
        </div>
        <div>
          <p className="eyebrow">THE THINKING BEHIND THE TOOLS</p>
          <h2>
            Grounded in
            <br />
            <em>systems thinking.</em>
          </h2>
          <p>
            Explore the methodology, definitions, and analytical foundations
            that shape SSTPA Tools.
          </p>
          <a className="button button-dark" href={whitePaper} download>
            Download the methodology paper <span aria-hidden="true">↓</span>
          </a>
          <span className="download-note">
            METHODOLOGY WHITE PAPER · VERSION 14 · DOCX
          </span>
        </div>
      </section>
    </>
  );
}
function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All tools");
  const categories = ["All tools", ...new Set(tools.map((t) => t.category))];
  const shown = tools.filter(
    (t) =>
      (category === "All tools" || category === t.category) &&
      `${t.name} ${t.subtitle} ${t.overview}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <section className="page-intro section-shell">
        <p className="eyebrow">THE SSTPA TOOLS COLLECTION</p>
        <h1>
          Every perspective.
          <br />
          <em>One connected model.</em>
        </h1>
        <div className="intro-bottom">
          <p>
            Move from system architecture to loss analysis and assurance. Each
            tool works with the same graph of engineering knowledge.
          </p>
          <span className="count-label">
            01 WORKSPACE
            <br />
            {tools.filter((t) => t.slug !== "workspace").length} SPECIALIST
            TOOLS
          </span>
        </div>
      </section>
      <section className="tool-directory section-shell">
        <div className="directory-controls">
          <div className="filter-tabs" aria-label="Filter tools">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="search-field">
            <span className="visually-hidden">Search tools</span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="6.5" stroke="currentColor" />
              <path d="m15 15 6 6" stroke="currentColor" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a tool"
            />
          </label>
        </div>
        <div className="directory-status" aria-live="polite">
          {shown.length} {shown.length === 1 ? "perspective" : "perspectives"}{" "}
          to explore
        </div>
        <div className="tool-list">
          {shown.map((tool) => (
            <a
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="tool-row"
            >
              <span className="tool-number">
                {number(tools.indexOf(tool) + 1)}
              </span>
              <div className="tool-row-title">
                <span className="eyebrow">{tool.category}</span>
                <h2>{tool.name}</h2>
              </div>
              <p>{tool.subtitle}</p>
              <span className="tool-row-arrow">
                <Arrow />
              </span>
            </a>
          ))}
        </div>
        {!shown.length && (
          <div className="empty-state">
            <h2>No matching tools.</h2>
            <p>Try a different term or explore the whole collection.</p>
            <button
              className="button button-outline"
              onClick={() => {
                setQuery("");
                setCategory("All tools");
              }}
            >
              Show all tools <Arrow />
            </button>
          </div>
        )}
      </section>
      <section className="library-note section-shell">
        <span className="brand-emblem" aria-hidden="true">
          ✳
        </span>
        <h2>
          A different view.
          <br />
          <em>The same source of truth.</em>
        </h2>
        <p>
          Systems, assets, requirements, losses, and assurance arguments stay
          connected as you move between tools.
        </p>
      </section>
    </>
  );
}
function ToolPage({ tool, media }: { tool: Tool; media: MediaIndex }) {
  const next = tools[(tools.indexOf(tool) + 1) % tools.length];
  return (
    <>
      <section className="tool-intro section-shell">
        <a className="back-link" href="/tools">
          ← All tools
        </a>
        <div className="tool-title-grid">
          <div>
            <p className="eyebrow">
              {number(tools.indexOf(tool) + 1)} / {tool.category}
            </p>
            <h1>
              {tool.name}
              <span className="title-period">.</span>
            </h1>
          </div>
          <p>{tool.subtitle}</p>
        </div>
        <div className="tool-hero-rule">
          <span>
            SSTPA TOOLS /{" "}
            {tool.slug === "workspace" ? "MAIN WORKSPACE" : "ADD-ON TOOL"}
          </span>
          <a href={tool.guidePath}>
            Open the user guide <Arrow />
          </a>
        </div>
      </section>
      <section className="tool-demo section-shell">
        <MediaPlayer
          slug={tool.slug}
          media={media}
          poster={tool.posterPath}
          title={`${tool.name} — a guided walkthrough`}
        />
      </section>
      <section className="tool-details section-shell">
        <div className="detail-overview">
          <p className="eyebrow">THE PURPOSE</p>
          <h2>
            A clearer view
            <br />
            of{" "}
            <em>
              {tool.slug === "workspace" ? "your system." : "the details."}
            </em>
          </h2>
          <p>{tool.overview}</p>
        </div>
        <div className="capabilities">
          <p className="eyebrow">WHAT YOU CAN DO</p>
          {tool.capabilities.map((cap, i) => (
            <div key={cap}>
              <span>{number(i + 1)}</span>
              <p>{cap}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="example-section section-shell">
        <div>
          <p className="eyebrow">FOLLOW THE EXAMPLE</p>
          <h2>
            See the thinking.
            <br />
            <em>Try the workflow.</em>
          </h2>
          <p>
            An example workflow for {tool.name.toLowerCase()}, using Sentinel
            Mission and its Environmental Monitoring System system.
          </p>
          <a className="text-link" href={tool.guidePath}>
            Read the detailed guide <Arrow />
          </a>
        </div>
        <ol className="example-steps">
          {tool.exampleSteps.map((step, i) => (
            <li key={step}>
              <span>{number(i + 1)}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="next-tool section-shell">
        <p className="eyebrow">ANOTHER PERSPECTIVE</p>
        <a href={`/tools/${next.slug}`}>
          <span>{next.name}</span>
          <Arrow />
        </a>
        <p>{next.subtitle}</p>
      </section>
    </>
  );
}
const methodologySteps = [
  {
    label: "Define the system",
    title: "Begin with context.",
    body: "Establish the system of interest, its structure, functions, interfaces, states, and operating environments. Understand the mission before narrowing the analysis.",
  },
  {
    label: "Identify what matters",
    title: "Make value explicit.",
    body: "Identify assets and the assurances expected of them. Consider their criticality and the losses that matter within a defined operating context.",
  },
  {
    label: "Analyze potential loss",
    title: "Follow the relationships.",
    body: "Trace assets through the system, associate attacks with susceptible entities, and build structured attack trees to examine how loss can arise.",
  },
  {
    label: "Develop the response",
    title: "Connect decisions to requirements.",
    body: "Develop security controls, countermeasures, and realizing requirements. Link verification and validation activities to the claims they help evaluate.",
  },
  {
    label: "Build the argument",
    title: "Make the evidence traceable.",
    body: "Bring claims, reasoning, and supporting evidence together in an assurance argument. Record residual vulnerabilities and their disposition for engineering review.",
  },
];
function MethodologyPage() {
  return (
    <>
      <section className="page-intro methodology-intro section-shell">
        <p className="eyebrow">SYSTEM SECURITY-THEORETIC PROCESS ANALYSIS</p>
        <h1>
          Start with
          <br />
          <em>what matters.</em>
        </h1>
        <div className="intro-bottom">
          <p>
            A systems approach to security: understand the relationships that
            create value, examine how that value can be lost, and build a
            traceable argument for its protection.
          </p>
          <a className="button button-light" href={whitePaper} download>
            Read the white paper ↓
          </a>
        </div>
      </section>
      <section className="method-statement section-shell">
        <span className="eyebrow">THE CENTRAL IDEA</span>
        <h2>
          Security is a property of
          <br />
          the <em>whole system.</em>
        </h2>
        <p>
          Components matter. So do their interactions, the people who operate
          them, and the environments in which they work. SSTPA connects these
          perspectives through an asset-centered model of system security.
        </p>
      </section>
      <section className="method-journey section-shell">
        <div className="section-kicker">
          <span>FIVE CONNECTED PERSPECTIVES</span>
          <span>ITERATIVE BY DESIGN</span>
        </div>
        {methodologySteps.map((step, i) => (
          <div className="method-step" key={step.label}>
            <span className="method-number">{number(i + 1)}</span>
            <div>
              <p className="eyebrow">{step.label}</p>
              <h2>{step.title}</h2>
            </div>
            <p>{step.body}</p>
          </div>
        ))}
      </section>
      <section className="workflow-section section-shell">
        <div className="workflow-heading">
          <p className="eyebrow">THE METHOD IN PRACTICE</p>
          <h2>
            Fourteen steps.
            <br />
            <em>An iterative discipline.</em>
          </h2>
          <p>{source.methodology.workflowNote}</p>
        </div>
        <div className="workflow-list">
          {source.methodology.workflow.map((step) => (
            <details key={step.number} className="workflow-item">
              <summary>
                <span>{number(step.number)}</span>
                <h3>{step.title}</h3>
                <i aria-hidden="true">+</i>
              </summary>
              <div className="workflow-body">
                <p>{step.description}</p>
                <p>
                  <strong>The outcome</strong>
                  {step.output}
                </p>
                <div className="workflow-tool-links">
                  {step.tools.map((slug) => (
                    <a key={slug} href={`/tools/${slug}`}>
                      {tools.find((t) => t.slug === slug)?.name || slug}{" "}
                      <Arrow />
                    </a>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
        <div className="workflow-loops">
          {source.methodology.loops.map((loop) => (
            <div key={loop.title}>
              <span aria-hidden="true">↺</span>
              <h3>{loop.title}</h3>
              <p>{loop.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="method-principles section-shell">
        <p className="eyebrow">PUTTING THE METHOD INTO PRACTICE</p>
        <h2>
          Reasoning you can follow.
          <br />
          <em>Decisions you can revisit.</em>
        </h2>
        <div className="principle-grid">
          {source.methodology.principles.map((principle, i) => (
            <div key={principle.title}>
              <span>{number(i + 1)}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="assurance-section section-shell">
        <div>
          <p className="eyebrow">THE ROLE OF ASSURANCE</p>
          <h2>
            Make the argument.
            <br />
            <em>Show the evidence.</em>
          </h2>
        </div>
        <div>
          <p>{source.methodology.assurance.body}</p>
          <p>{source.methodology.assurance.arv}</p>
          <p>
            A model or assurance argument alone does not establish that a system
            is secure or certified.
          </p>
        </div>
      </section>
      <section className="source-section section-shell">
        <div>
          <p className="eyebrow">GO TO THE SOURCE</p>
          <h2>
            The methodology,
            <br />
            <em>in full.</em>
          </h2>
          <p>
            This introduction is based on the SSTPA Methodology White Paper,
            version 14. Read the source for definitions, assumptions, analytical
            detail, and limitations.
          </p>
        </div>
        <div className="source-card">
          <span className="eyebrow">SSTPA / RESEARCH & METHODOLOGY</span>
          <h3>
            System Security-Theoretic
            <br />
            Process Analysis
          </h3>
          <p>Methodology White Paper · Version 14</p>
          <a className="button button-dark" href={whitePaper} download>
            Download the white paper ↓
          </a>
          <span className="download-note">MICROSOFT WORD DOCUMENT</span>
        </div>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <section className="not-found section-shell">
      <p className="eyebrow">404 / OUTSIDE THE MODEL</p>
      <h1>
        A missing
        <br />
        <em>connection.</em>
      </h1>
      <p>
        We couldn't find that page. The tools directory is a good place to
        start.
      </p>
      <a className="button button-light" href="/tools">
        Explore the tools <Arrow />
      </a>
    </section>
  );
}
export default function App() {
  const media = useMedia();
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const tool = path.startsWith("/tools/")
    ? tools.find((t) => t.slug === path.split("/")[2])
    : undefined;
  const current = path.startsWith("/tools")
    ? "tools"
    : path === "/methodology"
      ? "methodology"
      : "home";
  useEffect(() => {
    document.title = `${tool ? tool.name : path === "/tools" ? "Explore the tools" : path === "/methodology" ? "The methodology" : "Security begins with the system"} — SSTPA Tools`;
  }, [path, tool]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header current={current} />
      <main id="main-content" style={{ "--page-order": 0 } as CSSProperties}>
        {path === "/" ? (
          <Home media={media} />
        ) : path === "/tools" ? (
          <ToolsPage />
        ) : path === "/methodology" ? (
          <MethodologyPage />
        ) : tool ? (
          <ToolPage tool={tool} media={media} />
        ) : (
          <NotFound />
        )}
      </main>
      <Footer />
    </>
  );
}
