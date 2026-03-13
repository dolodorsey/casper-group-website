"use client";
import type { ReactNode } from "react";
import { useState, useEffect, useRef, MutableRefObject } from "react";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  base:     "#0B0B0B",
  surface:  "#141414",
  panel:    "rgba(255,255,255,0.03)",
  border:   "rgba(255,255,255,0.07)",
  gold:     "#D89A2B",
  goldDeep: "#8a5e14",
  cream:    "#F6F0E7",
  muted:    "#7A7E85",
  orange:   "#C85A1A",
  burgundy: "#5E1F24",
};

// ─── UTILITY HOOKS ────────────────────────────────────────────────────────────
function useInView(t = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    o.observe(el); return () => o.disconnect();
  }, []);
  return [ref, v];
}

function Reveal({ children, d = 0, y = 36 }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{ transform: v ? "translateY(0)" : `translateY(${y}px)`, opacity: v ? 1 : 0, transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${d}s, opacity 0.8s ease ${d}s` }}>
      {children}
    </div>
  );
}

function Stagger({ children, base = 0 }) {
  const [ref, v] = useInView();
  const arr = Array.isArray(children) ? children : [children];
  return (
    <div ref={ref} style={{ display: "contents" }}>
      {arr.map((c, i) => (
        <div key={i} style={{ transform: v ? "translateY(0)" : "translateY(28px)", opacity: v ? 1 : 0, transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${base + i * 0.08}s` }}>{c}</div>
      ))}
    </div>
  );
}

