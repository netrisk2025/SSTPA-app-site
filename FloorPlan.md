# Website directory guide

- `src/` — React/TypeScript pages, source-grounded FireSat/tool/methodology content, and responsive digital Art Nouveau styling.
- `src/components/` — Original deterministic white-dot 3D studies, including satellite, jetliner, train, nuclear power plant, ship, enterprise, classroom, and add-on motifs, with accessible motion controls; vocabulary cards, search, transcripts, and audio controls; narrated tutorial course and lesson players.
- `public/` — Official SSTPA logo assets, favicons, retained documentation, white-paper downloads, and website media. Preserve the existing `Audio/` assets.
- `public/docs/` — Existing static user guide and screenshots; original URLs remain available.
- `public/files/` — Downloadable methodology and earlier tools papers.
- `public/Audio/` — Preserved original Systems voice recording.
- `public/audio/` — Source-grounded narration scripts and completed White Knight audio, registered only after verification.
- `public/media/` — Verified silent FireSat screen walkthroughs, captions, posters, and `demos.json`; existing introduction film remains preserved.
- `public/media/tutorials/` — Narrated Loss Tool attack-tree screen walkthroughs with English captions and posters, registered in `public/media/tutorials.json`.
- `scripts/` — Release validation for narration coverage, FireSat walkthrough assets, captions, and preserved downloads; `preservation-baseline.json` records hashes of the pre-tutorial published files.
- `dist/` — Generated production site, recreated by `npm run build`.
- `node_modules/` — Installed build dependencies.

Pre-existing draft snapshot: `/home/netrisk/Documents/Codex/2026-10-02/b/work/site-baseline/existing-site.tgz`.
The completed release is on `main` and published at `https://www.sstpa.app/`. Draft checkpoints remain on `codex/sstpa-digital-nouveau`; pull request #1 records the redesign.
