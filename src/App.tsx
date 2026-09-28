type Tool = {
  name: string;
  blurb: string;
};

const capabilityBullets = [
  'Asset-centric Loss — compromise of a security attribute on an asset',
  'Add-on Tools that decompose and analyze each System of Interest',
  'Evidence-backed Goal Structuring Notation (GSN) assurance arguments',
];

const addonTools: Tool[] = [
  { name: 'Navigator', blurb: 'Select a System of Interest, traverse hierarchy, clone, and associate.' },
  { name: 'Requirements', blurb: 'Allocate, parent, and verify security and capability requirements.' },
  { name: 'Connection', blurb: 'Model Connections and Interface participants across systems.' },
  { name: 'Asset Manager', blurb: 'Define Assets, Regime, Criticality, and security Assurances.' },
  { name: 'State', blurb: 'Capture security state-transition behavior for the SoI.' },
  { name: 'Context', blurb: 'Place Environments, hazards, and validity relationships around the SoI.' },
  { name: 'Reference', blurb: 'Research and assign framework material such as ATT&CK, NIST, and EMB3D.' },
  { name: 'Flow', blurb: 'Analyze Functional Flow and STPA-style Control Flow.' },
  { name: 'Controls', blurb: 'Build the Security Controls baseline and validation criteria.' },
  { name: 'Trace', blurb: 'Follow state-scoped Asset traces through the model.' },
  { name: 'Attack', blurb: 'Project actionable Attacks onto susceptible entities.' },
  { name: 'Loss', blurb: 'Build Structured Attack Trees and residual-vulnerability findings.' },
  { name: 'Goal Keeper', blurb: 'Assemble GSN assurance arguments tied to V&V evidence.' },
  { name: 'Use-Case', blurb: 'Describe boundary behavior and operational use contexts.' },
  { name: 'Reports', blurb: 'Produce figures and evidence packages for review and sustainment.' },
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

function App() {
  return (
    <>
      <Header />
      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <p className="eyebrow">Systems Security-Theoretic Process Analysis</p>
            <h1>SSTPA Methodology</h1>
            <p className="lede">
              System Security-Theoretic Process Analysis (SSTPA) is a human- and asset-centered systems
              security engineering methodology for developing secure complex hierarchical engineered
              systems so they can support certification and authorization decisions. Loss is defined as
              the compromise of a security attribute on an asset; analysis is disciplined into verifiable
              security requirements, residual-vulnerability disposition, and Goal Structuring Notation
              (GSN) assurance arguments. SSTPA Tools implement the methodology as an MBSE environment on
              a graph database.
            </p>
            <ul className="hero-bullets" aria-label="Core capabilities">
              {capabilityBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <a className="button primary" href="/files/SSTPA-Methodology-White-Paper-v14.docx" download>
                Download white paper
              </a>
              <a className="button secondary" href="/docs/">
                Open User Guide
              </a>
            </div>
          </div>
          <aside className="hero-logo" aria-label="SSTPA logo">
            <img src="/sstpa-logo-large.png" alt="SSTPA Tools logo" />
          </aside>
        </section>

        <section className="section-shell feature-row" id="system-model">
          <div className="feature-copy">
            <p className="eyebrow">System model</p>
            <h2>One authoritative graph for each System of Interest.</h2>
            <p>
              SSTPA Tools keep architecture, assets, hazards, controls, requirements, and evidence in a
              single validated model. Navigate the hierarchy, select an SoI, and keep every analytical view
              aligned to the same underlying data.
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
        </section>

        <section className="section-shell feature-row feature-row-reverse" id="gui">
          <div className="feature-copy">
            <p className="eyebrow">GUI</p>
            <h2>A parchment workbench for staged editing and commit.</h2>
            <p>
              The desktop GUI presents Branding, Control Panel, SoI context, Main Panel cards, and a Data
              Drawer for inspect-and-edit. Changes stage locally, then commit after backend validation —
              so the graph remains the source of truth.
            </p>
          </div>
          <figure className="feature-shot">
            <img
              src="/docs/screenshots/light/data-drawer-edit.png"
              alt="SSTPA Tools Data Drawer edit view in Light parchment theme"
              loading="lazy"
            />
            <figcaption>Data Drawer — inspect and edit model properties</figcaption>
          </figure>
        </section>

        <section className="section-shell tools-section" id="tools">
          <div className="section-heading center-heading">
            <p className="eyebrow">Add-on tools</p>
            <h2>Specialized instruments in a typical order of use.</h2>
            <p>
              Add-on Tools follow the SSTPA methodology workflow. The sequence below implies a useful
              path through analysis — it does not mandate a rigid procedure. Details live in the User
              Guide and white paper.
            </p>
          </div>
          <div className="tool-grid">
            {addonTools.map((tool, index) => (
              <article className="tool-card" key={tool.name}>
                <span className="tool-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{tool.name}</h3>
                <p>{tool.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell conclude" id="documentation">
          <div className="conclude-card">
            <div>
              <p className="eyebrow">Documentation</p>
              <h2>Read the methodology. Operate the workbench.</h2>
              <p>
                Download the SSTPA Methodology White Paper for theory and assurance framing. Open the
                User Guide for the GUI, Add-on Tools, Light/Dark parchment themes, and step-by-step
                workflow guidance.
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
