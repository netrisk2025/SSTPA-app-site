# Website content sources

Reviewed 2026-10-02. Website copy and narration describe the existing application; this work makes no changes to SSTPA Tools.

## Authority and scope

- `../SSTPA Tools/frontend/src/tools/manifest.ts` registers **17 add-on tools**. Main Workspace is a separate website tour, not an eighteenth add-on.
- `../SSTPA White Paper/SSTPA_Methodology_White_Paper_v14.docx` supplies the methodology, vocabulary, fourteen-step workflow, model relationships, and evidence/acceptance distinctions. Sections 3–4 ground the concepts; sections 7–9 ground the workflow and tool purposes.
- Current components in `../SSTPA Tools/frontend/src/tools/<slug>/` establish actual tool behavior. `../SSTPA_Dev_WIKI/wiki/entities/tool-<slug>.md` provides the navigation map and supporting descriptions; current code takes precedence.
- `../SSTPA Tools/installer/README.md`, startup source, and `deploy/docker-compose.yml` establish the installation and service architecture. Local deployment secrets are neither read for content nor copied into this site.

## FireSat continuity

The website uses **FireSat**, whose source model is `../SSTPA Tools/Example_Data/FireSat/model/`. The hierarchy guide and Example_Data README describe its educational scope: four Tier-1 segments, 33 Systems, 467 nodes, 842 relationships, and system decomposition through Tier 8. FireSat is structurally comprehensive and intentionally not a validated operational design.

The primary walkthrough System of Interest is **Fire Detection Payload**, `SYS_1.1.2_0`. Its supplied model contains:

- Purpose: **Fire Sensing And Reporting**.
- Environment: **Payload Operating Environment**.
- States: **Standby** and **Imaging**.
- Functions: **Collect Infrared Radiance**, **Classify Fire Detections**, **Format And Queue Detection Reports**.
- Interfaces: **Sensor Video Input Interface**, **Payload Downlink Feed Interface**.
- Requirements: **Payload Detection Chain**, **Payload Geolocation**.

Connection demonstrations use the supplied **Detection Downlink**, owned by the Space Segment, with payload and ground-receiver participants. The old website's Sentinel Mission, Environmental Monitoring System, Alert data, Observe/Transmit, and Field deployment examples have been removed from `src/content.json`.

The supplied FireSat model deliberately omits Assets, trace relationships, Use Cases, Losses, Attack Trees, Control Structures, Countermeasures, and Verification nodes. Website walkthroughs and scripts identify their security analysis as **tutorial additions**. A proposed detection-report integrity scenario is a teaching example, not a claim that those records ship in the default package or that this educational mission is certified. Prepared recordings should match the tutorial records actually loaded into their isolated demonstration environment.

## Tool coverage and source checks

| Website slug | Registered tool | Current source component | White paper focus |
|---|---|---|---|
| navigator | Navigator Tool | navigator/NavigatorTool.tsx | Hierarchy, recursion, System of Interest |
| requirements | Requirements Tool | requirements/RequirementsTool.tsx | Derivation, allocation, verification |
| reports | Reports Tool | reports/ReportsTool.tsx | Review outputs and traceability gaps |
| reference | Reference Tool | reference/ReferenceTool.tsx | Catalog research and application |
| state | State Tool | state/StateTool.tsx | States, transitions, environments |
| flow | Flow Tool | flow/FlowTool.tsx | Functional flow and STPA control structures |
| assets | Asset Manager Tool | assets/AssetManagerTool.tsx | Asset value, criticality, attributes, regimes |
| context | Context Tool | context/ContextTool.tsx | Environment, hazard, loss allocation |
| trace | Trace Tool | trace/TraceTool.tsx | State-scoped hold, transport, use |
| loss | Loss Tool | loss/LossTool.tsx | Attack trees, paths, residual vulnerabilities |
| goalkeeper | Goal Keeper Tool | goalkeeper/GoalKeeperTool.tsx | GSN structure, evidence, validation |
| usecase | Use-Case Tool | usecase/UseCaseTool.tsx | Purpose, actors, participating architecture |
| connection | Connection Tool | connection/ConnectionTool.tsx | Cross-system interface participation |
| messagecenter | Message Center | messagecenter/MessageCenterTool.tsx | User data and stewardship |
| admin | Admin Tool | admin/AdminTool.tsx | Account and environment stewardship |
| attack | Attack Tool | attack/AttackTool.tsx | Exploitation, hierarchy, loss scope |
| controls | Controls Tool | controls/ControlsTool.tsx | Baselines, tailoring, implementation mapping |

