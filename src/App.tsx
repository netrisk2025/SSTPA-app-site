type Dataset = {
  name: string;
  purpose: string;
  treatment: string;
};

type Tool = {
  name: string;
  role: string;
  output: string;
};

const srsConstants = [
  { value: '4', label: 'independently operable product segments' },
  { value: '6', label: 'backend data sets governed by the model' },
  { value: '2', label: 'standard text translators: G2M and M2G' },
  { value: '1', label: 'authoritative Core Data Model graph' },
];

const datasets: Dataset[] = [
  {
    name: 'Core System Data',
    purpose: 'The authoritative project graph rooted in Capability and System-of-Interest subgraphs.',
    treatment: 'Neo4j-backed validation of labels, relationships, SoI membership, cardinality, and bounded traversals.',
  },
  {
    name: 'Reference Data',
    purpose: 'Packaged cybersecurity and assurance frameworks such as NIST SP 800-53, MITRE ATT&CK / ATLAS, EMB3D, and survivability attributes.',
    treatment: 'Read-only source material that can be reviewed, searched, referenced, and cloned into user-owned core nodes.',
  },
  {
    name: 'User Data',
    purpose: 'Users, admins, mailboxes, ownership, creator identity, and notifications.',
    treatment: 'Supports large engineering teams and ownership-aware change notification through Message Center.',
  },
  {
    name: 'Product, Help, Example Data',
    purpose: 'Versioning, licensing, hover help, tutorial exemplars, and resettable example projects.',
    treatment: 'Kept distinct from engineering data so the authoritative model remains traceable and auditable.',
  },
];

const nodeGroups = [
  {
    group: 'Project / hierarchy',
    labels: ['Capability', 'Sandbox', 'System'],
  },
  {
    group: 'Structure & behavior',
    labels: ['Environment', 'Connection', 'Interface', 'Function', 'Element', 'State'],
  },
  {
    group: 'Intent & specification',
    labels: ['Purpose', 'Use Case', 'Constraint', 'Requirement', 'Validation', 'Verification'],
  },
  {
    group: 'Security analysis',
    labels: ['Asset', 'Regime', 'Hazard', 'Loss', 'Attack', 'Countermeasure', 'Control'],
  },
  {
    group: 'Assurance case',
    labels: ['Goal', 'Strategy', 'Context', 'Assumption', 'Justification', 'Solution'],
  },
];

const toolSuite: Tool[] = [
  {
    name: 'Navigator',
    role: 'Select a System of Interest, traverse hierarchy, locate HIDs / UUIDs / names, and support controlled cross-SoI association.',
    output: 'Hierarchy views, clone selections, connection participant displays, exportable captures.',
  },
  {
    name: 'Requirements',
    role: 'Manage requirement hierarchy and allocation across Capability, Purpose, Interface, Function, Element, Countermeasure, and related nodes.',
    output: 'SysML-compliant requirement visualization and traceable requirement structure.',
  },
  {
    name: 'Reference',
    role: 'Search, review, and associate NIST / MITRE / EMB3D / user-created reference framework content.',
    output: 'Controlled reference lookup and clone workflows without mutating authoritative reference data.',
  },
  {
    name: 'State',
    role: 'Work with State nodes, transition relationships, hazards, countermeasures, requirements, and environment validity.',
    output: 'State diagrams, relationship criteria views, PNG / SVG exports, SysML model text panels.',
  },
  {
    name: 'Loss',
    role: 'Analyze asset loss as a structured attack tree with validation snapshots, layout persistence, and status findings.',
    output: 'Attack-tree evidence, invalidation findings, reporting figures, and certification-support artifacts.',
  },
  {
    name: 'Goal Keeper',
    role: 'Organize assurance argumentation using Goal Structured Notation concepts tied to evidence-bearing nodes.',
    output: 'Certification package support and assurance case structure across assets, loss, verification, and validation.',
  },
  {
    name: 'Use-Case / Connection / Attack / Controls',
    role: 'Specialized tools for boundary behavior, cross-system interfaces, attack projection, and control-countermeasure reasoning.',
    output: 'Focused analytical views that preserve Core Data Model relationship rules.',
  },
  {
    name: 'Message Center & Admin',
    role: 'Enforce ownership-aware collaboration, notifications, user enrollment, and administrative lifecycle control.',
    output: 'Internal messaging, account control, and accountable change management.',
  },
];

