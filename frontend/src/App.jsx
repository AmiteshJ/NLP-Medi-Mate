import React, { useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Leaf, Home as HomeIcon, Share2, Clock, Info, Sun, Moon } from "lucide-react";
import Home from "./pages/Home.jsx";
import Analysis from "./pages/Analysis.jsx";
import History from "./pages/History.jsx";
import About from "./pages/About.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/analysis", label: "NLP Pipeline", icon: Share2 },
  { to: "/history", label: "History", icon: Clock },
  { to: "/about", label: "About", icon: Info },
];

export default function App() {
  const location = useLocation();
  const [dim, setDim] = useState(false);

  return (
    <>
      <div className="ambient-bg">
        <div className="ambient-blob one" />
        <div className="ambient-blob two" />
        <div className="ambient-blob three" />
        <div className="ambient-blob four" />
      </div>
      <div className="mesh-dots" />
      <div className="grain-overlay" />

      <nav className="nav">
        <div className="nav-logo">
          <span className="leaf"><Leaf size={22} strokeWidth={2.2} /></span>
          Medi<span>Mate</span>
        </div>

        <div className="nav-pill">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                <Icon size={15} strokeWidth={2.2} />
                <span className="label">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <button className="nav-settings" onClick={() => setDim((d) => !d)} title="Toggle glow intensity">
          {dim ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>

      <div key={location.pathname} className="page-fade">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}
