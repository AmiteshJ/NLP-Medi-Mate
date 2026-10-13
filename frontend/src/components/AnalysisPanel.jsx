import React, { useState } from "react";

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "4px 0", alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ width: 120, flexShrink: 0, color: "rgba(38,53,45,0.55)" }}>{label}</span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>{children}</div>
    </div>
  );
}

const chip = (extra = {}) => ({
  background: "var(--green-light)",
  color: "var(--green-dark)",
  padding: "2px 8px",
  borderRadius: 6,
  fontSize: 11,
  ...extra,
});

export default function AnalysisPanel({ analysis }) {
  const [open, setOpen] = useState(false);
  if (!analysis) return null;

  return (
    <div style={{ marginTop: 6, maxWidth: "78%" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 7, background: "none", border: "none",
          cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5,
          color: "var(--green-dark)", padding: "4px 2px",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
        How MediMate understood you
        <span style={{ fontSize: 9, opacity: 0.6 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, background: "#fff",
            border: "1px solid var(--green-light)", borderRadius: 10, padding: "12px 14px", marginTop: 4,
          }}
        >
          <Row label="Symptoms">
            {analysis.symptoms.length
              ? analysis.symptoms.map((s) => (
                  <span
                    key={s.key}
                    style={s.negated ? chip({ background: "#F3E3E3", color: "#8A3B3B", textDecoration: "line-through" }) : chip()}
                  >
                    {s.negated ? "✕ " : "• "}{s.label}
                  </span>
                ))
              : <span style={{ color: "rgba(38,53,45,0.4)", fontStyle: "italic" }}>none detected</span>}
          </Row>
          <Row label="Duration">
            {analysis.duration ? <span style={chip()}>{analysis.duration}</span> : <span style={{ color: "rgba(38,53,45,0.4)", fontStyle: "italic" }}>not mentioned</span>}
          </Row>
          <Row label="Severity">
            {analysis.severity ? <span style={chip()}>{analysis.severity}</span> : <span style={{ color: "rgba(38,53,45,0.4)", fontStyle: "italic" }}>not mentioned</span>}
          </Row>
          <Row label="Detected intent">
            <span style={chip({ background: "var(--green-dark)", color: "white" })}>{analysis.intent.replace(/_/g, " ")}</span>
          </Row>
          <Row label="Keywords">
            {analysis.keywords.map((k) => <span key={k} style={chip({ background: "var(--bg)", border: "1px solid var(--green-light)" })}>{k}</span>)}
          </Row>
          <Row label="Confidence">
            <div style={{ width: 90, height: 5, background: "var(--green-light)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${analysis.confidence}%`, background: "var(--green)" }} />
            </div>
            <span>{analysis.confidence}%</span>
          </Row>
        </div>
      )}
    </div>
  );
}
