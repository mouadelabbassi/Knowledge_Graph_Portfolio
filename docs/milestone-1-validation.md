# Milestone 1 review

Implemented only Milestone 1. No Ask UI, recruiter mode, terminal, cursor gravity, node URL sharing, interactive project set pieces, language switching, or sound has been added. Prepared intent records exist only as data for the next milestone.

## Functionality

- Five graph clusters, one central person, and 43 content/skill/method nodes: **49 nodes** in total.
- Authored cluster anchors with a seeded, one-time d3-force-3d layout. Nodes use one InstancedMesh; relations and ornamental geometry use batched line segments.
- Node selection animates camera position and aim with an interruptible GSAP timeline.
- Cluster panels list their members. Entry panels show supplied facts, metrics with context, technical tags, and documented relationships.
- Listed skills are distinguished from project-specific tools. No Neo4j or GraphRAG use has been attributed to Leyton.
- Native HTML dialogs receive keyboard focus, contain it while open, close with Escape, and restore focus to the initiating control. Confirmed for graph selection and keyboard-only directory selection.
- Text view unmounts the canvas, expands the directory, and retains every content node. Confirmed zero canvases, 43 directory member buttons, five cluster actions, and the central person action. Keyboard Enter on PPO opened the documented microgrid connection.
- Reduced motion and unavailable WebGL route to the same complete text path. Text mode was exercised in-browser; OS-level reduced-motion and actual unavailable-WebGL devices have not been separately tested.

## Phone-sized viewport

Tested **390 × 844** through browser viewport emulation and a fixed-size iframe containing the production app. This is desktop Chrome using an Intel Iris Xe GPU, not a physical phone or phone CPU/GPU emulation.

- No horizontal overflow in the viewport emulation check.
- All five cluster labels fit within the graph viewport.
- Graph label targets are at least 44 px high.
- Mobile panels are bottom sheets; the title receives focus and their content scrolls independently.
- Project cards and other HTML content stack into one column.

## Performance evidence and limits

Host: Windows, Intel Core i5-1135G7, Intel Iris Xe. Production build. Graph baseline: **4 draw calls**, **394 triangles**, DPR **1** in the phone-sized viewport.

The first fixed 390 × 844 frame reading was **59.95 FPS**. A later saved sample averaged **17.05 FPS** over 42.52 seconds / 725 rendered frames, while the independent browser frame counter was running at **1.96 FPS** at the time of capture. CPU render submission for that capture was **0.10 ms**, which is CPU submission time, not GPU timing. Browser animation-frame cadence varied substantially during automation, so these readings do **not** establish a dependable device-performance pass. The raw later sample is in `phone-viewport-measurement.json`.

A separate desktop reading was approximately 60 FPS at 1536 × 730. The diagnostic probe now resets its warm-up and cumulative counters whenever viewport dimensions or DPR change, preventing mixed-size averages. It counts actual rendered frames after a two-second warm-up and publishes viewport dimensions with the result.

The 30+ FPS phone hardware target remains **unverified**. Repeat foreground-browser and physical-phone measurements during the performance milestone. This report does not equate a desktop-sized frame with a phone benchmark.

## Build and content checks

- Strict TypeScript check: passed.
- Six focused tests: passed. Coverage includes dangling graph references, unique IDs, skill completeness, unsupported technology claims, deterministic finite layout, translation provenance, and Unicode preservation.
- Production build: passed. The bundle budget script fails the build at 300 KiB of initial gzipped JS.
- Initial JavaScript: approximately **76.6 KiB gzip**. Lazy WebGL chunk: approximately **274.5 KiB gzip**. Exact sizes are in `bundle-report.json`; fonts and CSS are separate.
- Static HTML contains all eight experience/project/certification/education entries, all 24 listed skills, and profile/language facts. No canvas or scene is prerendered.
- SEO metadata and the provisional SVG OG asset are generated from the dataset. A social-compatible PNG remains scheduled for the final SEO pass.
- Baseline text colors on the primary background exceed 4.5:1 contrast; the quietest text token measured 6.50:1. This is a token check, not a complete accessibility audit.
- Generated English wording is individually marked `machine-written` / `reviewed: false`; directly supplied labels are marked `provided`. French and Arabic records remain null until the translation milestone.

## Review and next improvement

Run `npm run dev` for editing, or `npm run build` followed by `npm run preview` for production review. Select a cluster, follow a project-to-skill connection, press Escape, and try Text view. Resize to a phone viewport and review the responsive panels and cards.

Next planned work after approval: local Ask matching with reasoning replay and recruiter mode, followed by the prioritized terminal, cursor gravity, and shareable node URLs. The unstable automated frame cadence is documented for a dependable performance rerun. No Milestone 2 work has begun.
