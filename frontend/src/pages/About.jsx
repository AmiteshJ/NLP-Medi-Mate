import React from "react";
import Chemist from "../components/Chemist.jsx";

const PIPELINE_STEPS = [
  "Raw User Input", "NLP Preprocessing", "Symptom Extraction", "Negation Detection",
  "Context Understanding (duration, severity)", "Intent Classification",
  "Knowledge Base Retrieval", "Groq AI", "Personalized Response",
];

export default function About() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 50, maxWidth: 680 }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
        <Chemist state="idle" size={90} />
        <div>
          <h1 style={{ fontFamily: "'Fredoka', sans-serif", color: "var(--text)", fontSize: 24, margin: 0 }}>
            About MediMate
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--text-dim)", margin: "4px 0 0" }}>
            An NLP-based intelligent symptom analysis and remedy recommendation system.
          </p>
        </div>
      </div>

      <div className="surface" style={{ padding: 20, marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "var(--text)", marginTop: 0 }}>
          How MediMate Works
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "var(--text-dim)" }}>
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border)", color: "var(--glow-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, flexShrink: 0 }}>
                {i + 1}
              </span>
              {step}
              {i < PIPELINE_STEPS.length - 1 && <span style={{ color: "var(--glow-soft)", marginLeft: "auto" }}>↓</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="surface" style={{ padding: 20, marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "var(--text)", marginTop: 0 }}>
          Not Just a Chatbot
        </h2>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-dim)" }}>
          Unlike a simple chatbot that hands your raw sentence straight to a language model, MediMate first runs
          it through a dedicated NLP pipeline — tokenization, lemmatization, symptom and entity extraction,
          negation detection, and intent classification — before anything is sent onward. Only that structured
          result, plus a matching entry from a small curated knowledge base, is passed to the Groq API to produce
          the final conversational reply. You can watch this happen step-by-step on the{" "}
          <a href="/analysis" style={{ color: "var(--glow-soft)" }}>NLP Pipeline</a> page.
        </p>
      </div>

      <div className="surface" style={{ padding: 20 }}>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 16, color: "var(--text)", marginTop: 0 }}>
          Disclaimer
        </h2>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-faint)" }}>
          MediMate is an academic NLP mini-project. It provides general health information only and is not a
          substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
}
