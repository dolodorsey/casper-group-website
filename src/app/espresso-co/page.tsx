"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   ESPRESSO CO. — Sub-Brand Page
   Hero: espresso-co.mp4 FULL SCREEN stretched
   Palette: Warm brown (#8A6A3A) / cream / near-black
   ═══════════════════════════════════════════════════════════════════════ */

const C = {
  bg: "#0d0f0e", dark: "#090807", surface: "#151311",
  cream: "#F6F0E7", gold: "#D89A2B", brown: "#8A6A3A",
  brownGlow: "rgba(138,106,58,0.12)", muted: "rgba(246,240,231,0.50)",
  dim: "rgba(246,240,231,0.12)", border: "rgba(246,240,231,0.06)",
};
const F = { serif: "'Playfair Display', Georgia, serif", sans: "'DM Sans', system-ui, sans-serif", mono: "'DM Mono', monospace" };

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold, rootMargin: "60px" }); obs.observe(el); return () => obs.disconnect(); }, []);
  return [ref, v] as const;
}
function Reveal({ children, delay = 0, y = 50 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const [ref, v] = useInView();
  return <div ref={ref} style={{ transform: v ? "translateY(0)" : `translateY(${y}px)`, opacity: v ? 1 : 0, transition: `all 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}
const Grain = ({ opacity = 0.03 }: { opacity?: number }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
);

function Nav() {
  const [sc, setSc] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 80); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, padding: sc ? "14px clamp(24px,4vw,60px)" : "28px clamp(24px,4vw,60px)", display: "flex", justifyContent: "space-between", alignItems: "center", background: sc ? "rgba(13,15,14,0.92)" : "transparent", backdropFilter: sc ? "blur(24px) saturate(180%)" : "none", borderBottom: sc ? `1px solid ${C.border}` : "none", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
      <a href="/"><img src="/images/logo-espresso-co.png" alt="Espresso Co." style={{ height: sc ? "32px" : "48px", width: "auto", transition: "height 0.4s ease" }} /></a>
      <div style={{ display: "flex", gap: "clamp(20px,3vw,40px)", alignItems: "center" }}>
        {["Menu", "Lab", "Craft"].map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 400, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(185,189,199,0.7)", textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = C.cream}
            onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(185,189,199,0.7)"}>{n}</a>
        ))}
        <a href="#order" style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.bg, background: C.brown, padding: "10px 28px", textDecoration: "none" }}>Visit Lab</a>
      </div>
    </nav>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: C.bg }}>
      {/* FULL SCREEN STRETCHED VIDEO — using the other animation */}
      <video src="/videos/espresso-brand-ani.mp4" autoPlay muted loop playsInline onLoadedData={() => setLoaded(true)}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 1.6s ease", zIndex: 1, filter: "brightness(0.65) contrast(1.1) saturate(0.9)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, background: `linear-gradient(180deg, ${C.bg}88 0%, transparent 35%, transparent 55%, ${C.bg}ee 100%)` }} />
      <Grain opacity={0.02} />
      <div style={{ position: "absolute", bottom: "clamp(60px,10vh,140px)", left: "clamp(32px,6vw,100px)", zIndex: 10 }}>
        <img src="/images/logo-espresso-co.png" alt="Espresso Co." style={{ height: "clamp(72px,12vw,140px)", width: "auto", marginBottom: "24px", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 1.4s cubic-bezier(0.16,1,0.3,1) 0.5s" }} />
        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.brown, opacity: loaded ? 0.8 : 0, transition: "opacity 1s ease 1.2s" }}>Science of the Perfect Cup · A Casper Group Brand</div>
      </div>
      <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: loaded ? 0.3 : 0, transition: "opacity 1.2s ease 2s", zIndex: 10 }}>
        <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.cream }}>Scroll</div>
        <div style={{ width: "1px", height: "40px", background: `linear-gradient(180deg, ${C.brown}, transparent)` }} />
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="lab" style={{ background: C.bg, padding: "clamp(80px,10vh,140px) clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.06 }}>
        <img src="/images/espresso-machine.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(0.4)" }} />
      </div>
      <Grain opacity={0.02} />
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(48px,6vw,120px)", alignItems: "start", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.brown, marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "32px", height: "1px", background: C.brown, display: "inline-block" }} />The Lab</div>
            <h2 style={{ fontFamily: F.serif, fontSize: "clamp(40px,5.5vw,76px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.92, color: C.cream }}>Every pour is<br /><span style={{ color: C.brown }}>an experiment.</span></h2>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div style={{ paddingTop: "clamp(8px,2vw,40px)" }}>
            <p style={{ fontFamily: F.sans, fontSize: "clamp(15px,1.3vw,18px)", lineHeight: 1.85, color: C.muted, marginBottom: "28px" }}>
              Espresso Co. is modern coffee culture meets lab precision. Single-origin beans, precise extraction, and a relentless pursuit of the perfect crema. Every sip is the result of obsessive craft.
            </p>
            <p style={{ fontFamily: F.sans, fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.85, color: "rgba(246,240,231,0.35)" }}>
              From cold brew to pour-over, espresso flights to signature lattes — each drink is a controlled experiment in flavor, temperature, and extraction time.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FoodShowcase() {
  const items = [
    { src: "/images/espresso-lab.png", label: "The Lab Setup" },
    { src: "/images/espresso-latte.png", label: "Signature Latte Art" },
    { src: "/images/espresso-machine.jpg", label: "Precision Extraction" },
    { src: "/images/espresso-crew.jpg", label: "The Espresso Crew" },
  ];
  return (
    <section id="menu" style={{ background: C.bg, padding: "clamp(80px,10vh,120px) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.05 }}>
        <img src="/images/casper-background.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(0.4)" }} />
      </div>
      <Grain opacity={0.02} />
      <div style={{ position: "relative", zIndex: 1, padding: "0 clamp(32px,5vw,80px) clamp(40px,5vh,56px)", maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.brown, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "32px", height: "1px", background: C.brown, display: "inline-block" }} />The Craft</div>
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.92, color: C.cream }}>Brewed with precision</h2>
        </Reveal>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3px", padding: "0 3px" }}>
        {items.map((f, i) => (
          <Reveal key={i} delay={0.06 * i} y={30}>
            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", background: "#0a0a0a" }}>
              <img src={f.src} alt={f.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.85) contrast(1.05) saturate(1.05)", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.filter = "brightness(1) contrast(1.05) saturate(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(0.85) contrast(1.05) saturate(1.05)"; }} />
              <div style={{ position: "absolute", bottom: "12px", left: "14px", zIndex: 2, fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "4px 10px" }}>{f.label}</div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)", pointerEvents: "none" }} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CraftGrid() {
  const crafts = [
    { name: "Espresso Flight", desc: "Three single-origin shots. Taste the range.", color: "#6B4423" },
    { name: "Pour Over Bar", desc: "Hand-poured. Timed extraction. Crystal clarity.", color: "#8A6A3A" },
    { name: "Signature Lattes", desc: "Seasonal flavors meet artisan technique.", color: "#A68B5B" },
    { name: "Cold Brew Lab", desc: "24-hour steep. Nitrogen-infused. Smooth power.", color: "#4A3520" },
  ];
  return (
    <section id="craft" style={{ background: C.bg, padding: "clamp(80px,10vh,120px) clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.05 }}>
        <img src="/images/espresso-crew.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.2) saturate(0.3)" }} />
      </div>
      <Grain opacity={0.02} />
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.brown, marginBottom: "16px" }}>The Offerings</div>
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.92, color: C.cream, marginBottom: "clamp(48px,6vh,80px)" }}>Four ways to fuel.</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", background: C.border }}>
          {crafts.map((c, i) => (
            <Reveal key={c.name} delay={0.06 * i}>
              <div style={{ background: C.bg, padding: "clamp(28px,3vh,48px) clamp(18px,2vw,32px)", borderTop: `2px solid ${c.color}` }}>
                <div style={{ fontFamily: F.mono, fontSize: "8px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: c.color, marginBottom: "16px" }}>0{i + 1}</div>
                <div style={{ fontFamily: F.serif, fontSize: "clamp(18px,1.8vw,26px)", fontStyle: "italic", color: C.cream, marginBottom: "12px" }}>{c.name}</div>
                <p style={{ fontFamily: F.sans, fontSize: "13px", lineHeight: 1.75, color: C.muted }}>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderCTA() {
  return (
    <section id="order" style={{ background: C.bg, padding: "clamp(100px,12vh,160px) clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.07 }}>
        <img src="/images/portal-espresso.jpeg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(0.5)" }} />
      </div>
      <Grain opacity={0.03} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${C.brownGlow}, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(216,154,43,0.08), transparent 50%)` }} />
      <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <Reveal>
          <img src="/images/logo-espresso-co.png" alt="Espresso Co." style={{ height: "64px", margin: "0 auto 36px", display: "block", opacity: 0.7 }} />
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5.5vw,76px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.0, color: C.cream, marginBottom: "20px" }}>Visit the Lab.</h2>
          <p style={{ fontFamily: F.sans, fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.85, color: C.muted, maxWidth: "520px", margin: "0 auto 44px" }}>
            The perfect cup is an experiment. Come find yours at Espresso Co. — where science meets soul.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: C.bg, background: C.brown, padding: "16px 48px", textDecoration: "none" }}>Find a Location</a>
            <a href="/" style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: C.cream, border: `1px solid ${C.border}`, padding: "16px 36px", textDecoration: "none" }}>Back to Casper Group</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.dark, borderTop: `1px solid ${C.border}`, padding: "48px clamp(32px,5vw,80px) 32px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <img src="/images/logo-espresso-co.png" alt="Espresso Co." style={{ height: "28px", marginBottom: "8px", display: "block", opacity: 0.5 }} />
          <div style={{ fontFamily: F.mono, fontSize: "9px", color: "rgba(246,240,231,0.15)" }}>© 2026 Espresso Co. A Casper Group Brand. A KHG Enterprise.</div>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms"].map(item => <span key={item} style={{ fontFamily: F.mono, fontSize: "9px", color: "rgba(246,240,231,0.15)", cursor: "pointer" }}>{item}</span>)}
        </div>
      </div>
    </footer>
  );
}

export default function EspressoCoPage() {
  return (
    <div style={{ background: C.bg }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}body{overflow-x:hidden}::selection{background:rgba(138,106,58,0.4);color:#F6F0E7}@media(max-width:768px){nav a[href^="#"]{display:none}}`}</style>
      <Nav />
      <Hero />
      <Story />
      <FoodShowcase />
      <CraftGrid />
      <OrderCTA />
      <Footer />
    </div>
  );
}
