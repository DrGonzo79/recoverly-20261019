from decimal import Decimal, ROUND_HALF_UP
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field, model_validator

app = FastAPI(title="Recoverly audit API", version="0.1.0")


class InvoiceLine(BaseModel):
    invoice_id: str = Field(min_length=1, max_length=80)
    vendor: str = Field(min_length=1, max_length=120)
    item: str = Field(min_length=1, max_length=160)
    contract_unit_cents: int = Field(ge=0, le=10_000_000)
    billed_unit_cents: int = Field(ge=0, le=10_000_000)
    quantity: Decimal = Field(gt=0, le=100_000)


class AuditRequest(BaseModel):
    lines: list[InvoiceLine] = Field(min_length=1, max_length=5_000)
    minimum_claim_cents: int = Field(default=0, ge=0, le=100_000_000)

    @model_validator(mode="after")
    def reject_duplicate_invoice_items(self):
        keys = [(line.invoice_id, line.item) for line in self.lines]
        if len(keys) != len(set(keys)):
            raise ValueError("duplicate invoice and item pairs are not allowed")
        return self


class Finding(BaseModel):
    invoice_id: str
    vendor: str
    item: str
    variance_cents: int
    status: Literal["recoverable"] = "recoverable"


class AuditResponse(BaseModel):
    findings: list[Finding]
    total_recoverable_cents: int
    reviewed_lines: int


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/audit", response_model=AuditResponse)
def audit(payload: AuditRequest):
    findings: list[Finding] = []
    for line in payload.lines:
        variance = (Decimal(line.billed_unit_cents - line.contract_unit_cents) * line.quantity).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        variance_cents = int(variance)
        if variance_cents > 0 and variance_cents >= payload.minimum_claim_cents:
            findings.append(Finding(invoice_id=line.invoice_id, vendor=line.vendor, item=line.item, variance_cents=variance_cents))
    return AuditResponse(findings=findings, total_recoverable_cents=sum(item.variance_cents for item in findings), reviewed_lines=len(payload.lines))
