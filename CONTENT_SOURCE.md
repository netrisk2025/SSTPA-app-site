# SSTPA Tools Website — Content Source Map

Primary source: `/home/netrisk/Projects/sstpa-tool/docs/srs/SSTPA Tool SRS V62.md`.

The website avoids invented customer claims, fake testimonials, and fabricated metrics. Product statements are written as specification-derived positioning.

## Major source areas used

| Website area | Source sections / files inspected | Notes |
|---|---|---|
| Product positioning | §1.2.1 Overview of SSTPA Tools, §1.2.2 Theory of Execution, §1.2.3 Systems Engineering Space | Used to frame SSTPA Tools as an expert workbench for scaling SSTPA to complex hierarchical systems. |
| Methodology workflow | §1.2.2.1 SSTPA Tools Work Flow | Condensed into an eight-step promotional workflow without reproducing the full numbered procedure verbatim. |
| Architecture | §2 SSTPA Tools Architecture, §2.1 Constraints | Used four independently operable segments: Startup Software, Backend, Frontend, Installer; MVP single-machine + future distributed path. |
| Data model | §3 Data Models, §3.3 Core System Data Model, §3.3.3 Canonical Node Labels | Used data sets, SoI boundary model, canonical node groups, and authoritative graph positioning. |
| Security assurance chain | §3.3.1.3 Purpose, Assets, and Security Assurance; §3.3.1.6 Control, Countermeasure, Requirement, Verification | Used the Asset → Hazard → Security Control → Countermeasure → Requirement → Verification trace concept. |
| SysML/KerML interchange | §3.7 SysML 2.0 / KerML 1.0 Interchange Data Model | Used G2M/M2G and “graph remains authoritative; model text is a projection.” |
| Frontend and add-on tools | §6 Frontend, §6.4 Add-on Tool Extension Architecture, §6.5 Add-on Tools | Used manifest-based add-on tool architecture and named tools. |
| Visual style | §6.2.1 GUI Style, §6.2.2 Default_Style.css, §6.3.1 Branding Panel | Used Technical Art Nouveau Control Room, warm ivory canvas, deep navy text, steel-blue linework, restrained brass accents, Source Sans 3 / Cormorant SC / JetBrains Mono. |
| Draft white paper | `/home/netrisk/Projects/sstpa-tool/SSTPA_White_Paper v2.docx` | Hosted as `public/files/SSTPA-Tools-White-Paper-v2.docx`; page copy is limited to draft metadata and extracted executive-summary themes. |
| Copyright | §2.2 Component Copyright | Footer uses © 2025 Nicholas Triska. All rights reserved. |

## Logo-derived visual treatment

Logo assets copied into `public/`:

- `public/sstpa-menu-logo.png`
- `public/sstpa-logo-large.png`

Palette sampled from the logo:

- warm ivory / cream canvas: `#f5f1e8`, `#fffaf0`
- deep navy ink: `#040e1f`, `#081f34`
- desaturated steel blue linework: `#345f7a`, `#8fb1bf`
- restrained brass accent: `#b9904a`
- muted oxblood for destructive-state vocabulary if needed later: `#742c36`

## Intentional omissions

- No testimonials.
- No customer counts.
- No speculative performance numbers.
- No pricing section.
- No contact form backend.
- No claims that the product is already certified, approved, or deployed.
