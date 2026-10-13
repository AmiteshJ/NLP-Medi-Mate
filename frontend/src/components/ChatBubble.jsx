import React from "react";

export default function ChatBubble({ role, text, redFlag }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        className="chat-bubble-pop"
        style={{
          maxWidth: "78%",
          padding: "12px 15px",
          fontSize: 14.5,
          lineHeight: 1.55,
          borderRadius: 14,
          borderBottomRightRadius: isUser ? 3 : 14,
          borderBottomLeftRadius: isUser ? 14 : 3,
          background: redFlag ? "var(--amber-bg)" : isUser ? "#FFFFFF" : "var(--green-light)",
          color: redFlag ? "#7A4B14" : isUser ? "var(--text)" : "var(--green-dark)",
          border: isUser ? "1px solid var(--green-light)" : "none",
        }}
      >
        {text}
      </div>
    </div>
  );
}
