# Product plan

## ICP and job

Initial ICP: CFOs and controllers at 10–50 location US restaurant groups using one primary distributor and processing invoices centrally. Their job: “When vendor invoices arrive, show me only defensible overcharges and give my team the evidence to recover credits without poisoning the supplier relationship.”

## MVP

The shipped vertical slice loads explicit fictional fixtures, applies a dollar threshold, calculates contract-to-billed variance, supports claim selection, and produces a clearly demo-only claim-packet state. The FastAPI operation accepts validated invoice lines and returns recoverable findings. Production MVP adds secure CSV/PDF ingestion, contract baseline confirmation, an immutable evidence packet, manual approval, follow-up status, and credit reconciliation.

## Data model

- `Account`, `Location`, `Vendor`
- `ContractTerm`: effective dates, SKU, agreed unit/pack price, source document hash
- `Invoice`, `InvoiceLine`: original source, normalized item, billed price, quantity
- `Finding`: variance, confidence, rule/version, reviewer disposition
- `Claim`: selected findings, evidence bundle, approval, supplier thread, status
- `Recovery`: cash/credit amount, receipt, contingency fee, attribution

Every normalized value retains source coordinates. Claims are append-only after submission; corrections create a new version.

## Architecture and model strategy

Browser uploads directly to encrypted object storage through short-lived URLs. A worker performs OCR and candidate mapping. Deterministic rules calculate money. Low-confidence matches enter a review queue. FastAPI exposes versioned audit/claim operations; Postgres stores lineage and states; a job queue schedules follow-ups. LLMs may draft messages and suggest mappings, but never define contract truth or send without approval. Vendor and model failures degrade to manual review.

## Economics

At the report’s illustrative 15-unit group, $9M audited annual spend × 0.35% recoverable × 25% fee yields about $7,875/year, plus a similar one-time lookback. Four groups roughly support the report’s $47K year-one scenario. Gross margin depends on analyst minutes per finding, claim acceptance, days-to-credit, and disputes. The kill condition is more than 90 human minutes per $1,000 recovered after the first three pilots.

## Validation

1. Twenty warm requests → ten controller interviews → three observed reconciliations.
2. Five free 90-day lookbacks; measure upload completion, false-positive rate, recoverable dollars, and time to packet.
3. Ask for 25% contingency authorization before pursuing anything.
4. Success: two authorizations, one collected credit, >$5 recovered per analyst minute, and <10% reviewer-rejected findings. Kill/reframe if zero authorizations after five complete reports.

## Moat

The moat is not OCR. It is verified contract-to-line lineage, supplier-specific exception knowledge, claim-response history, and proof of credit attribution. These data compound only through actual recoveries. Protect them with tenant isolation, minimal retention, and audit logs.

## Risks

False claims erode CFO and supplier trust; contracts may allow substitutions or index changes; line-item normalization can silently mismatch packs; contingency revenue is delayed; incumbents can add workflows; supplier retaliation is possible; restaurant data is commercially sensitive. Human approval, confidence thresholds, provenance, reversible drafts, and explicit “not enough evidence” outcomes are mandatory.

## Roadmap

- **0–30 days:** concierge lookbacks, contract/line schema, evidence packet, five audits, two authorizations.
- **31–60 days:** claim state machine, supplier email import, follow-up reminders, credit reconciliation, tenant security review.
- **61–90 days:** one accounting/AP integration, recovery dashboard, outcome-based mapping feedback, pilot economics review. Do not expand beyond food distributors until collected-credit proof.