## Wording decisions that preserve accuracy

- Requirements/architecture tools do not replace the enterprise's functional engineering environment. The site describes SSTPA as the connected System Security Solution.
- A security **attribute** is the required property; **assurance** is justified confidence that it holds. Legacy field names may differ.
- Loss analysis is scoped to one asset, one security attribute, and one environment. Risk acceptance remains with the responsible authority under the applicable regime.
- GSN structural validation does not establish that an argument is convincing or accepted.
- Controls automatic baseline generation depends on compatible NIST allocation metadata in the loaded reference bundle. The current code notes the absence of CNSSI 1253 allocation tables; website copy does not claim a complete automated CNSSI baseline.
- Reports PDF output uses the print workflow. The site does not promise a separate direct PDF rendering service.
- Message Center supports compose and reply in current code; the older wiki's brief summary does not enumerate all those controls.
- FireSat package management is external to the app. There is no claim of an in-app Reset FireSat command.
- Current manifest export lists and actual tool views differ in a few details; page copy lists only supported, relevant functions, without promising every manifest format.

## Narration delivery

`public/audio/scripts.json` contains 22 source-grounded scripts and identical accessible transcripts: home, tools, methodology, installation-admin, workspace, and all 17 add-ons. Each script has 195–216 words (approximately 90–100 seconds at 130 words per minute), source references, and an estimated duration. Actual audio must be checked after rendering.

The requested production voice is the **Systems** voice in WhiteKnight Studio. Scripts are original adaptations of the user's local source material. Playback is user initiated; video demonstrations remain silent. Script presence is not evidence that an audio render has completed. Register playable audio only after its file and measured duration are verified.

## Runtime verification note

The recorded current Admin interface marks Sandbox Management as under construction. Admin page copy and its unrendered narration explicitly state that limitation. The installation narration describes the available administrative views without promising completed sandbox operations. Empty Reference, Flow, Use-Case, or Controls views depend on the loaded reference and tutorial data and are not presented as populated shipped records.

## Recorded tutorial reconciliation

The live FireSat workspace contains prepared security records beyond the shipped YAML: Fire Detection Data with availability/authenticity objectives, an authenticity loss, and a partly evidenced GSN argument. `public/media/demos.json` supplies the exact observed navigation, empty scopes, and validation findings for every film. Website example steps now match that manifest. Narrations describe the recorded limits explicitly; Reports and Reference first-draft audio is superseded by revised renders. The Connection walkthrough is Sensor Video Link in Fire Detection Payload, not the cross-segment Detection Downlink.

## Earlier white-paper edition labeling (superseded by Version 16 below)

The latest supplied filename is `SSTPA_Methodology_White_Paper_v14.docx`, while the document's internal cover still reads Version 13. The site labels the download **Current edition**, preserving the author's source document unchanged. The hosted download is refreshed from the current source at the existing URL; filename numbering is not presented as verified cover metadata.

## Completed audio production

All 22 narrations were rendered in WhiteKnight Studio on 2026-10-02 using the existing **Systems** project's exact narrator. Website chapters were appended; final backup comparison confirms the original Chapter 1 and the entire cast remain unchanged. The two superseded Reports/Reference drafts remain recoverable; the website uses their revised, video-aligned renders.

