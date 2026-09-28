# Gestoria

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

INEMA method, training plan, and web lab for AI Management. The unit of work is **a business process with a measurable outcome**.

**[Open tool](https://inematds.github.io/gestoria/)** · **[User guide](https://inematds.github.io/gestoria/guia/en/)** · **[Course plan](https://inematds.github.io/curso-gestao-ia/)**

## Open the tool

Requires Node.js 22.12+ or 24+ and npm.

```bash
npm install
npm run dev
```

Open the address provided by Vite (usually `http://localhost:5173`). To generate the static files:

```bash
npm run build
npm run preview
```

The `dist/` directory contains the production output. `npm run build` generates the version for a domain root. `npm run build:pages` configures the `/gestoria/` base path and includes the guide and cover. The `.github/workflows/pages.yml` workflow publishes this package to GitHub Pages on every push to `main`.

## Documents

- [Course plan](docs/PLANO-CURSO.md): 10 modules, 60 proposed hours, lessons, labs, deliverables, and final project.
- [Method](docs/METODO.md): contracts, digital roles, autonomy, metrics, and LOOP-R.
- [Product plan](docs/PLANO-PRODUTO.md): scope, architecture, data, phases, and evolution criteria.
- [Templates](docs/TEMPLATES.md): templates for applying the method to an operation.

The four documents can also be downloaded from the **Method and course** screen.

## Usage guide

1. Open **Processes** and review the sales qualification example or create a process.
2. Under **Workforce**, create a role and specify its owner, scope, and initial autonomy.
3. In **Overview**, select the process and simulate a normal, uncertain, or out-of-policy case.
4. Open **Human decisions**, review the output, and record an approval or return with a reason.
5. Under **Evaluations**, record distinct cases with the expected result, produced result, and human classification.
6. Open the agent profile to review the promotion criteria. Approval promotes the agent one level and creates a new version; historical evaluations remain visible.
7. Under **Continuous improvement**, record a hypothesis and advance the experiment with evidence.
8. Under **Lab data**, export your work as JSON. Importing and restoring replace the current workspace after confirmation.

## Limits of this version

This is a **local management MVP with an educational simulator**, with no backend or model calls. It does not connect to CRM, ERP, email, or MCP. Tools, model, Skills, and knowledge listed in the profile are planned descriptions, not active integrations.

The initial examples are fictional. Each new simulation uses R$ 0.38 and 42 seconds as educational values, with no charge. Metrics are calculated over the lab's accumulated data: autonomy uses only completed cases; cost includes pending/returned attempts; evaluations use only current versions. The accuracy metric is not equivalent to production validation.

Data is stored in this browser's `localStorage` for this origin (`gestoria.workspace.v1`). There is no authenticated identity, company-level isolation, automatic backup, real authorization, or immutable audit trail. The local history retains up to 300 events. Do not enter secrets or sensitive information. Exports can be edited; production rules must be enforced on the server.

An import is validated for version, types, limits, IDs, and relationships; unknown fields are discarded. Files are limited to 5 MB. Invalid local data is preserved and blocks writes until recovery/import/restoration. If another tab changes the data, open forms are closed to prevent overwriting.

The course is planned; full lessons, videos, workbook pages, and a reviewed dataset of 100 cases have not yet been produced. The roadmap describes the transition from this lab to a real operation.

## Verification

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Domain tests verify metrics, budget, autonomy, review, promotion, and import. Browser tests cover the flow from registration through evaluation, persistence, LOOP-R, import, HTML content treated as text, invalid data recovery, downloads, and desktop/mobile layouts. Screenshots are saved in `artifacts/`.

## Structure

```text
docs/               method, course plan, product plan, and templates
src/domain.ts       management rules and copy validation
src/seed.ts         initial fictional examples
src/main.ts         screens, forms, and local persistence
src/style.css       responsive interface
tests/              domain and browser tests
