# SSTPA Tools website

A deployable React, TypeScript, and Vite website for SSTPA Tools. The current rebuild presents a cinematic landing page, a searchable collection of the main workspace and 17 add-on tools, and a source-grounded methodology page.

## Run locally

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

## Verify and build

```bash
npm run typecheck
npm run build
```

Vercel uses `npm run build` and serves `dist/`. `vercel.json` rewrites `/tools`, `/tools/:slug`, and `/methodology` to the application. Existing `/docs/` and `/files/` URLs remain static assets and keep working.

## Website content

- `src/content.json` contains 18 tool entries and methodology material derived from the current SSTPA Methodology White Paper (v14), the application tool manifest, and the developer wiki.
- Tool slugs match the application manifest: `navigator`, `requirements`, `reports`, `reference`, `state`, `flow`, `assets`, `context`, `trace`, `loss`, `goalkeeper`, `usecase`, `connection`, `messagecenter`, `admin`, `attack`, and `controls`. The main GUI uses `workspace`.
- Every tool has a dedicated page at `/tools/{slug}`.
- Original documentation and images remain in `public/docs/`. Tools without a dedicated legacy guide link to the general guide.
- The methodology download remains `/files/SSTPA-Methodology-White-Paper-v14.docx`.
- The website does not promise complete threat coverage, automatic certification, or automatic integration with external engineering products.

## Media handoff

The site reads `/media/manifest.json`. Register only completed, verified media. Entries are keyed by tool slug, with `introduction` reserved for the SSTPA logo film.

```json
{
  "workspace": {
    "src": "/media/workspace.mp4",
    "poster": "/media/workspace.jpg",
    "captions": "/media/workspace.vtt",
    "transcript": "The spoken narration, in full.",
    "duration": "00:38"
  }
}
```

`src` is required; other fields are optional. Videos use native controls and never autoplay with audio. Captions and a transcript toggle appear when supplied. Until a real video entry is registered, the page clearly presents a still preview. Existing screenshots are reference material and should be replaced by demonstration posters as recordings become available.

The landing point cloud is an original canvas animation. It supports pointer movement, a pause control, and reduced-motion preference. Fonts are locally bundled DM Sans and Cormorant Garamond.

## Drafts and deployment

Baseline and iteration source snapshots are kept outside this repository at `/home/netrisk/Documents/Codex/2026-10-01/do/work/site-drafts/`. See `FloorPlan.md` for directory roles.

The user has authorized the rebuild and eventual production deployment. Deploy only after actual media is integrated and the website, routes, and video playback are verified. This repository must not be used to alter the SSTPA application or the source white paper.
