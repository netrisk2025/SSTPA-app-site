# SSTPA Tools website

A React, TypeScript, and Vite site for SSTPA Tools, with an original digital Art Nouveau design, deterministic white-dot systems, FireSat walkthroughs, and opt-in White Knight narration.

## Development and release checks

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5174
npm run typecheck
npm run build
npm run verify
```

`verify` is a release-completeness gate. It requires all 22 distinct 1–2 minute narrations, all 18 silent FireSat walkthroughs, valid captions, working local guide/download targets, and the built production assets. It intentionally fails while a media draft is incomplete. Decode media with ffmpeg/ffprobe when changing recordings, and exercise playback, navigation, search, motion controls, and responsive layouts in a browser.

## Pages and sources

- `/` — general introduction and authored satellite, jetliner, and train studies.
- `/installation` — installation, startup, backend services/data partitions, and administration.
- `/tools/workspace` — navigating an established project and System of Interest.
- `/tools` and `/tools/{slug}` — searchable directory and dedicated pages for the 17 add-ons.
- `/methodology` — source-grounded introduction and fourteen-step workflow.
- `/docs/` — retained online guide, with original deep links and screenshots.
- `/files/SSTPA-Methodology-White-Paper-v14.docx` — retained methodology download.

`src/content.json` and `CONTENT_SOURCE.md` document the current application, developer wiki, FireSat example, and methodology white paper. The FireSat architecture ships separately from tutorial analysis. The recorded example contains existing tutorial data; incomplete views and runtime limitations are identified in each walkthrough's notes. No SSTPA Tools application source or model records were changed for this website.

## Original animation

`src/components/ParticleScene.tsx` precomputes authored 3D point geometry and replays deterministic assembly, rotation, and dissolution. It has no runtime AI or third-party generation requests. Pause/resume preserves position; reduced motion presents a static study; offscreen/background animation stops. CSS adapts to the parent scene size. Fonts are bundled locally.

## Audio and silent walkthroughs

`public/audio/scripts.json` contains the full, source-grounded narration text and source references. `public/audio/manifest.json` registers verified MP3s keyed by page slug. Audio never autoplays; the page player supports play/pause, seek, and full transcripts.

Narration uses the original **Systems** narrator in the user's White Knight Studio account. The custom voice is bound to its source project, so website narrations are appended as separate chapters in that project, preserving the original chapter. Export narration with **Include sounds** unchecked. Do not replace this voice without user direction.

`public/media/demos.json` registers 18 silent, captioned **screen walkthroughs assembled from genuine sequential application screenshots**, not continuous screen recordings. Each uses the existing FireSat model, H.264 video at 1280×820, no audio stream, an embedded step band, a poster, optional VTT captions, and written steps. The website displays current-build caveats from each `note`.

The earlier `public/Audio/Systems(1).wav` and introduction film remain preserved; the new website uses the page narrations and silent walkthroughs instead.

## Deployment

The existing Vercel project builds with `npm run build` and serves `dist`. `vercel.json` preserves `/docs/` and `/files/` while routing the application pages. The GitHub repository is `netrisk2025/SSTPA-app-site`; draft checkpoints are pushed on `codex/sstpa-digital-nouveau` and reviewed in pull request #1. Publish the complete site only after build, release validation, media checks, and browser QA pass.
