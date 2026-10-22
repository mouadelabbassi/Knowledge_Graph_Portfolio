# Mouad — The Living Knowledge Graph

The portfolio now includes all 14 projects, a dedicated optimization research feature, eight credentials, two volunteering roles, the expanded skill record, original report downloads, and the unmodified portrait. The project archive has category filters and skill search. The printable recruiter view uses the same complete dataset. See [source coverage and validation](docs/portfolio-expansion.md).

A Vite + React + strict TypeScript portfolio targeting a static Vercel build. Milestones 1 and 2 implement the typed source data, 3D graph, accessible panels, local Ask with reasoning replay, recruiter mode, mobile layout, and HTML-only prerendering. The profiling fix bakes/caches a converged layout, uses demand rendering, and removes redundant label writes.

## Run

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. To check the production build:

```sh
npm run test
npm run build
npm run preview
```

`npm run build` includes the TypeScript check, the Vite build, HTML text prerendering, and a measured gzip bundle budget. Its bundle report is written to `docs/bundle-report.json`.

## Review the current milestone

- Explore the living constellation through All connections, AI & language, Data & insight, or Software & systems. Select a cluster or star to focus its neighbors and preview its story; choose Open the story or Browse the nodes for full details.
- Use Explore in full screen for the immersive constellation with a work directory. Escape returns to the portfolio; the explorer traps keyboard focus while expanded. Drag to rotate freely, including across the poles; scroll to zoom and right-drag to pan. On touch screens, drag to rotate, pinch to zoom, and use two fingers to pan or twist. The rail includes zoom, reset, floating-motion pause, and neural-connections controls.
- Nodes swim in a bounded 3D field. Their labels, curved connections, query paths, and travelling light impulses share the same live positions. Neural view shows the existing graph relations; pausing freezes the swimming and impulses while preserving camera interaction. Reset restores the front orientation and overview.
- Hover a node to highlight adjacent relationships. Select a project, employer, skill, certification, or education entry; the camera flies toward that node.
- Use the node directory and every ordinary content section without touching the canvas.
- Press Escape to close a panel. Native dialogs trap focus; focus returns to the initiating control.
- Try Pause motion, Reset view, and Text view.
- Test a narrow phone viewport. Reduced motion and unavailable WebGL automatically use the complete 2D content path.
- Choose Ask in the header, then try the RL, RAG, extraction, and agentic QA questions. The graph stays visible beside the HTML answer (above it on a phone).
- Read the source-backed relations, inspect the Cypher-style preview, pause/restart the reasoning replay, or step manually. Clicking an answer node opens its detail panel. Unknown questions stay within a clear fallback; GraphRAG is a listed skill without an invented project association.
- Choose Recruiter mode to unmount WebGL and see the full printable profile generated from the same dataset. Contact destinations remain explicit placeholders.
- Append `?debug=1` for the FPS/draw-call/DPR overlay, CPU submission/projection counters, layout state, and a 12-second active profiling button. Idle demand mode is labeled IDLE; the overlay does not re-render the graph tree. The old `?diagnostics` query is an alias.
- See `docs/performance/REPORT.md` and its raw JSON/Chrome traces for measured 390 × 844 tests with real 4× DevTools CPU throttling. Physical-phone/GPU performance remains unverified; headless Lighthouse FCP scoring was unavailable in several captures.
- To cross-check a true 390 × 844 child viewport without a temporary browser override, open `http://127.0.0.1:5173/qa/mobile-viewport.html` while dev and production preview servers are running. This QA harness is excluded from the production build. It uses desktop hardware and does not certify phone hardware performance.
- Disable JavaScript on the production preview to inspect the prerendered text. The prerender script imports only the dataset and copy helper, never the graph or renderer.

## Architecture

