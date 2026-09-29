import { useId, useState } from 'react';

type Tool = {
  name: string;
  blurb: string;
  detail: string;
};

const addonTools: Tool[] = [
  {
    name: 'Navigator',
    blurb: 'Select a System of Interest, traverse hierarchy, clone, and associate.',
    detail:
      'Traverse the project hierarchy, select the current System of Interest (SoI), clone nodes (optionally with requirements) into the SoI, and associate an SoI Interface to a Connection owned by another System.',
  },
  {
    name: 'Requirements',
    blurb: 'Allocate, parent, and verify security and capability requirements.',
    detail:
      'Create, allocate, parent, and graphically manage Requirement nodes and their Verification nodes; resolve orphan and barren gaps; support SysML 2 requirement diagrams.',
  },
  {
    name: 'Connection',
    blurb: 'Model Connections and Interface participants across systems.',
    detail:
      'Create and visualize Connection nodes between Systems through Interfaces; assign ownership; join Interfaces as participants; relate requirements to Connections.',
  },
  {
    name: 'Asset Manager',
    blurb: 'Define Assets, Regime, Criticality, and security Assurances.',
    detail:
      'Create and organize Asset nodes; manage Regime; set Criticality and Assurance; depict Asset parentage (Organic, Horizontal, Derived) and related Element, Function, and Interface.',
  },
  {
    name: 'State',
    blurb: 'Capture security state-transition behavior for the SoI.',
    detail:
      'Create, edit, and analyze SysML 2–aligned state-transition diagrams; associate Hazard, Countermeasure, and Requirement to state behavior; display Environment validity relationships.',
  },
  {
    name: 'Context',
    blurb: 'Place Environments, hazards, and validity relationships around the SoI.',
    detail:
      'Authoritative workspace for Environment nodes; assign State via validity relationships; manage Hazard and Environment/State relationships; allocate Loss to Asset, Criticality, Assurance, and Environment tuples.',
  },
  {
    name: 'Reference',
    blurb: 'Research and assign framework material such as ATT&CK, NIST, and EMB3D.',
    detail:
      'Browse MITRE ATT&CK, ATLAS, EMB3D, NIST SP 800-53, CNSSI 1253, RMF overlays, and related tables; clone or assign selected reference nodes into the current SoI.',
  },
  {
    name: 'Flow',
    blurb: 'Analyze Functional Flow and STPA-style Control Flow.',
    detail:
      'Model Functional Flow and STPA Control Flow for the SoI; capture Control Action, Feedback, and Process Model; create Function, Interface, Requirement, and Countermeasure associations.',
  },
  {
    name: 'Controls',
    blurb: 'Build the Security Controls baseline and validation criteria.',
    detail:
      'Develop, tailor, trace, and document the Security Controls Baseline; map to SecurityControl nodes; create realizing Requirement nodes and Verification traceability.',
  },
  {
    name: 'Trace',
    blurb: 'Follow state-scoped Asset traces through the model.',
    detail:
      'Perform Asset Trace Analysis: state-scoped holds, transports, and uses relationships between an Asset and the SoI’s Interface, SystemFunction, and Component nodes.',
  },
  {
    name: 'Attack',
    blurb: 'Project actionable Attacks onto susceptible entities.',
    detail:
      'Develop and associate Attack nodes to Interface, SystemFunction, and Component; clone from ATT&CK, ATLAS, or EMB3D; build Attack hierarchies and leaf metrics as input to Loss analysis.',
  },
  {
    name: 'Loss',
    blurb: 'Build Structured Attack Trees and residual-vulnerability findings.',
    detail:
      'Construct, visualize, and analyze Structured Attack Trees for a single Loss; identify residual vulnerabilities; consume Context, State, Trace, and Attack outputs.',
  },
  {
    name: 'Goal Keeper',
    blurb: 'Assemble GSN assurance arguments tied to V&V evidence.',
    detail:
      'Assemble Goal Structuring Notation (GSN) assurance arguments for an Asset Loss; Solutions reference Validation, Verification, and Loss evidence in the graph.',
  },
  {
    name: 'Use-Case',
    blurb: 'Describe boundary behavior and operational use contexts.',
    detail:
      'Author SysML 2 Use Case diagrams and mission threads; assign Function and Interface to Use Cases for Critical Function and Critical Component analysis.',
  },
  {
    name: 'Reports',
    blurb: 'Produce figures and evidence packages for review and sustainment.',
    detail:
      'Produce System Description, System Specification, requirement-traceability gap analysis, and related evidence packages for review and sustainment.',
  },
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="SSTPA Tools home">
        <img src="/sstpa-menu-logo.png" alt="SSTPA Tools logo" />
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="/docs/">User Guide</a>
        <a className="nav-cta" href="/files/SSTPA-Methodology-White-Paper-v14.docx" download>
          White paper
        </a>
      </nav>
    </header>
  );
}