const Grain = ({ o = 0.03 }) => (
  <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none", zIndex: 1, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? "14px clamp(24px,4vw,56px)" : "24px clamp(24px,4vw,56px)", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrolled ? "rgba(11,11,11,0.94)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "none", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
      <div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "8px", letterSpacing: "0.45em", textTransform: "uppercase", color: C.gold, marginBottom: "3px" }}>Restaurant Concepts</div>
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 400, fontStyle: "italic", color: C.cream, letterSpacing: "0.01em" }}>Casper Group</span>
      </div>
      <div style={{ display: "flex", gap: "clamp(16px,2.5vw,36px)", alignItems: "center" }}>
        {["Concepts", "Locations", "Franchise", "About"].map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.muted, textDecoration: "none", transition: "color 0.3s" }} onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{n}</a>
        ))}
        <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0B0B0B", background: C.gold, border: "none", padding: "10px 26px", cursor: "pointer", transition: "all 0.3s" }} onMouseEnter={e => { e.target.style.background = C.cream; }} onMouseLeave={e => { e.target.style.background = C.gold; }}>Inquire</button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const stats = [
    { v: "10+", l: "Distinct Concepts" },
    { v: "25+", l: "Markets & Growing" },
    { v: "150+", l: "Locations" },
    { v: "1", l: "Mascot Universe" },
  ];

  return (
    <section style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 20% 80%, rgba(94,31,36,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(216,154,43,0.08) 0%, transparent 55%), ${C.base}`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(32px,6vw,96px) 80px" }}>
      <Grain o={0.03} />
      {/* Decorative line grid */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "100px 100px" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}>
          An Enterprise of Flavor-Driven Brands
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(56px, 10vw, 148px)", fontWeight: 400, lineHeight: 0.88, letterSpacing: "-0.03em", color: C.cream, marginTop: "20px", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 1.1s cubic-bezier(0.16,1,0.3,1) 0.5s" }}>
          <em>Casper</em><br />
          <span style={{ color: "rgba(246,240,231,0.28)" }}>Group</span>
        </h1>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.8, color: C.muted, maxWidth: "520px", marginTop: "32px", opacity: loaded ? 1 : 0, transition: "all 0.9s ease 0.9s" }}>
          Distinct concepts. Shared power. Casper Group builds iconic QSR brands with production, operations, and training infrastructure to expand and scale.
        </p>

        <div style={{ display: "flex", gap: "14px", marginTop: "44px", opacity: loaded ? 1 : 0, transition: "opacity 0.9s ease 1.2s", flexWrap: "wrap" }}>
          <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0B0B0B", background: C.gold, border: "none", padding: "15px 42px", cursor: "pointer", transition: "all 0.3s" }} onMouseEnter={e => { e.target.style.background = C.cream; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.target.style.background = C.gold; e.target.style.transform = "translateY(0)"; }}>Explore Brands</button>
          <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.cream, background: "transparent", border: `1px solid rgba(246,240,231,0.18)`, padding: "15px 36px", cursor: "pointer", transition: "all 0.3s" }} onMouseEnter={e => { e.target.style.borderColor = C.gold; e.target.style.color = C.gold; }} onMouseLeave={e => { e.target.style.borderColor = "rgba(246,240,231,0.18)"; e.target.style.color = C.cream; }}>Partner With Casper Group</button>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", marginTop: "64px", background: C.border, borderTop: `1px solid ${C.border}`, opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1.4s" }}>
          {stats.map(s => (
            <div key={s.l} style={{ padding: "24px 0 0", background: C.base }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 400, fontStyle: "italic", color: C.gold }}>{s.v}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: C.muted, marginTop: "8px" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BRAND WORLDS ─────────────────────────────────────────────────────────────
const BRANDS = [
  { name: "Angel Wings", type: "Wings Concept", desc: "Atlanta-style lemon pepper wings and Southern comfort energy built for mass demand and franchise velocity.", accent: "#C85A1A", emoji: "🍗" },
  { name: "Tha Morning After", type: "Breakfast Concept", desc: "Creative breakfast and brunch culture engineered for craveability, content moments, and repeat traffic.", accent: "#D89A2B", emoji: "🍳" },
  { name: "Patty Daddy", type: "Burger Concept", desc: "A larger-than-life burger concept with bold personality, high-volume output, and visual brand dominance.", accent: "#C85A1A", emoji: "🍔" },
  { name: "Mojo Juice", type: "Juice Bar", desc: "Fresh-pressed ritual with bright wellness positioning, clean visual branding, and effortless expansion logic.", accent: "#4A8A3A", emoji: "🥤" },
  { name: "Espresso Co.", type: "Coffee Concept", desc: "Modern coffee culture driving premium everyday traffic and a design language built to inspire loyalty.", accent: "#8A6A3A", emoji: "☕" },
  { name: "Mr. Oyster", type: "Seafood Concept", desc: "Elevated seafood character with visual edge, premium category positioning, and curated menu authority.", accent: "#3A6A8A", emoji: "🦪" },
  { name: "Sweet Tooth", type: "Dessert Concept", desc: "Dessert-driven indulgence designed for impulse buys, social documentation, and memorable visual branding.", accent: "#C83A8A", emoji: "🍰" },
  { name: "Taco Yaki", type: "Fusion Concept", desc: "A fusion-forward taco concept with high-visual menu appeal and strong urban cultural energy.", accent: "#C85A1A", emoji: "🌮" },
  { name: "Toss'd", type: "Healthy Fast Casual", desc: "Fresh bowls and salads with speed, simplicity, and scalable healthy fast-casual market reach.", accent: "#4A8A3A", emoji: "🥗" },
  { name: "Pasta Bish", type: "Pasta Concept", desc: "Comfort-food pasta with attitude, rich visual branding, and broad-market menu flexibility.", accent: "#C83A3A", emoji: "🍝" },
];

function BrandWorlds() {
  const [hover, setHover] = useState(null);

  return (
    <section id="concepts" style={{ background: C.base, padding: "120px clamp(32px,6vw,96px)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", letterSpacing: "0.48em", textTransform: "uppercase", color: C.gold, marginBottom: "16px" }}>Brand Portfolio</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, lineHeight: 0.95, letterSpacing: "-0.03em", color: C.cream, fontStyle: "italic" }}>Our Brand Worlds</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", lineHeight: 1.75, color: C.muted, maxWidth: "420px" }}>Explore our world with all its own distinct concepts — each engineered to dominate its category.</p>
          </div>
        </Reveal>

        <div style={{ marginTop: "64px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2px", background: C.border }}>
          {BRANDS.map((b, i) => (
            <div
              key={b.name}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ background: hover === i ? C.surface : C.base, padding: "32px 28px", cursor: "pointer", transition: "background 0.3s", position: "relative", overflow: "hidden" }}
            >
              {hover === i && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 80% 20%, ${b.accent}18, transparent 70%)`, pointerEvents: "none" }} />}
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{b.emoji}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "8px", fontWeight: 600, letterSpacing: "0.38em", textTransform: "uppercase", color: b.accent, marginBottom: "8px" }}>{b.type}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 400, fontStyle: "italic", color: C.cream, marginBottom: "12px" }}>{b.name}</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.7, color: C.muted }}>{b.desc}</p>
                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: b.accent, opacity: hover === i ? 1 : 0, transition: "opacity 0.3s" }}>
                  Explore Concept →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MASCOT UNIVERSE ──────────────────────────────────────────────────────────