const workflow = [
  'Capture capability, customer constraints, and criticality regimes.',
  'Model the tier architecture as Systems of Interest, Elements, Functions, Interfaces, Assets, States, and Environments.',
  'Allocate capability requirements through Purpose and derive system-security requirements for each SoI.',
  'Identify Connections, Hazards, Loss conditions, Security Controls, and Countermeasures.',
  'Generate and verify Requirements that realize the Countermeasures and preserve Asset assurance.',
  'Decompose child Systems from Elements and repeat the analysis through the system tree.',
  'Verify implementation and validate each realized System against its Purpose and Environment.',
  'Assemble the evidence body needed for external certification, approval, and sustainment.',
];

const architectureSegments = [
  {
    segment: 'Startup Software',
    description: 'Authenticates the user and starts the Backend and Frontend for the MVP single-machine workflow.',
  },
  {
    segment: 'Backend',
    description: 'Hosts the authoritative graph, validates mutations, assigns HID / UUID identity, enforces SoI boundaries, and controls ACID transactions.',
  },
  {
    segment: 'Frontend',
    description: 'A desktop GUI and dynamic Add-on Tool shell for inspecting, editing, staging, validating, and committing graph changes.',
  },
  {
    segment: 'Installer',
    description: 'Packages Startup Software, Frontend, and Backend for customer delivery across supported operating environments.',
  },
];

function OrnamentalRule() {
  return (
    <div className="ornamental-rule" aria-hidden="true">
      <span />
      <svg viewBox="0 0 220 28" role="presentation">
        <path d="M4 14 C34 14 30 2 55 2 C82 2 74 26 108 26 C142 26 138 2 165 2 C190 2 186 14 216 14" />
        <path d="M73 14 C88 4 101 4 110 14 C119 24 132 24 147 14" />
        <circle cx="110" cy="14" r="3.5" />
      </svg>
      <span />
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="SSTPA Tools home">
        <img src="/sstpa-menu-logo.png" alt="SSTPA Tools logo" />
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#method">Method</a>
        <a href="#model">Model</a>
        <a href="#tools">Tools</a>
        <a href="#interchange">Interchange</a>
        <a href="#white-paper">White paper</a>
        <a href="#deploy">Deploy</a>
      </nav>
    </header>
  );
}

function HeroPlate() {
  const rows = [
    { node: 'Asset', relationship: 'is protected through' },
    { node: 'Hazard', relationship: '<-[:MITIGATES]-' },
    { node: 'SecurityControl', relationship: '<-[:SATISFIES]-' },
    { node: 'Countermeasure', relationship: '-[:HAS_REQUIREMENT]->' },
    { node: 'Requirement', relationship: '-[:VERIFIED_BY]->' },
    { node: 'Verification', relationship: 'produces evidence for assurance' },
  ];

  return (
    <aside className="hero-plate" aria-label="SSTPA assurance chain diagram">
      <div className="plate-title-row">
        <span className="mono-tag">CURRENT SOI</span>
        <span className="status-pill">Backend validation before commit</span>
      </div>
      <div className="assurance-chain">
        {rows.map((row) => (
          <div className="chain-row" key={row.node}>
            <span className="node-token">(:{row.node})</span>
            <span className="relationship-token">{row.relationship}</span>
          </div>
        ))}
      </div>
      <dl className="plate-register">
        <div>
          <dt>Identity</dt>
          <dd>HID · uuid · Owner · Creator · VersionID</dd>
        </div>
        <div>
          <dt>Boundary</dt>
          <dd>System of Interest membership by HID index</dd>
        </div>
        <div>
          <dt>Discipline</dt>
          <dd>Directed relationships · no unbounded recursive traversals</dd>
        </div>
      </dl>
    </aside>
  );
}

