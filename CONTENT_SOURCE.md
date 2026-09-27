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
| Methodology white paper | `/home/netrisk/Projects/SSTPA White Paper/SSTPA_Methodology_White_Paper_v14.docx` | Latest publishable methodology paper; hosted as `public/files/SSTPA-Methodology-White-Paper-v14.docx`. Featured in hero CTAs, Documentation section, and White paper section. |
| Earlier tools draft (archive link) | `/home/netrisk/Projects/sstpa-tool/SSTPA_White_Paper v2.docx` (historical) | Still available at `public/files/SSTPA-Tools-White-Paper-v2.docx` as a secondary archive download only. |
| Documentation controls | `public/docs/` + nav / hero / `#documentation` | User Guide linked from header CTA, hero primary button, Documentation cards, white-paper panel, and deploy note. |
| Copyright | §2.2 Component Copyright | Footer uses © 2025 Nicholas Triska. All rights reserved. |

## Logo-derived visual treatment

Official logo graphics sourced from `/home/netrisk/Projects/SSTPA Tools/Assets/` and copied into `public/`:

- `public/sstpa-menu-logo.png` ← `Assets/SSTPA Tool Menu Logo.png` (header, footer, docs card)
- `public/sstpa-logo-large.png` ← `Assets/SSTPA Logo Large.png` (hero seal, docs card, OG image, footer seal)
- `public/sstpa-app-icon-1024.png` ← `Assets/sstpa-app-icon-1024.png` (favicon / PWA icons)

Derived favicons: `favicon.ico`, `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`.

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


## User Guide (static docs)

Path: `public/docs/` (served at `/docs/` after Vite build; copied into `dist/docs/`).

| Docs area | Source | Notes |
|---|---|---|
| Structure & tool order | `/home/netrisk/Projects/SSTPA White Paper/Grok-Bot Workflow V1.md` | 14-step execution workflow; Add-on Tool first-appearance order; revision loop & hierarchical recurse. |
| GUI walkthrough cues | `/home/netrisk/Projects/SSTPA Tools/docs/TESTING.md` | Local validation guide only — **do not publish credentials** in HTML. |
| Screenshots | Live SSTPA Tools GUI (browser preview → Backend `https://localhost:8543`) | Paired Light (`default`) / Dark (`nocturne`) captures under `public/docs/screenshots/{light,dark}/`. |
| Visual style | Existing site palette + SRS §6.2 Technical Art Nouveau Control Room | Ivory/navy/brass in `public/docs/styles.css`. |

Intentional omissions in the User Guide: no passwords, no fabricated metrics, no customer claims.

## Documentation access on the marketing site

| Control | Location | Target |
|---|---|---|
| Nav CTA **User Guide** | Sticky header | `/docs/` |
| Nav **Docs** | Sticky header | `#documentation` |
| Hero primary buttons | Hero | `/docs/` and methodology DOCX download |
| Documentation section | `#documentation` | Cards for white paper + User Guide |
| White paper panel | `#white-paper` | Methodology DOCX + User Guide secondary |
| Deploy note | `#deploy` | User Guide + white paper download |

