import React, { useState } from "react";

export default function MicButton({ onTranscript }) {
  const [listening, setListening] = useState(false);

  const handleClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser — try typing instead.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => onTranscript(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <button
      onClick={handleClick}
      title="Voice input"
      style={{
        width: 38, height: 38, border: "none", borderRadius: 10, cursor: "pointer",
        background: listening ? "var(--amber-bg)" : "var(--green-light)", fontSize: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: listening ? "pulse 1s infinite" : "none",
      }}
    >
      🎤
    </button>
  );
}
