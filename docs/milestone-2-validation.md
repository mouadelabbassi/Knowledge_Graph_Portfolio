# Milestone 2 review

Milestone 2 and the preceding performance fix are implemented. No Milestone 3 set pieces, terminal, gravity interaction, node URL sharing, i18n switch, sound, or later surprises have been added.

## Delivered behavior

- Header Ask opens a focused HTML explorer beside the existing canvas, stacked beneath a compact graph on a phone. The canvas is repositioned rather than recreated. Answers are brought into view automatically.
- Local matching uses typed aliases, token boundaries, documented relations, and employer/project/tool constraints. Canonical questions cover RL, RAG, extraction, and agentic QA. Named nodes and skills also resolve from the same dataset. Unknown or unsupported associations receive a fallback.
- Ask shows matched terms, source-backed answer text, linked nodes, a Cypher-style query preview, and a finite reasoning replay. Visitors can pause, continue, restart, or step manually. Reduced-motion users get manual steps and the existing 2D scene fallback.
- Query results dim unrelated nodes and highlight actual relation paths. A shader signal and packet follow those paths during replay. Camera movement stays imperative; labels are projected only when needed. Compact-map labels avoid overlapping controls, and hidden labels are not updated.
- Recruiter mode unmounts WebGL and renders the same supplied profile, experience, projects, skills, education, certifications, and languages as scannable HTML. Print CSS is included. Contact fields remain explicit placeholders; no contact URL has been invented.
- All new portfolio wording and alias definitions remain in src/data/portfolio.ts. Authored English copy is flagged machine-written / reviewed:false. FR/AR translations remain deferred/null.

## Verification

- Strict TypeScript: passed.
- Thirteen focused tests: passed across data/graph integrity, convergence/cache behavior, token-boundary matching, named-work/tool constraints, unsupported GraphRAG/Neo4j associations, documented edge selection, finite replay, and cancellation when switching to CV.
- Production build: passed. Initial JS is approximately 82.2 KiB gzip, below the 300 KiB budget; the lazy scene is separate.
- Browser at 390 × 844: no horizontal overflow in Ask or CV mode. The graph and answer occupy separate regions. Recruiter mode had zero canvases and five full work entries plus education, certifications, skills, languages, and contact placeholders.
- Live UI: RL returns Microgrid EMS/PPO/Gymnasium; RAG returns ENSA internship/ChromaDB/Darija/LangChain; Leyton RAG returns no documented match. Pause and Next change the replay as expected. Opening the microgrid from an answer opens its HTML detail panel; Escape closes it and restores focus to the source button.
- Print styling is present; no physical print/PDF export or physical-phone test is claimed.

## Performance fix and trace evidence

See performance/REPORT.md, summary.json, and the per-run raw Chrome traces. The 390 × 844 run with actual 4× DevTools CPU throttling reached 59.96 render FPS for the fixed simple graph and 53.14 render FPS for the full RAG/replay workload. Both returned to zero rendered frames and zero label writes in the measured two-second idle interval. The replay peaked at six draw calls.

The original ~17 FPS sample was not reproduced as a sustained rendering limit. The report distinguishes its cumulative mixed-cadence reading from controlled active intervals. It documents the confirmed waste (continuous drawing, redundant label styles, repeated startup layout creation), DPR, React counts, stopped simulation, and absence of postprocessing. Headless FCP scoring failed in several captures; complete runtime intervals and actual CPU throttle settings were captured, and no Lighthouse score or physical-phone performance pass is claimed.

## Review

Run npm run dev, or npm run build followed by npm run preview. Choose Ask, select a suggested question, inspect the query, step through its relations, and open an answer node. Choose Recruiter mode to review the complete HTML profile. Add ?debug=1 for the developer-only counters and active profiling control.

Next work after review: the remaining prioritized terminal/gravity/node-URL surprises and the approved microgrid/agent-tunnel/metrics-wall sequence. Darija constellation and attention hall remain gated on review of the earlier set pieces. Sound stays optional and last; Focus constellation remains dropped.
