import React from "react";
import "../animations/chemist.css";

/**
 * Circular portrait avatar -- the persistent visual anchor. Communicates via
 * expression (eyebrows, eyes, mouth) inside a glowing glass-ring frame,
 * matching the reference design's bust-portrait style.
 *
 * states: idle | listening | thinking | talking | concerned
 * `pulse`: increment to trigger a one-shot head-nod when a new reply lands.
 */
export default function Chemist({ state = "idle", size = 140, pulse = 0 }) {
  const concerned = state === "concerned";

  return (
    <div className="chemist-portrait-wrap" style={{ width: size, height: size }}>
      <div className="chemist-glow-ring" />
      <div className={`chemist-portrait chemist-portrait--${state}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" width={size} height={size}>
          <g key={pulse} className="chemist-nod">
            <g className="chemist-breathe">
              {/* coat shoulders */}
              <path d="M30 200 L38 158 Q100 130 162 158 L170 200 Z" fill="#F4FAF6" opacity="0.94" />
              <path d="M80 158 L100 178 L120 158 L110 150 L100 160 L90 150 Z" fill="#4CBE82" />

              {/* neck */}
              <rect x="86" y="128" width="28" height="26" rx="6" fill="#E7B98C" />

              {/* head */}
              <circle cx="100" cy="98" r="58" fill="#F3CB9B" />

              {/* hair / cap */}
              <path d="M44 88 Q46 38 100 36 Q154 38 156 88 Q130 66 100 66 Q70 66 44 88 Z" fill="#123821" />
              <path d="M44 88 Q46 100 52 108 Q46 96 50 84 Z" fill="#123821" />
              <path d="M156 88 Q154 100 148 108 Q154 96 150 84 Z" fill="#123821" />

              {/* eyebrows */}
              {concerned ? (
                <>
                  <path d="M72 86 Q84 96 96 88" stroke="#123821" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M104 88 Q116 96 128 86" stroke="#123821" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M72 84 Q84 79 96 84" stroke="#123821" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M104 84 Q116 79 128 84" stroke="#123821" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                </>
              )}

              {/* eyes */}
              <g className="chemist-eyes chemist-gaze">
                <circle cx="84" cy="100" r="5" fill="#0E1F16" />
                <circle cx="116" cy="100" r="5" fill="#0E1F16" />
              </g>

              {/* glasses */}
              <circle cx="84" cy="100" r="16" fill="rgba(255,255,255,0.06)" stroke="#123821" strokeWidth="2.5" />
              <circle cx="116" cy="100" r="16" fill="rgba(255,255,255,0.06)" stroke="#123821" strokeWidth="2.5" />
              <path d="M100 100 h0" stroke="#123821" strokeWidth="2.5" />
              <path d="M68 98 Q60 92 52 98" stroke="#123821" strokeWidth="2" fill="none" />
              <path d="M132 98 Q140 92 148 98" stroke="#123821" strokeWidth="2" fill="none" />
              <circle cx="90" cy="94" r="3" fill="rgba(255,255,255,0.5)" />
              <circle cx="122" cy="94" r="3" fill="rgba(255,255,255,0.5)" />

              {/* mouth */}
              <path
                className="chemist-mouth"
                d={concerned ? "M84 128 Q100 122 116 128" : "M84 124 Q100 136 116 124"}
                stroke="#123821"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* blush */}
              <circle cx="68" cy="114" r="6.5" fill="#E38A6B" opacity="0.28" />
              <circle cx="132" cy="114" r="6.5" fill="#E38A6B" opacity="0.28" />
            </g>
          </g>
        </svg>
      </div>

      {state === "thinking" && (
        <div className="chemist-thoughtbubble">
          <span className="dot" /><span className="dot" /><span className="dot" />
        </div>
      )}
    </div>
  );
}
