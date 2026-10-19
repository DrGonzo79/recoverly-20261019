"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { auditInvoices, format, type Finding } from "../lib/audit";

type Stage = "setup" | "review" | "submitted";

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [threshold, setThreshold] = useState("10");
  const [stage, setStage] = useState<Stage>("setup");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const findings = useMemo(() => auditInvoices(Number(threshold) || 0), [threshold]);
  const selectedFindings = findings.filter((item) => selected.includes(item.id));
  const selectedTotal = selectedFindings.reduce((sum, item) => sum + item.varianceCents, 0);

  useEffect(() => setHydrated(true), []);

  function runAudit(event: FormEvent) {
    event.preventDefault();
    const value = Number(threshold);
    if (!Number.isFinite(value) || value < 0 || value > 5000) {
      setError("Enter a review threshold from $0 to $5,000.");
      return;
    }
    setError("");
    const next = auditInvoices(value);
    setSelected(next.map((item) => item.id));
    setStage("review");
  }

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return <main data-hydrated={hydrated}>
    <header>
      <a className="brand" href="#top" aria-label="Recoverly home"><span>R</span> Recoverly</a>
      <div className="demo-badge">Fictional demo data · no vendor contact</div>
    </header>

    <section className="hero" id="top">
      <div>
        <p className="eyebrow">RESTAURANT AP RECOVERY DESK</p>
        <h1>Find the leak.<br/><em>Finish the claim.</em></h1>
        <p className="lede">Turn distributor invoice mismatches into evidence-ready recovery packets—with a human approving every claim.</p>
      </div>
      <div className="metric-card" aria-label="Demo portfolio summary">
        <p>90-day demo lookback</p><strong>$66.00</strong><span>potential recovery across 3 findings</span>
      </div>
    </section>

    <nav className="steps" aria-label="Audit progress">
      {[["1","Set rules","setup"],["2","Review findings","review"],["3","Submit packet","submitted"]].map(([number,label,key]) =>
        <div className={stage === key ? "active" : ""} key={key}><b>{number}</b><span>{label}</span></div>
      )}
    </nav>

    {stage === "setup" && <section className="workspace setup">
      <div>
        <p className="eyebrow">DEMO INPUT</p>
        <h2>Northstar Group · 4 sample invoices</h2>
        <p>Compare each billed line with the fictional contracted unit price. Healthy lines stay quiet; recoverable variances become claims.</p>
        <div className="source-row"><span>CSV</span><div><b>october-invoices-demo.csv</b><small>4 invoices · 2 vendors · fixture bundled in repo</small></div><i>Ready</i></div>
      </div>
      <form onSubmit={runAudit} noValidate>
        <label htmlFor="threshold">Minimum claim value</label>
        <div className="money-input"><span>$</span><input id="threshold" inputMode="decimal" value={threshold} onChange={(e) => setThreshold(e.target.value)} aria-describedby="threshold-help" /></div>
        <small id="threshold-help">Ignore tiny variances below this amount.</small>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit">Run contract check <span>→</span></button>
      </form>
    </section>}

    {stage === "review" && <section className="workspace review">
      <div className="section-head"><div><p className="eyebrow">REVIEW QUEUE</p><h2>{findings.length} recoverable findings</h2></div><button className="text-button" onClick={() => setStage("setup")}>Edit rules</button></div>
      {findings.length === 0 ? <div className="empty"><b>No findings clear this threshold.</b><p>Lower the threshold or return to the bundled demo defaults.</p></div> : <div className="finding-list">
        {findings.map((finding: Finding) => <label className="finding" key={finding.id}>
          <input type="checkbox" checked={selected.includes(finding.id)} onChange={() => toggle(finding.id)} />
          <span className="check" aria-hidden="true">✓</span>
          <div><div className="finding-top"><b>{finding.item}</b><strong>{format(finding.varianceCents)}</strong></div><p>{finding.vendor} · {finding.id} · {finding.date}</p><small>{finding.evidence}</small></div>
        </label>)}
      </div>}
      <aside className="action-bar"><div><small>SELECTED RECOVERY</small><b>{format(selectedTotal)}</b><span>Fee at 25%: {format(Math.round(selectedTotal * .25))}</span></div><button disabled={!selected.length} onClick={() => setStage("submitted")}>Generate claim packet <span>→</span></button></aside>
    </section>}

    {stage === "submitted" && <section className="workspace success" aria-live="polite">
      <div className="success-mark">✓</div><p className="eyebrow">PACKET READY</p><h2>{selected.length} findings documented for {format(selectedTotal)}</h2>
      <p>Recoverly created a demo packet with invoice IDs, contract baselines, variance math, and a supplier email draft. Nothing was sent.</p>
      <div className="packet"><div><span>PDF</span><b>northstar-recovery-packet-demo.pdf</b><small>Fictional preview · {selected.length} evidence records</small></div><button onClick={() => setStage("review")}>Back to review</button></div>
    </section>}

    <section className="proof">
      <p className="eyebrow">WHY THIS WEDGE</p><h2>Dashboards flag. Recovery needs follow-through.</h2>
      <div><article><b>01</b><h3>Detect</h3><p>Match invoice lines to explicit contract baselines.</p></article><article><b>02</b><h3>Document</h3><p>Preserve exact math and source lineage for every claim.</p></article><article><b>03</b><h3>Collect</h3><p>Track supplier responses and credits instead of stopping at an alert.</p></article></div>
    </section>
    <footer><span>Recoverly prototype · October 19, 2026</span><a href="https://www.ideabrowser.com/hub/ideas/today">Source idea ↗</a></footer>
  </main>;
}
