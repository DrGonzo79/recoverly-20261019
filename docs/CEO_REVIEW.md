# CEO review — Recoverly

**Mode:** scope reduction. The plan touches a high-trust, relationship-heavy workflow; the correct demo is the minimum end-to-end decision path, not an autonomous “agent.”

## Nuclear challenge

The business outcome is collected supplier credit, not detected variance. A dashboard would optimize a proxy and compete directly with Craftable/MarginEdge. The chosen path—one vendor, explicit contract baseline, evidence packet, human approval—moves from spreadsheet chasing toward the 12-month ideal: recoveries with auditable lineage and supplier-specific playbooks.

Alternatives: (A) minimal concierge packet, small/medium risk, chosen; (B) integrated claim workbench, large/medium risk, next only after authorization proof; (C) autonomous recovery network, XL/very-high risk, rejected until outcome data and permission controls exist.

## Review findings and decisions

1. **Architecture:** keep monetary math deterministic and pure; isolate AI mapping/drafting. Append-only submitted claims and idempotency are production requirements.
2. **Error map:** invalid amount → inline validation; zero findings → explicit empty state; missing evidence → “needs review,” not a claim; upstream OCR/model failure → retain source and offer retry/manual path; vendor-send failure → visible queued/failed state.
3. **Security:** invoice and contract data are tenant-confidential. Production needs scoped upload URLs, malware scanning, encryption, strict tenant predicates, short retention, audit trails, and no training use by default.
4. **Data/interaction:** handle duplicate invoices, credits that predate review, pack-size changes, effective dates, taxes/freight, decimal quantities, threshold edits, double submission, slow jobs, and stale reviewers. The demo covers invalid, empty, selection, and reversible review states.
5. **Code quality:** shared fixture and small pure audit function prevent divergent demo math. Avoid premature connector abstraction.
6. **Tests:** Python covers happy, empty, invalid, and duplicate paths. Playwright covers primary workflow, validation, empty state, selection, packet generation, and mobile overflow.
7. **Observability:** production must expose dollars through the funnel, false-positive/rejection rate, time-to-first-finding, analyst minutes, claim aging, send failures, and days to verified credit.
8. **Database/state:** contract effective dates and document lineage need constraints; claim transitions are `draft → approved → submitted → acknowledged → credited|rejected|withdrawn`.
9. **API:** version audit requests, cap batch size, reject duplicates, use integer cents/decimal quantities, and return stable error codes. The prototype implements bounded validation.
10. **Performance:** batch/OCR belongs off-request. At 100× load, document processing and SKU matching—not arithmetic—dominate; backpressure by tenant.
11. **UX:** money and evidence lead the hierarchy. Fictional/demo status is persistent. Controls have focus states, mobile stacks without overflow, and every button changes state.

## Decision

**Accepted:** thresholded audit, evidence-backed findings, human selection, demo claim packet, deterministic API. **Deferred:** OCR, email sending, vendor portal automation, accounting integrations, multi-tenant persistence. **Not in scope:** autonomous claim submission, paid APIs, supplier contact, or claims that lack explicit contract evidence.
