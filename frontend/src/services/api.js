const BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res;
}

export async function analyzeText(text) {
  const res = await request("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function fetchHistory() {
  const res = await request("/api/history");
  return res.json();
}

export async function downloadPdf({ text, analysis, remedies }) {
  const res = await request("/api/pdf", {
    method: "POST",
    body: JSON.stringify({ text, analysis, remedies }),
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "MediMate-Summary.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