function ToolCard({
  tool,
  index,
  open,
  onToggle,
}: {
  tool: Tool;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <article className={`tool-card${open ? ' is-open' : ''}`}>
      <button
        type="button"
        id={buttonId}
        className="tool-card-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="tool-index">{String(index + 1).padStart(2, '0')}</span>
        <h3>{tool.name}</h3>
        <p className="tool-blurb">{tool.blurb}</p>
        <span className="tool-expand-hint" aria-hidden="true">
          {open ? 'Collapse' : 'Expand'}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="tool-card-detail"
        hidden={!open}
      >
        <p>{tool.detail}</p>
      </div>
    </article>
  );
}

function AddonToolsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-shell mini-section tools-section" id="tools">
      <header className="dual-title dual-title-full">
        <h2 className="simple-title">Add-on Tools</h2>
      </header>
      <div className="section-body">
        <p className="action-title">
          Discrete system security analytics on the graph-database model.
        </p>
        <p className="section-lede">
          Each Add-on Tool performs a discrete system security analytic against the System of Interest
          model stored in the graph database. The square cards below follow a typical Workflow V1 order
          of use — select a tool to expand what it does. The sequence implies a useful path; it does not
          mandate a rigid procedure.
        </p>
        <div className="tool-grid">
          {addonTools.map((tool, index) => (
            <ToolCard
              key={tool.name}
              tool={tool}
              index={index}
              open={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Header />
      <main id="top">
        {/* 1. Methodology */}
        <section className="section-shell mini-section methodology" id="methodology">
          <header className="dual-title dual-title-full">
            <h1 className="simple-title">Systems Security-Theoretic Process Analysis</h1>
          </header>
          <div className="methodology-split">
            <div className="section-body methodology-body">
              <p className="section-abstract">
                System Security-Theoretic Process Analysis (SSTPA) is a human- and asset-centered systems
                security engineering methodology for developing secure complex hierarchical engineered
                systems so they can support certification and authorization decisions. Loss is defined as
                the compromise of a security attribute on an asset; analysis is disciplined into verifiable
                security requirements, residual-vulnerability disposition, and Goal Structuring Notation
                (GSN) assurance arguments.
              </p>
              <p className="action-title">
                Implement the methodology as an MBSE workbench on a living graph model.
              </p>
              <p>
                SSTPA Tools carry the methodology into practice: architecture, assets, hazards, controls,
                requirements, and evidence stay aligned to one authoritative system model so
                assurance arguments remain traceable as the hierarchy deepens.
              </p>
            </div>
            <aside className="methodology-logo" aria-label="SSTPA logo">
              <img src="/sstpa-logo-large.png" alt="SSTPA Tools logo" />
            </aside>
          </div>
        </section>

        {/* 2. System model / graph database */}
        <section className="section-shell mini-section" id="system-model">
          <header className="dual-title dual-title-full">
            <h2 className="simple-title">System Model</h2>
          </header>
          <div className="feature-row">
            <div className="feature-copy section-body">
              <p className="action-title">
                Manage the hierarchical system model in a graph database.
              </p>
              <p>
                Relational databases excel at tabular rows and joins, but hierarchical engineered systems
                are networks of parentage, participation, allocation, and trace. Representing those
                relationships as repeated foreign-key joins becomes brittle and expensive as depth and
                fan-out grow. A graph database stores systems, assets, interfaces, and evidence as nodes
                and named relationships — so traversal of “what parents this,” “what participates here,”
                or “what traces to that asset” stays local and efficient.
              </p>
              <p>
                SSTPA Tools keep the System of Interest model — architecture, assets, hazards, controls,
                requirements, and assurance evidence — in that graph so every analytical view reads and
                writes the same authoritative structure.
              </p>
              <pre className="code-block" tabIndex={0}>
                <code>{`MATCH (root:System)-[:PARENTS*0..]->(soi:System)
WHERE root.name = 'Flight Capability'
RETURN soi.name AS system,
       soi.tier AS tier,
       soi.purpose AS purpose
ORDER BY tier, system`}</code>
              </pre>
              <p className="code-caption">
                Example Cypher: walk the hierarchy under a capability root and return each System of
                Interest with tier and purpose properties.
              </p>
            </div>
            <div className="feature-media">
              <figure className="feature-shot">
                <img
                  src="/docs/screenshots/light/data-drawer-edit.png"
                  alt="SSTPA Tools Data Drawer editing model properties in the Light parchment theme"
                  loading="lazy"
                />
                <figcaption>Data Drawer — inspect and edit model properties</figcaption>
              </figure>
              <div
                className="video-placeholder"
                role="img"
                aria-label="Video coming soon"
              >
                <span className="video-placeholder-label">Video coming soon</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Capabilities → graph of systems */}
        <section className="section-shell mini-section" id="capabilities">
          <header className="dual-title dual-title-full">
            <h2 className="simple-title">Capabilities</h2>
          </header>
          <div className="feature-row feature-row-reverse">
            <div className="feature-copy section-body">
              <p className="action-title">
                Turn capability statements into a navigable graph of systems.
              </p>
              <p>
                SSTPA Tools decompose customer capability requirements into Tier-1 Systems of Interest,
                Connections, and Interfaces — then recurse as Components become child Systems. The
                Navigator is the hierarchy instrument: select an SoI, visualize parentage, clone nodes
                across boundaries when reuse is intended, and keep every Add-on Tool scoped to the same
                living subgraph.
              </p>
              <p>
                The result is not a static diagram archive. It is a graph of systems that grows with the
                architecture and remains the single place Add-on Tools query for discrete security
                analytics.
              </p>
            </div>
            <figure className="feature-shot">
              <img
                src="/docs/screenshots/light/tool-navigator.png"
                alt="SSTPA Tools Navigator showing System of Interest hierarchy"
                loading="lazy"
              />
              <figcaption>Navigator — Systems of Interest and hierarchy</figcaption>
            </figure>
          </div>
        </section>

        {/* 4. Add-on tools */}
        <AddonToolsSection />

        {/* 5. Bottom CTA */}
        <section className="section-shell mini-section conclude" id="documentation">
          <div className="conclude-card">
            <div>
              <header className="dual-title">
                <h2 className="simple-title">Documentation</h2>
                <p className="action-title">Read the methodology. Operate the workbench.</p>
              </header>
              <p>
                Download the SSTPA Methodology White Paper for theory and assurance framing. Open the
                User Guide for the Graphic User Interface, Add-on Tools, Light/Dark parchment themes,
                and step-by-step workflow guidance.
              </p>
            </div>
            <div className="conclude-actions">
              <a className="button primary" href="/files/SSTPA-Methodology-White-Paper-v14.docx" download>
                Download white paper
              </a>
              <a className="button secondary" href="/docs/">
                Open User Guide
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/sstpa-menu-logo.png" alt="SSTPA Tools" />
        </div>
        <p>
          SSTPA Tools implement the SSTPA methodology as an MBSE workbench. Methodology detail is in the
          white paper; product operation is in the <a href="/docs/">User Guide</a>.
        </p>
        <p className="copyright">© 2025 Nicholas Triska. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
