from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


def line(**overrides):
    value = {"invoice_id": "INV-1", "vendor": "Demo Foods", "item": "Chicken", "contract_unit_cents": 380, "billed_unit_cents": 418, "quantity": 40}
    value.update(overrides)
    return value


def test_audit_returns_only_recoverable_variances():
    response = client.post("/audit", json={"lines": [line(), line(invoice_id="INV-2", item="Oil", contract_unit_cents=100, billed_unit_cents=100)], "minimum_claim_cents": 1000})
    assert response.status_code == 200
    assert response.json() == {"findings": [{"invoice_id": "INV-1", "vendor": "Demo Foods", "item": "Chicken", "variance_cents": 1520, "status": "recoverable"}], "total_recoverable_cents": 1520, "reviewed_lines": 2}


def test_threshold_can_return_empty_result():
    response = client.post("/audit", json={"lines": [line()], "minimum_claim_cents": 2000})
    assert response.status_code == 200
    assert response.json()["findings"] == []


def test_invalid_and_duplicate_lines_are_rejected():
    assert client.post("/audit", json={"lines": []}).status_code == 422
    assert client.post("/audit", json={"lines": [line(quantity=0)]}).status_code == 422
    assert client.post("/audit", json={"lines": [line(), line()]}).status_code == 422


def test_health():
    assert client.get("/health").json() == {"status": "ok"}