function MascotUniverse() {
  const mascots = [
    { name: "HALO", brand: "Angel Wings", color: C.orange },
    { name: "YAKI", brand: "Taco Yaki", color: "#D89A2B" },
    { name: "BEANZO", brand: "Espresso Co.", color: "#8A6A3A" },
    { name: "KING KALE", brand: "Mojo Juice", color: "#4A8A3A" },
    { name: "EGGAVIER", brand: "Tha Morning After", color: "#C85A1A" },
  ];

  return (
    <section style={{ background: C.surface, padding: "120px clamp(32px,6vw,96px)", position: "relative", overflow: "hidden" }}>
      <Grain o={0.025} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 100%, ${C.gold}10, transparent 60%)` }} />
      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", letterSpacing: "0.48em", textTransform: "uppercase", color: C.gold, marginBottom: "16px" }}>Meet the Family</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,5vw,68px)", fontWeight: 400, fontStyle: "italic", color: C.cream, lineHeight: 1 }}>The Mascot Universe</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", lineHeight: 1.75, color: C.muted, maxWidth: "480px", margin: "20px auto 0" }}>The mascots bringing our brands to life — characters with personality built for culture, content, and connection.</p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px", background: C.border }}>
          {mascots.map(m => (
            <div key={m.name} style={{ background: C.base, padding: "40px 24px", textAlign: "center" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: `${m.color}18`, border: `1px solid ${m.color}30`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", color: m.color }}>{m.name[0]}</div>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.08em", color: C.cream, marginBottom: "6px" }}>{m.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: m.color }}>{m.brand}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY CASPER ───────────────────────────────────────────────────────────────
function WhyCasper() {
  const cols = [
    {
      title: "Our Brands",
      items: ["Operators looking for proven concepts", "Landlords seeking quality tenants", "Vendors building supply relationships", "Media & press partnerships"],
    },
    {
      title: "Our Markets",
      items: ["Atlanta — Flagship market depth", "Houston — Strong expansion traction", "Charlotte — Growing demand base", "Nationwide ghost kitchen scale"],
    },
    {
      title: "Our Company",
      items: ["Franchise-ready infrastructure", "Dual-kitchen operating model", "Mascot universe IP advantage", "Casper Group central support"],
    },
  ];

  return (
    <section id="franchise" style={{ background: C.base, padding: "120px clamp(32px,6vw,96px)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", letterSpacing: "0.48em", textTransform: "uppercase", color: C.gold, marginBottom: "16px" }}>The Power Platform</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,5vw,68px)", fontWeight: 400, fontStyle: "italic", color: C.cream, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "64px" }}>Why Casper Group</h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: C.border }}>
          {cols.map(col => (
            <div key={col.title} style={{ background: C.surface, padding: "48px 36px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: "28px" }}>{col.title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                {col.items.map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: 1.6, color: C.muted }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.gold, flexShrink: 0, marginTop: "8px" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PARTNER CTA ──────────────────────────────────────────────────────────────
function PartnerCTA() {
  return (
    <section style={{ background: C.surface, padding: "120px clamp(32px,6vw,96px)", position: "relative", overflow: "hidden" }}>
      <Grain o={0.025} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${C.gold}10, transparent 65%)` }} />
      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", letterSpacing: "0.48em", textTransform: "uppercase", color: C.gold, marginBottom: "24px" }}>Build With Us</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", color: C.cream, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: "24px" }}>
            The Modern Fast-Food<br />Empire Starts Here.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.8, color: C.muted, maxWidth: "560px", margin: "0 auto 48px" }}>
            Whether you are an operator, a landlord, or a strategic partner — Casper Group has a path designed for results at scale.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#0B0B0B", background: C.gold, border: "none", padding: "16px 48px", cursor: "pointer", transition: "all 0.3s" }} onMouseEnter={e => { e.target.style.background = C.cream; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.target.style.background = C.gold; e.target.style.transform = "translateY(0)"; }}>Explore Partnership</button>
            <button style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.cream, background: "transparent", border: `1px solid rgba(246,240,231,0.18)`, padding: "16px 40px", cursor: "pointer", transition: "all 0.3s" }} onMouseEnter={e => { e.target.style.borderColor = C.gold; e.target.style.color = C.gold; }} onMouseLeave={e => { e.target.style.borderColor = "rgba(246,240,231,0.18)"; e.target.style.color = C.cream; }}>Franchise Inquiry</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#080808", borderTop: `1px solid ${C.border}`, padding: "64px clamp(32px,6vw,96px) 40px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3,1fr)", gap: "48px", marginBottom: "64px" }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "8px", letterSpacing: "0.45em", textTransform: "uppercase", color: C.gold, marginBottom: "8px" }}>Restaurant Concepts Worldwide</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 400, fontStyle: "italic", color: C.cream, marginBottom: "16px" }}>Casper Group</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", lineHeight: 1.7, color: C.muted }}>10+ distinct concepts. Multi-city infrastructure. Built to scale.</p>
          </div>
          {[
            { h: "Brands", l: ["Angel Wings", "Tha Morning After", "Espresso Co.", "Mr. Oyster", "Toss'd", "Taco Yaki", "Pasta Bish"] },
            { h: "Company", l: ["About Casper Group", "Locations", "Franchise Inquiry", "Vendor Relations", "Press & Media"] },
            { h: "Contact", l: ["info@caspergroupworldwide.com", "Operator Inquiry", "Landlord Inquiry", "Become a Vendor"] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "8px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: "20px" }}>{col.h}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {col.l.map(i => <li key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: C.muted }}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.22)" }}>© 2026 Casper Group. A KHG Enterprise. All rights reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy", "Terms", "Contact"].map(i => <a key={i} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>{i}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function CasperGroupV3() {
  return (
    <div style={{ background: C.base }}>
      <Nav />
      <Hero />
      <BrandWorlds />
      <MascotUniverse />
      <WhyCasper />
      <PartnerCTA />
      <Footer />
    </div>
  );
}
