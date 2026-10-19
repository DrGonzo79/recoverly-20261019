# Architecture

```text
Fixture / future upload
        │
        ▼
validate → normalize → contract match → deterministic variance
   │          │              │                    │
  422      review queue   missing baseline     finding / no finding
                                                │
                                                ▼
                                      human selection + approval
                                                │
                                                ▼
                                      versioned claim packet
```

The Pages demo runs the calculation locally from shared JSON fixtures. The Python service separately proves the domain operation and validation contract; it is not deployed. In production, object storage holds source documents, Postgres holds normalized records and lineage, a queue isolates OCR/mapping and follow-up jobs, and FastAPI owns state transitions. Tenant authorization must be enforced before every document or claim access. Metrics: ingestion failures, mapping confidence, reviewer rejection rate, dollars identified/authorized/recovered, analyst minutes, and days to credit.

Failure policy: empty uploads and invalid amounts return named validation errors; missing contract evidence creates a review item, never a guessed baseline; OCR/model outages preserve the source and show retry/manual-entry options; duplicate invoice-item keys are rejected; submission is idempotent; supplier delivery failures remain visible and retryable.
