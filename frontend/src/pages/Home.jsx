import React, { useState, useCallback, useRef } from "react";
import {
  Paperclip, Mic, ChevronRight, Stethoscope, Clock, Activity, Target, Tag,
  ShieldCheck, Leaf, Bed, Droplet, Snowflake, Lightbulb, Download,
  HeartPulse, CircleCheck, Brain,
} from "lucide-react";
import Chemist from "../components/Chemist.jsx";
import { analyzeText, downloadPdf } from "../services/api.js";
import { toQuip } from "../utils/quip.js";
import useSpeech from "../hooks/useSpeech.js";
import "./Home.css";

const QUICK_PROMPTS = [
  "I have a headache since yesterday",
  "My throat hurts and I have a mild fever",
  "I feel nauseous after eating",
  "I don't have a fever but my head hurts",
];

function remedyIcon(text) {
  const t = text.toLowerCase();
  if (/rest|sleep|room/.test(t)) return Bed;
  if (/water|fluid|hydrat|drink/.test(t)) return Droplet;
  if (/cold|cool|compress|ice/.test(t)) return Snowflake;
  return CircleCheck;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [chemistState, setChemistState] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUser, setLastUser] = useState(null);
  const [lastReply, setLastReply] = useState(null);
  const [pulse, setPulse] = useState(0);
  const speech = useSpeech();
  const inputRef = useRef(null);

  const handleSend = useCallback(async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    setLastUser(text);
    setChemistState("listening");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 300));
    setChemistState("thinking");

    try {
      const data = await analyzeText(text);
      const quip = toQuip(data.reply);
      setChemistState(data.analysis.red_flag ? "concerned" : "talking");
      setLastReply({
        quip,
        analysis: data.analysis,
        remedies: data.remedies,
        redFlag: data.analysis.red_flag,
        rawInput: text,
      });
      setPulse((p) => p + 1);
      speech.speak(quip);
    } catch (err) {
      setError("Can't reach the backend — is Flask running on :5000?");
      setChemistState("concerned");
    } finally {
      setLoading(false);
      setTimeout(() => setChemistState((s) => (s === "concerned" ? s : "idle")), 2800);
    }
  }, [input, loading, speech]);

  const handleDownload = () => {
    if (!lastReply) return;
    downloadPdf({ text: lastReply.rawInput, analysis: lastReply.analysis, remedies: lastReply.remedies }).catch(() =>
      setError("Couldn't generate the PDF — check the backend is running.")
    );
  };

  const statusLabel =
    chemistState === "thinking" ? "thinking…" :
    chemistState === "listening" ? "listening…" :
    chemistState === "talking" ? "here's what I think" :
    chemistState === "concerned" ? "this needs attention" : "ready when you are";

  return (
    <div className="bento-page">
      <div className="bento-grid">
        {/* ---------- Chemist tile ---------- */}
        <div className="tile tile-chemist">
          <div />
          <div className="chemist-tile-top">
            <Chemist state={chemistState} size={130} pulse={pulse} />
            <div className="chemist-name">I'm Medi<span>Mate</span></div>
            <div className="chemist-status">{statusLabel}</div>
            <HeartPulse size={18} className="chemist-heart" />
            <div className={`chemist-caption ${lastReply?.redFlag ? "flag" : ""}`}>
              {lastReply ? lastReply.quip : "Hey — tell me what's bothering you."}
            </div>
          </div>
          <button
            className={`voice-toggle ${speech.speaking ? "speaking" : ""}`}
            onClick={speech.toggle}
            title={speech.enabled ? "Mute chemist's voice" : "Unmute chemist's voice"}
          >
            <Mic size={14} />
            {speech.enabled ? "Voice on" : "Voice off"}
            <span className="bars"><span /><span /><span /><span /></span>
          </button>
        </div>

        {/* ---------- Input tile ---------- */}
        <div className="tile tile-input">
          <div className="tile-title"><span className="dot" />Talk to MediMate</div>

          <div className="mini-exchange">
            {!lastUser && !lastReply && (
              <div className="mini-empty">Try a quick prompt below, or type your own — the chemist keeps it short and to the point.</div>
            )}
            {lastUser && <div className="mini-line user">{lastUser}</div>}
            {lastReply && (
              <div className={`mini-line chemist ${lastReply.redFlag ? "flag" : ""}`}>{lastReply.quip}</div>
            )}
          </div>

          <div className="glass-input-row">
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Type your symptoms here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button className="icon-btn" title="Attach"><Paperclip size={16} /></button>
            <button
              className="icon-btn"
              title="Voice input"
              onClick={() => {
                const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!SR) { alert("Voice input isn't supported in this browser."); return; }
                const rec = new SR();
                rec.lang = "en-US";
                rec.onresult = (e) => setInput(e.results[0][0].transcript);
                rec.start();
              }}
            >
              <Mic size={16} />
            </button>
            <button className="send-pill" onClick={() => handleSend()} disabled={loading}>
              Send <ChevronRight size={15} />
            </button>
          </div>

          <div className="quick-chips">
            {QUICK_PROMPTS.map((p) => (
              <button key={p} className="quick-chip" onClick={() => handleSend(p)} disabled={loading}>{p}</button>
            ))}
          </div>

          {error && <div className="error-banner">{error}</div>}
        </div>

        {/* ---------- Analysis tile ---------- */}
        <div className="tile tile-analysis">
          <div className="tile-title"><span className="dot" />How MediMate understood you</div>
          <Brain size={100} className="analysis-decoration" strokeWidth={1} />
          {!lastReply ? (
            <div className="a-empty">No analysis yet — send a message.</div>
          ) : (
            <div className="analysis-scroll">
              <div className="a-row">
                <span className="a-label"><Stethoscope size={14} />Symptoms</span>
                {lastReply.analysis.symptoms.length
                  ? lastReply.analysis.symptoms.map((s) => (
                      <span key={s.key} className={`a-chip ${s.negated ? "negated" : ""}`}>{s.negated ? "✕ " : ""}{s.label}</span>
                    ))
                  : <span className="a-chip" style={{ opacity: 0.5 }}>none</span>}
              </div>
              <div className="a-row">
                <span className="a-label"><Clock size={14} />Duration</span>
                <span className="a-chip">{lastReply.analysis.duration || "—"}</span>
              </div>
              <div className="a-row">
                <span className="a-label"><Activity size={14} />Severity</span>
                <span className="a-chip">{lastReply.analysis.severity || "—"}</span>
              </div>
              <div className="a-row">
                <span className="a-label"><Target size={14} />Intent</span>
                <span className="a-chip intent">{lastReply.analysis.intent.replace(/_/g, " ")}</span>
              </div>
              <div className="a-row">
                <span className="a-label"><Tag size={14} />Keywords</span>
                {lastReply.analysis.keywords.map((k) => <span key={k} className="a-chip">{k}</span>)}
              </div>
              <div className="a-row">
                <span className="a-label"><ShieldCheck size={14} />Confidence</span>
                <div className="confidence-track"><div className="confidence-fill" style={{ width: `${lastReply.analysis.confidence}%` }} /></div>
                <span style={{ fontSize: 11.5 }}>{lastReply.analysis.confidence}%</span>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Remedy tile ---------- */}
        <div className={`tile tile-remedy ${lastReply?.redFlag ? "flagged" : ""}`}>
          <div className="tile-title"><span className="dot" />Suggestions</div>
          <div className="remedy-badge"><Leaf size={16} /></div>
          {!lastReply || lastReply.remedies.length === 0 ? (
            <div className="remedy-empty">Remedies will show up here once MediMate understands your symptoms.</div>
          ) : (
            <>
              <div className="remedy-scroll">
                {lastReply.remedies.map((r) => (
                  <div key={r.key}>
                    <div className="remedy-symptom-title"><Leaf size={16} />{r.label}</div>
                    {r.remedies.slice(0, 3).map((line) => {
                      const Icon = remedyIcon(line);
                      return (
                        <div key={line} className="remedy-row">
                          <Icon size={15} />{line}
                        </div>
                      );
                    })}
                    <div className="remedy-otc-box">
                      <Lightbulb size={15} />
                      {r.otc}
                    </div>
                  </div>
                ))}
                {lastReply.redFlag && (
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#F0C892", marginTop: 10 }}>
                    Please see a doctor — don't rely on general advice for this one.
                  </div>
                )}
              </div>
              <button className="pdf-btn" onClick={handleDownload}>
                <Download size={16} />Download as PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