function App() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <p className="eyebrow">Systems Security-Theoretic Process Analysis</p>
            <h1>Asset‑centric assurance engineering for complex systems.</h1>
            <p className="lede">
              SSTPA Tools is a system security architecture workbench for experts who must turn assets, hazards, controls, countermeasures, requirements, verification, validation, and evidence into a disciplined engineering model.
            </p>
            <p>
              Derived from the SSTPA Tool SRS, this product narrative emphasizes what the application is designed to do: scale the SSTPA methodology across large hierarchical systems while preserving analytical clarity, ownership, traceability, and certification support.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#model">Inspect the model</a>
              <a className="button secondary" href="#tools">Explore the tool suite</a>
              <a className="button secondary" href="/files/SSTPA-Tools-White-Paper-v2.docx" download>Download draft white paper</a>
            </div>
          </div>
          <HeroPlate />
        </section>

        <section className="stat-band" aria-label="SRS-derived system constants">
          {srsConstants.map((item) => (
            <div className="stat-cell" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="section-shell twin-panel" id="method">
          <div className="section-heading sticky-heading">
            <p className="eyebrow">Methodology</p>
            <h2>Built around the way security architects actually decompose and certify systems.</h2>
            <OrnamentalRule />
            <p>
              SSTPA extends STPA for system security by making the analysis asset-centric and criticality-aware. The work proceeds top-down through decomposition and bottom-up through realization, verification, validation, and evidence assembly.
            </p>
          </div>
          <ol className="workflow-list">
            {workflow.map((step, index) => (
              <li key={step}>
                <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-shell" id="model">
          <div className="section-heading center-heading">
            <p className="eyebrow">Authoritative Graph Model</p>
            <h2>One core model for backend validation, frontend editing, add-on tools, reports, and interchange.</h2>
            <p>
              The SRS specifies the Core Data Model as the authoritative graph. Model text, diagrams, report figures, and tool views are projections over validated data rather than disconnected documents.
            </p>
          </div>
          <div className="dataset-grid">
            {datasets.map((dataset) => (
              <article className="dataset-card" key={dataset.name}>
                <h3>{dataset.name}</h3>
                <p>{dataset.purpose}</p>
                <small>{dataset.treatment}</small>
              </article>
            ))}
          </div>
          <div className="node-ledger" aria-label="Core model node groups">
            {nodeGroups.map((group) => (
              <div className="ledger-group" key={group.group}>
                <h3>{group.group}</h3>
                <div className="token-cloud">
                  {group.labels.map((label) => (
                    <span key={label}>:{label.replaceAll(' ', '')}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell proof-section">
          <div className="proof-panel">
            <p className="eyebrow">Security Assurance Chain</p>
            <h2>Trace protection from value to evidence without losing the engineering thread.</h2>
            <p>
              The SRS describes a security assurance relationship chain that begins with the Asset and proceeds through Hazard, Security Control, Countermeasure, Requirement, and Verification. SSTPA Tools makes that chain navigable, stageable, validated, and reportable.
            </p>
          </div>
          <div className="chain-diagram" aria-label="Asset to verification chain">
            {['Asset', 'Hazard', 'Security Control', 'Countermeasure', 'Requirement', 'Verification'].map((item, index) => (
              <div className="chain-node" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell" id="tools">
          <div className="section-heading center-heading">
            <p className="eyebrow">Manifest-based Add-on Tools</p>
            <h2>Specialized analytical instruments, not a generic dashboard.</h2>
            <p>
              Add-on Tools are specified as manifest-registered extensions that consume the active GUI theme, receive launch context, use backend capabilities, and follow the same staged-edit and Commit confirmation model.
            </p>
          </div>
          <div className="tool-table" role="table" aria-label="SSTPA add-on tools">
            <div className="table-header" role="row">
              <span role="columnheader">Tool</span>
              <span role="columnheader">Analytical role</span>
              <span role="columnheader">Produced artifact</span>
            </div>
            {toolSuite.map((tool) => (
              <div className="table-row" role="row" key={tool.name}>
                <strong role="cell">{tool.name}</strong>
                <span role="cell">{tool.role}</span>
                <span role="cell">{tool.output}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell interchange" id="interchange">
          <div>
            <p className="eyebrow">SysML 2.0 / KerML 1.0 Interchange</p>
            <h2>The graph remains authoritative; model text is a controlled projection.</h2>
            <p>
              SSTPA Tools is specified to maintain standard textual projection into SysML 2.0 and KerML 1.0. G2M exports the Core Data Model into standard model text, while M2G imports model text as staged Core Data Model mutations that only become authoritative after backend validation and Commit.
            </p>
          </div>
          <div className="translator-cards">
            <article>
              <span className="mono-tag">G2M</span>
              <h3>Graph to Model</h3>
              <p>Exports Core System Data and Example Data into standard SysML / KerML textual notation using the SSTPA Profile Library.</p>
            </article>
            <article>
              <span className="mono-tag">M2G</span>
              <h3>Model to Graph</h3>
              <p>Turns authored model text into staged graph mutations, preserving backend validation as the final authority.</p>
            </article>
          </div>
        </section>

        <section className="section-shell white-paper" id="white-paper">
          <div className="white-paper-card">
            <div>
              <p className="eyebrow">Draft White Paper</p>
              <h2>Read the unfinished SSTPA Tools white paper.</h2>
              <p>
                The hosted draft introduces Systems Security-Theoretic Process Analysis Tools as a way to engineer, model, analyze, and document system security across large hierarchical systems and certification regimes.
              </p>
              <ul className="paper-points" aria-label="White paper themes">
                <li><strong>Asset-centric analysis</strong><span>security reasoning framed around assurance on assets.</span></li>
                <li><strong>Data-centric configuration control</strong><span>authoritative graph data structures under ACID-compliant backend control.</span></li>
                <li><strong>MBSE interchange</strong><span>SysML 2.0 and KerML 1.0 compliant system views.</span></li>
                <li><strong>SSTPA context</strong><span>assurances analyzed in system context, at rest and in motion.</span></li>
              </ul>
            </div>
            <aside className="paper-download-panel" aria-label="White paper download">
              <span className="mono-tag">Version 0.5.7 · April 2026</span>
              <h3>SSTPA Tools White Paper</h3>
              <p>Draft DOCX hosted with the static site. Content is subject to revision.</p>
              <dl className="paper-filing">
                <div>
                  <dt>Format</dt>
                  <dd>Microsoft Word document</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>3.5 MB</dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>SSTPA_White_Paper v2.docx</dd>
                </div>
              </dl>
              <a className="button primary" href="/files/SSTPA-Tools-White-Paper-v2.docx" download>Download DOCX</a>
            </aside>
          </div>
        </section>

        <section className="section-shell architecture" id="deploy">
          <div className="section-heading center-heading">
            <p className="eyebrow">Product Architecture</p>
            <h2>Designed for air-gapped expert work now, with a path to larger enterprise deployments.</h2>
            <p>
              The MVP places Backend and Frontend on a single physical system while supporting multiple users and administrators operating through separate Frontend instances connected to one Backend server.
            </p>
          </div>
          <div className="segment-grid">
            {architectureSegments.map((segment) => (
              <article className="segment-card" key={segment.segment}>
                <h3>{segment.segment}</h3>
                <p>{segment.description}</p>
              </article>
            ))}
          </div>
          <div className="deployment-note">
            <div>
              <strong>Website handoff</strong>
              <p>This promotional site is a Vite + React static build. Vercel output is <code>dist/</code> after <code>npm run build</code>. The draft white paper is served from <code>public/files/</code>.</p>
            </div>
            <a className="button primary" href="/sstpa-menu-logo.png">View source logo asset</a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <img src="/sstpa-menu-logo.png" alt="SSTPA Tools" />
        <p>
          Content derived from <strong>SSTPA Tool SRS V62</strong> (SRS version 0.5.9.1, May 15, 2026). Visual system follows the SRS-described <strong>Technical Art Nouveau Control Room</strong>: warm ivory canvas, deep desaturated navy typography, steel-blue linework, and restrained brass accents.
        </p>
        <p className="copyright">© 2025 Nicholas Triska. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
