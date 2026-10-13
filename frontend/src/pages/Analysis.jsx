import React, { useState } from "react";
import { analyzeText } from "../services/api.js";

const STAGES = [
  { key: "raw", label: "Raw Text" },
  { key: "tokens", label: "Tokens" },
  { key: "lemmas", label: "Lemmatization" },
  { key: "symptoms", label: "Symptom Extraction" },
  { key: "negation", label: "Negation Check" },
  { key: "duration", label: "Duration" },
  { key: "severity", label: "Severity" },
  { key: "intent", label: "Intent" },
  { key: "recommendation", label: "Recommendation" },
];

export default function Analysis() {
  const [text, setText] = useState("I've been having a bad headache since yesterday and I don't have a fever.");
  const [result, setResult] = useState(null);
  const [visibleStage, setVisibleStage] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runPipeline = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setVisibleStage(-1);
    try {
      const data = await analyzeText(text);
      setResult(data);
      STAGES.forEach((_, i) => {
        setTimeout(() => setVisibleStage(i), i * 260);
      });
    } catch (err) {
      setError("Couldn't reach the MediMate backend. Is the Flask server running on :5000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 50, maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Fredoka', sans-serif", color: "var(--text)", fontSize: 24, marginBottom: 4 }}>
        NLP Pipeline Visualizer
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.6 }}>
        Type a sentence and watch it move stage-by-stage through MediMate's pipeline — useful for demonstrating the
        NLP contribution during a presentation or viva.
      </p>

      <div className="surface" style={{ padding: 14, display: "flex", gap: 8 }}>
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, border: "none", outline: "none", resize: "none", fontSize: 14, fontFamily: "inherit", background: "transparent", color: "var(--text)" }}
        />
        <button
          onClick={runPipeline}
          disabled={loading}
          style={{
            alignSelf: "flex-end", background: "linear-gradient(135deg, var(--green-bright), var(--green))", color: "#06210F", border: "none",
            borderRadius: 9, padding: "9px 16px", fontFamily: "'Fredoka', sans-serif", fontSize: 13.5, fontWeight: 600,
            cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Running…" : "Run Pipeline"}
        </button>
      </div>

      {error && (
        <div style={{ fontSize: 12.5, color: "#F0C892", background: "var(--amber-bg)", padding: "8px 12px", borderRadius: 9, marginTop: 12, border: "1px solid rgba(224,164,88,0.3)" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {STAGES.map((stage, i) => (
            <div
              key={stage.key}
              className="surface"
              style={{
                padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "var(--text)",
                opacity: visibleStage >= i ? 1 : 0, transform: visibleStage >= i ? "translateX(0)" : "translateX(-8px)",
                transition: "opacity 320ms ease, transform 320ms ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, var(--green-bright), var(--green))", color: "#06210F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: "var(--text)" }}>{stage.label}</span>
              </div>
              <StageBody stage={stage.key} result={result} text={text} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StageBody({ stage, result, text }) {
  const a = result.analysis;
  switch (stage) {
    case "raw":
      return <div>"{text}"</div>;
    case "tokens":
      return <ChipRow items={a.pipeline_trace.tokens} />;
    case "lemmas":
      return <ChipRow items={a.pipeline_trace.lemmas} />;
    case "symptoms":
      return a.symptoms.length
        ? <ChipRow items={a.symptoms.map((s) => s.label)} />
        : <Muted>no symptoms matched</Muted>;
    case "negation":
      return a.symptoms.some((s) => s.negated)
        ? <ChipRow items={a.symptoms.filter((s) => s.negated).map((s) => `✕ ${s.label}`)} negated />
        : <Muted>no negation detected</Muted>;
    case "duration":
      return a.duration ? <ChipRow items={[a.duration]} /> : <Muted>not mentioned</Muted>;
    case "severity":
      return a.severity ? <ChipRow items={[a.severity]} /> : <Muted>not mentioned</Muted>;
    case "intent":
      return <ChipRow items={[a.intent.replace(/_/g, " ")]} highlight />;
    case "recommendation":
      return result.remedies.length
        ? <div>{result.remedies.map((r) => r.label).join(", ")} — see remedies on Home</div>
        : <Muted>no knowledge-base match</Muted>;
    default:
      return null;
  }
}

function ChipRow({ items, negated, highlight }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span
          key={item + i}
          style={{
            background: negated ? "rgba(224,100,100,0.12)" : highlight ? "linear-gradient(135deg, var(--green-bright), var(--green))" : "rgba(255,255,255,0.06)",
            color: negated ? "#E89494" : highlight ? "#06210F" : "var(--text)",
            border: negated ? "1px solid rgba(224,100,100,0.3)" : highlight ? "none" : "1px solid var(--border)",
            padding: "2px 8px", borderRadius: 6, fontSize: 11.5, fontWeight: highlight ? 600 : 400,
            textDecoration: negated ? "line-through" : "none",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Muted({ children }) {
  return <span style={{ color: "var(--text-faint)", fontStyle: "italic" }}>{children}</span>;
}
