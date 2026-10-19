# Recoverly

A runnable prototype for restaurant AP recovery: detect contract-to-invoice variances, choose defensible findings, and generate a demo claim packet. All bundled records are fictional. The deployed GitHub Pages frontend is a static simulation; the tested FastAPI backend is source-only and not hosted.

## Run

```bash
npm ci
npm run dev
```

Backend and tests:

```bash
uv sync --project api --locked
uv run --project api uvicorn api.main:app --reload
uv run --project api pytest api/tests
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
```

The frontend audit is local and deterministic. POST `/audit` accepts integer cents and positive decimal quantities and returns evidence candidates. See [product plan](docs/PRODUCT.md), [architecture](docs/ARCHITECTURE.md), [source notes](research/notes.md), and the [IdeaBrowser report](https://www.ideabrowser.com/hub/ideas/today).
