import React, { useEffect, useState } from "react";
import { fetchHistory } from "../services/api.js";

export default function History() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory()
      .then((data) => setItems(data.consultations))
      .catch(() => setError("Couldn't reach the MediMate backend. Is the Flask server running on :5000?"));
  }, []);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 50, maxWidth: 680 }}>
      <h1 style={{ fontFamily: "'Fredoka', sans-serif", color: "var(--text)", fontSize: 24, marginBottom: 4 }}>
        Consultation History
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--text-dim)", marginBottom: 20 }}>
        Every message you send on Home is saved locally in MediMate's SQLite database — no login required.
      </p>

      {error && (
        <div style={{ fontSize: 12.5, color: "#F0C892", background: "var(--amber-bg)", padding: "8px 12px", borderRadius: 9, border: "1px solid rgba(224,164,88,0.3)" }}>
          {error}
        </div>
      )}

      {items && items.length === 0 && (
        <div style={{ fontSize: 13.5, color: "var(--text-faint)", fontStyle: "italic" }}>
          Nothing here yet — head to Home and tell the chemist what's bothering you.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items?.map((item) => (
          <div key={item.id} className="surface" style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "var(--text-faint)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
              {new Date(item.created_at).toLocaleString()}
            </div>
            <div style={{ fontSize: 14, marginBottom: 8, color: "var(--text)" }}>{item.user_input}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {item.symptoms.map((s) => (
                <span key={s} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--text)", padding: "2px 8px", borderRadius: 6, fontSize: 11 }}>
                  {s}
                </span>
              ))}
              <span style={{ background: "linear-gradient(135deg, var(--green-bright), var(--green))", color: "#06210F", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                {item.intent?.replace(/_/g, " ")}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.5 }}>{item.reply}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
