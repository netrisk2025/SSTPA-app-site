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

`public/audio/scripts.json` contains 22 source-grounded scripts and identical accessible transcripts: home, tools, methodology, installation-admin, workspace, and all 17 add-ons. Each script has 195–208 words (approximately 90–96 seconds at 130 words per minute), source references, and an estimated duration. Actual audio must be checked after rendering.

The requested production voice is the **Systems** voice in WhiteKnight Studio. Scripts are original adaptations of the user's local source material. Playback is user initiated; video demonstrations remain silent. Script presence is not evidence that an audio render has completed. Register playable audio only after its file and measured duration are verified.
