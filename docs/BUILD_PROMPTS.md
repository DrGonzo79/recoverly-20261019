# Phased build prompts

1. **Secure ingestion:** “Add tenant-scoped CSV/PDF uploads with malware scanning, document hashes, explicit retention, and integration tests for corrupt, duplicate, oversized, and cross-tenant access.”
2. **Evidence lineage:** “Model contract effective dates and source coordinates. Require every normalized value and finding to link to exact contract/invoice evidence. Route uncertain mappings to human review.”
3. **Claim workflow:** “Implement the versioned claim state machine with idempotent approval/submission, append-only audit events, named delivery failures, retry controls, and no autonomous send.”
4. **Recovery proof:** “Ingest supplier replies and credits, require human attribution, calculate contingency only on verified recovery, and instrument the complete dollar funnel and analyst time.”
5. **Learning loop:** “Use accepted/rejected mappings and supplier outcomes to rank suggestions without replacing deterministic money math or explicit contract truth.”