Each export used **One scene** with **Include sounds** off. Published MP3s are 79–97 seconds long, contain one audio stream each, and have distinct hashes. The 22 final Studio chapter texts match the public transcripts exactly. `public/audio/manifest.json` contains only verified completed audio. Source WAVs, before/after Studio backups, and chapter-level rendering provenance are retained outside the repository in the task's `work/audio-sources/` directory.

## Version 16 vocabulary update — 4 October 2026

The approved `SSTPA_Methodology_White_Paper_v16.docx` supersedes the v14 download. Its cover, running headers, and core metadata identify Version 16. The public file is an unchanged copy of that approved document. Sections 3.2, 3.6, and 6 ground the new vocabulary page and its short narration scripts. Earlier application pages, recordings, walkthroughs, guides, and other downloads remain preserved.

The vocabulary distinguishes capitalized **Assurance**, the SSTPA protected-property label, from conventional assurance as justified confidence. **Loss in SSTPA** is attacker effort to violate one Assurance on one asset in one environment, modeled as an attack tree. Greater comparable effort means greater resistance; this differs from STPA loss as stakeholder harm. Controls enforce constraints through parent MUST statements and implementing SHALL requirements, explicitly an SSTPA convention. Each vocabulary transcript identifies the relevant lineage, and each card links its source documents.

All 28 vocabulary clips were generated in White Knight Studio's existing **Systems** project using its bound narrator. They are narration-only takes, with measured durations of 41.36–50.56 seconds. Every published MP3 has a distinct hash and decodes cleanly. All 28 saved Studio manuscripts match the published scripts; the original 25 chapter titles and texts remain present. The public manifest records durations, transcripts, and references, while source take URLs and verification records are retained in the task's `work/website/` directory. Browser checks covered desktop/mobile layouts, category filters, search, transcript expansion, and single-clip playback.

## Criticality and Assurance vocabulary revision — 4 October 2026

Eleven additional recordings cover Criticality, Mission Critical, Safety Critical, Flight Critical, Security Critical, Confidentiality, Integrity, Availability, Authenticity, Non-repudiation, and Trustworthy. Primary sources include NIST IR 8179, SP 800-160v1r1, SP 800-57 Part 1 Rev. 5, FIPS 200, FIPS 186-5, SP 800-38D, SP 800-53 Rev. 5, NASA-STD-8739.8B, and FAA AC 25.1309-1B. Each card links the relevant sources. The page no longer cites the SSTPA white paper or SRS as authorities. The site’s navigation and downloads remain intact.

Criticality is expressed as SSTPA’s system-property convention, with regime-specific design guidelines and distinct, potentially overlapping analysis boundaries. FAA failure-condition classification is distinguished from SSTPA’s Flight Critical label. Integrity uses the narrower data-integrity meaning; Authenticity identifies genuine origin and explicitly labels creator deployment intent and testing/validation commitments as an SSTPA extension. Upstream verification of those commitments remains outside SSTPA. Trustworthy is a bounded judgment supported by evidence and used by SSTPA as an Assurance, not a consequence of signature validity alone. Certifiability is not included.

The sequence retains the three introductory method overviews and moves Environment and Regime earlier as foundations. The new criticality block follows Asset; the six additional Assurance entries follow Assurance — justified confidence. Prerequisites capture conceptual dependence rather than every illustrative forward reference. Category and search results include all transitive prerequisites, so listeners need not select another category for foundations.

The eleven new narration-only takes use the existing White Knight Systems narrator and measure 46.08–58.80 seconds. Their saved Studio manuscripts match the published transcripts; all 53 earlier Studio chapters remain unchanged. All 39 vocabulary clips decode successfully, have distinct hashes, and fall within 30–60 seconds. Release checks compare the original 28 clips and all other public assets with the prior release byte for byte, and exercise transitive prerequisite selection and the requested learning sequence.
