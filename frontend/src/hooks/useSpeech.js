import { useCallback, useRef, useState } from "react";

const PREFERRED_VOICE_NAMES = [
  "Samantha", "Google UK English Female", "Microsoft Zira", "Victoria",
  "Google US English", "Karen", "Moira", "Tessa",
];

function pickVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  for (const name of PREFERRED_VOICE_NAMES) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  const femaleish = voices.find((v) => /female/i.test(v.name) && v.lang.startsWith("en"));
  if (femaleish) return femaleish;
  return voices.find((v) => v.lang.startsWith("en")) || voices[0];
}

export default function useSpeech() {
  const [enabled, setEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef(null);

  const speak = useCallback((text) => {
    if (!enabled || !text) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voiceRef.current || pickVoice();
    if (voice) utterance.voice = voice;
    utterance.pitch = 1.12;
    utterance.rate = 1.0;
    utterance.volume = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [enabled]);

  // Voices load async in some browsers -- warm the cache once.
  if (typeof window !== "undefined" && window.speechSynthesis && !voiceRef.current) {
    window.speechSynthesis.onvoiceschanged = () => {
      voiceRef.current = pickVoice();
    };
  }

  const toggle = () => {
    if (enabled) window.speechSynthesis?.cancel();
    setEnabled((e) => !e);
  };

  return { speak, enabled, toggle, speaking };
}
