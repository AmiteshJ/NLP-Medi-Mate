import React from "react";

export default function RemedyCard({ remedies, redFlag, onDownload }) {
  if (!remedies || remedies.length === 0) return null;

  return (
    <div
      className="surface"
      style={{
        padding: "16px 18px", marginTop: 6, maxWidth: "78%",
        borderColor: redFlag ? "var(--amber)" : undefined,
        background: redFlag ? "var(--amber-bg)" : "white",
      }}
    >
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: "var(--green-dark)", marginBottom: 8, fontSize: 14.5 }}>
        MediMate's Suggestions
      </div>

      {remedies.map((r, i) => (
        <div key={r.key} style={{ padding: "8px 0", borderTop: i === 0 ? "none" : "1px solid var(--green-light)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🌿 {r.label}</div>
          <ul style={{ margin: "4px 0 8px 18px", padding: 0, fontSize: 12.5, lineHeight: 1.6 }}>
            {r.remedies.map((line) => <li key={line}>{line}</li>)}
          </ul>
          <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>💊 {r.otc}</div>
          <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.5, color: "#8A5A1B" }}>⚠️ Seek care if: {r.warning_signs}</div>
        </div>
      ))}

      {redFlag && (
        <div style={{ marginTop: 10, fontWeight: 600, fontSize: 12.5, color: "#8A3B3B" }}>
          Please seek professional medical attention rather than relying on general advice here.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <button
          onClick={onDownload}
          style={{
            border: "1px solid var(--green-dark)", background: "white", color: "var(--green-dark)",
            fontFamily: "'Fredoka', sans-serif", fontSize: 12.5, padding: "7px 14px", borderRadius: 9, cursor: "pointer",
          }}
        >
          ⬇ Download Suggestions as PDF
        </button>
      </div>
    </div>
  );
}