- `src/data/portfolio.ts`, `projectArchive.ts`, and `profileAdditions.ts`: facts, project sources, editorial copy, translation records, nodes, edges, aliases, and intent definitions. No contact, credential, or repository links have been invented.
- `src/types/portfolio.ts`: content and translation contracts.
- `src/graph/layout.ts`: seeded `d3-force-3d` simulation with authored cluster anchors. It manually converges, stops, and caches positions across graph remounts without mutating content.
- `src/graph/relations.ts`: documented connections versus navigational edges.
- `src/graph/intentMatcher.ts`: token-boundary aliases, named-work/tool constraints, documented edge selection, query previews, and finite reasoning steps. No LLM or database backend. Intent definitions/wording remain in the data file.
- `src/scenes/`: lazy WebGL chunk. Nodes are an InstancedMesh; relations and geometric ornaments use batched line segments. The central zellige glyph uses custom GLSL.
- `src/components/`: accessible HTML, Ask/replay controls, recruiter profile, and the graph loading/fallback boundary. No text is rendered inside WebGL. The Ask view repositions the existing canvas rather than remounting it.
- `src/debug/`: opt-in counters and a separate overlay leaf. `scripts/run-profile.mjs` uses Lighthouse's actual DevTools CPU throttle, saves Chrome traces, and verifies full-interval counters. A local-only preview middleware collects those QA counters; it is not part of the deployed static app.
- `src/state/`: Zustand selection and scene preferences.
- `scripts/prerender.ts`: static HTML text generated from the same dataset.
- `scripts/bundle-report.ts`: follows static imports in Vite's manifest and checks initial JavaScript against 300 KB gzip.

Main text uses locally hosted Anthropic Serif (Roman and Italic); technical labels and query previews retain IBM Plex Mono. Geometry and illustrations are procedural; no remote images, fonts, models, or portfolio runtime APIs are required. GSAP handles camera flights that yield immediately to manual input; Three.js TrackballControls handles rotation, zoom, pan, and touch gestures. Postprocessing, Drei, and Lenis are installed but are not loaded by the current graph. Floating motion uses demand invalidation while the canvas is visible, and stops when paused, off screen, or in a hidden tab. Reduced motion retains the complete text view. The original settled layout remains cached and immutable.

`node scripts/network-qa.mjs` runs the mouse and emulated-touch interaction checks against the production preview at port 4178 (override with `PORTFOLIO_QA_URL`). It verifies swimming, pause, rotation while paused, wheel zoom, pan, reset, zoom buttons, rotation across the poles, neural-link toggling, pinch zoom, and mobile overflow. It uses locally installed Windows Chrome and writes screenshots plus results to `qa/current/`. `scripts/browser-qa.mjs` covers the full portfolio and accessible content paths.

## Add a project

1. Add a `PortfolioNode` to `entries` in `src/data/portfolio.ts` with a unique ID, `kind: 'project'`, and `cluster: 'projects'`.
2. Enter only supported facts. Add metrics with their context only if supplied.
3. Reference existing skill/technology IDs in `technologies`, or add a documented technology to `technologyLabels`. Listed skills and project methods remain distinct.
4. Add aliases for future Ask matching. Add a `queryIntents` record when a new deterministic query is appropriate.
5. Run `npm run test` and `npm run build`. Graph nodes, relations, directory entries, cards, panels, and static text are generated from the dataset.

## Translation review

Every localizable value has `en`, `fr`, and `ar` records. Each record carries `text`, `provenance`, and `reviewed`.

- `provided`: directly supplied labels and copy.
- `machine-written`: generated editorial/interface copy and authored sentences describing supplied facts, with `reviewed: false`. A factual source does not imply that its new wording has been reviewed.
- `machine-translation`: reserved for generated FR/AR copy, with `reviewed: false` until Mouad reviews it.

FR/AR records are currently `null`; language switching is deferred. All translations must remain in the data file. `copy()` falls back to English for missing translations.

## Approved sequence

- **M1:** implemented and approved, followed by the requested profiling/demand-rendering fix.
- **M2:** implemented: Ask with reasoning replay and recruiter mode. Hidden terminal, cursor gravity, and shareable node URLs remain the next prioritized surprises.
- **M3:** microgrid and agent tunnel first, then metrics wall. Stop for review before Darija constellation and attention hall.
- **M4:** remaining surprises, Konami mode, idle thinking, EN/FR/AR, 404. Focus constellation has been dropped. Sound is optional and last.
- **M5:** final performance, accessibility, mobile, SEO asset polish, documentation, and deployment readiness.

## Deployment

Vercel: build command `npm run build`, output `dist`. A static SPA rewrite is included. Deployment is not performed in Milestone 1. Contact links remain explicit data placeholders until supplied. The current OG asset is SVG; a social-compatible PNG is scheduled for the final SEO pass.

## Implementation references

- [React Three Fiber Canvas](https://r3f.docs.pmnd.rs/api/canvas)
- [React Three Fiber performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [d3-force-3d](https://github.com/vasturiano/d3-force-3d)
- [Vite production builds](https://vite.dev/guide/build)
