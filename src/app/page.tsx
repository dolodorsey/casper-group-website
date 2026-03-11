"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const C = { base: "#111111", cream: "#F6F0E7", burgundy: "#5E1F24", silver: "#B9BDC7", gold: "#D89A2B", steel: "#1C1C1E", dim: "#7A7A80", warm: "#2A1A1C", deep: "#0D0D0F" };

function useInView(t = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: t }); obs.observe(el); return () => obs.disconnect(); }, [t]);
  return [ref, v] as const;
}

function R({ children, delay = 0, dir = "up", style = {} }: { children: React.ReactNode; delay?: number; dir?: string; style?: React.CSSProperties }) {
  const [ref, vis] = useInView();
  const t: Record<string, string> = { up: "translateY(50px)", left: "translateX(60px)", right: "translateX(-60px)", scale: "scale(0.92)" };
  return <div ref={ref} style={{ ...style, opacity: vis ? 1 : 0, transform: vis ? "none" : t[dir] || t.up, transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`, willChange: "transform,opacity" }}>{children}</div>;
}

const Grain = () => (<div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.03 }}><svg width="100%" height="100%"><filter id="g"><feTurbulence baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#g)" /></svg></div>);

/* ─── HERO with CASPER video ─── */
function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 600); }, []);
  return (
    <section style={{ height: "100vh", position: "relative", overflow: "hidden", background: C.base }}>
      {/* Hero video — vignette masked */}
      <div style={{
        position: "absolute", inset: "-5%", width: "110%", height: "110%",
        WebkitMaskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 30%, transparent 100%)",
        maskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 30%, transparent 100%)",
      }}>
        <video autoPlay muted loop playsInline style={{
          width: "100%", height: "100%", objectFit: "cover",
          opacity: ready ? 0.4 : 0, filter: "brightness(0.5) contrast(1.1) saturate(0.8)",
          transition: "opacity 2s cubic-bezier(0.16,1,0.3,1)"
        }}><source src="/videos/casper.mp4" type="video/mp4" /></video>
      </div>

      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 60% 40%, ${C.burgundy}10, transparent 60%)` }} />
      <div style={{ position: "absolute", top: "50%", left: "6vw", right: "6vw", height: 1, background: `linear-gradient(90deg, ${C.gold}15, ${C.gold}05, ${C.gold}15)`, zIndex: 1, opacity: ready ? 1 : 0, transition: "opacity 2s ease 0.8s" }} />

      <div style={{ position: "absolute", bottom: "15vh", left: "6vw", zIndex: 3 }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: 28, opacity: ready ? 1 : 0, transform: ready ? "translateX(0)" : "translateX(-20px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 32, height: 1, background: C.gold, display: "inline-block" }} />Est. 2020 — Multi-Concept Dining Empire
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(52px,12vw,180px)", fontWeight: 400, lineHeight: 0.88, letterSpacing: "-0.03em", color: C.cream, margin: 0 }}>
          <span style={{ display: "block", opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(100%)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>Casper</span>
          <span style={{ display: "block", fontStyle: "italic", fontWeight: 400, opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(100%)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.45s" }}><span style={{ color: C.gold }}>Group</span></span>
        </h1>
        <div style={{ marginTop: 36, marginLeft: "clamp(60px,10vw,160px)", opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.7s" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(13px,1.1vw,16px)", fontWeight: 300, color: C.silver, lineHeight: 1.6, maxWidth: 360 }}>
            A multi-concept restaurant empire. Ten brands. Each one tells its own story, serves its own audience, and owns its lane.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── CONCEPT WALL — 10 brands with graphics ─── */
function ConceptWall() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const concepts = [
    { name: "Angel Wings", type: "Wing Bar", desc: "East Atlanta Lou's-inspired wing spot. Basketball culture meets heat-level battles. Honey garlic to scorpion pepper.", color: "#2A1510", accent: "#E8A020", img: "/images/angel-wings-hero.jpg", vid: "/videos/angel-wings.mp4" },
    { name: "Espresso Co", type: "Coffee Lab", desc: "Steampunk coffee laboratory. Precision-roasted beans, mad-scientist energy, craft espresso culture.", color: "#0E2420", accent: "#4DD9B4", img: "/images/espresso-machine.jpg", vid: "/videos/espresso-co.mp4" },
    { name: "Mojo Juice Bar", type: "Juice + Smoothies", desc: "Tropical juice bar on wheels. Fresh-pressed, skateboard-culture vibes, island-sunset energy.", color: "#2D1A08", accent: "#F5A623", img: "/images/mojo-juice.png", vid: "/videos/mojo-juice.mp4" },
    { name: "Tha Morning After", type: "Breakfast + Brunch", desc: "Hangover-cure breakfast spot. Egg mascots in sunglasses. Pancakes, bacon, and no judgment.", color: "#1A1510", accent: "#E8B040", img: "/images/morning-after-booth.jpg", vid: "/videos/casper.mp4" },
    { name: "Mr. Oyster", type: "Oyster Bar", desc: "Old-money oyster bar. Top hats, champagne, raw bar excellence. Speakeasy sophistication.", color: "#1A1508", accent: "#D4A05A", img: "/images/mr-oyster.png", vid: "/videos/mr-oyster.mp4" },
    { name: "Pasta Bish", type: "Italian Kitchen", desc: "Vault-door pasta house. Secret recipes behind steel. Truffle-forward, old-world craft.", color: "#1A1810", accent: "#C8A040", img: "/images/pasta-bish.jpg", vid: "/videos/pasta-bish.mp4" },
    { name: "Patty Daddy", type: "Burger Bar", desc: "Neon-lit burger empire. Father-son mascot duo. Smash burgers, loaded fries, late-night runs.", color: "#2A0A08", accent: "#E85020", img: "/images/patty-daddy-hero.jpg", vid: "/videos/patty-daddy.mp4" },
    { name: "Sweet Tooth", type: "Dessert Bar", desc: "Pink neon dessert kingdom. Cupcake queen mascot. Cakes, donuts, and sugar artistry.", color: "#2A0820", accent: "#E860A0", img: "/images/sweet-tooth.png", vid: "/videos/sweet-tooth.mp4" },
    { name: "Toss'd", type: "Salad + Bowls", desc: "Greenhouse-inspired salad bar. Lettuce royalty. Farm-to-fork bowls, clean eating with character.", color: "#0A1A0A", accent: "#40A848", img: "/images/tossd.png", vid: "/videos/tossd.mp4" },
    { name: "Taco Yaki", type: "Taco + Yakitori Fusion", desc: "Fire-breathing panda mascot. Mexican-Japanese street food fusion. Tacos meet yakitori flame.", color: "#2A0A08", accent: "#E04020", img: "/images/taco-yaki-ninja.jpg", vid: "/videos/taco-yaki.mp4" },
  ];

  return (
    <section style={{ minHeight: "100vh", background: C.deep, padding: "120px 6vw", position: "relative" }}>
      <R><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: 64, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 32, height: 1, background: C.gold, display: "inline-block" }} />The Concepts</div></R>
      <R delay={0.1}><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,6vw,80px)", fontWeight: 400, lineHeight: 0.95, color: C.cream, margin: "0 0 72px", letterSpacing: "-0.02em" }}>
        One empire.<br /><em>Ten universes.</em>
      </h2></R>

      <div style={{ display: "grid", gridTemplateColumns: expanded !== null ? "1fr" : "repeat(2, 1fr)", gap: 3, transition: "all 0.6s ease" }}>
        {concepts.map((c, i) => (
          <R key={c.name} delay={0.06 + i * 0.03}>
            <div onClick={() => setExpanded(expanded === i ? null : i)} style={{
              background: C.steel, position: "relative", overflow: "hidden", cursor: "pointer",
              padding: expanded === i ? "clamp(48px,5vw,80px)" : "clamp(36px,3vw,56px)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
              border: `1px solid ${expanded === i ? c.accent + "30" : C.steel}`,
              minHeight: expanded === i ? 340 : "auto",
            }}>
              {/* Background image — vignette masked, only visible when expanded */}
              <div style={{
                position: "absolute", inset: 0,
                opacity: expanded === i ? 0.35 : 0,
                transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1)",
                WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, black 30%, transparent 100%)",
                maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, black 30%, transparent 100%)",
              }}>
                <Image src={c.img} alt={c.name} fill style={{ objectFit: "cover", filter: "brightness(0.6) saturate(0.8)" }} sizes="600px" />
              </div>

              {/* Color overlay when expanded */}
              <div style={{
                position: "absolute", inset: 0,
                background: expanded === i ? `${c.color}E0` : "transparent",
                transition: "background 0.5s ease",
              }} />

              {/* Ghost number */}
              <div style={{ position: "absolute", top: 12, right: 20, fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,5vw,80px)", color: expanded === i ? c.accent : C.base, opacity: expanded === i ? 0.15 : 0.08, transition: "all 0.5s ease", lineHeight: 1, fontStyle: "italic", zIndex: 2 }}>
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: c.accent, marginBottom: 12, transition: "color 0.4s ease" }}>{c.type}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: expanded === i ? "clamp(36px,4vw,56px)" : "clamp(22px,2.2vw,32px)", fontWeight: 500, color: C.cream, margin: "0 0 16px", transition: "font-size 0.5s ease" }}>{c.name}</h3>

                <div style={{ maxHeight: expanded === i ? 200 : 0, opacity: expanded === i ? 1 : 0, overflow: "hidden", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.7, color: C.cream, opacity: 0.7, maxWidth: 500, marginBottom: 28 }}>{c.desc}</p>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: c.accent, borderBottom: `1px solid ${c.accent}40`, paddingBottom: 2 }}>Explore &rarr;</span>
                </div>

                {/* Logo animation — plays when tile is expanded */}
                <div style={{
                  position: "absolute", bottom: 20, right: 20, width: expanded === i ? 120 : 0, height: expanded === i ? 120 : 0,
                  borderRadius: "50%", overflow: "hidden",
                  opacity: expanded === i ? 1 : 0,
                  transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s",
                  border: `1px solid ${c.accent}30`,
                  boxShadow: `0 0 40px ${c.accent}20`,
                }}>
                  {expanded === i && (
                    <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                      <source src={c.vid} type="video/mp4" />
                    </video>
                  )}
                </div>

                <div style={{ position: "absolute", bottom: -20, right: 0, fontFamily: "'DM Mono',monospace", fontSize: 8, color: C.dim, opacity: expanded === i ? 0 : 0.3, transition: "opacity 0.3s ease" }}>Click to expand</div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── BRAND REEL — All 10 logo animations ─── */
function BrandReel() {
  const [ref, vis] = useInView(0.05);
  const brands = [
    { src: "/videos/angel-wings.mp4", label: "ANGEL WINGS" },
    { src: "/videos/espresso-co.mp4", label: "ESPRESSO CO" },
    { src: "/videos/mojo-juice.mp4", label: "MOJO JUICE" },
    { src: "/videos/mr-oyster.mp4", label: "MR. OYSTER" },
    { src: "/videos/pasta-bish.mp4", label: "PASTA BISH" },
    { src: "/videos/patty-daddy.mp4", label: "PATTY DADDY" },
    { src: "/videos/sweet-tooth.mp4", label: "SWEET TOOTH" },
    { src: "/videos/tossd.mp4", label: "TOSS'D" },
    { src: "/videos/taco-yaki.mp4", label: "TACO YAKI" },
    { src: "/videos/casper.mp4", label: "CASPER GROUP" },
  ];
  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden", background: C.base, padding: "100px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 48, padding: "0 6vw" }}>
        <R><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Brand Identities</div></R>
        <R delay={0.1}><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 400, color: C.cream }}>The <em style={{ color: C.gold }}>Empire</em> in motion.</h2></R>
      </div>

      {/* 2-row grid of logo animations */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3, padding: "0 6vw", maxWidth: 1400, margin: "0 auto" }}>
        {brands.map((v, i) => (
          <R key={v.label} delay={0.04 * i}>
            <div style={{
              position: "relative", overflow: "hidden", aspectRatio: "1/1",
              background: C.deep,
              opacity: vis ? 1 : 0, transform: vis ? "scale(1)" : "scale(0.9)",
              transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.04 * i}s`,
              /* Vignette mask — dissolve edges */
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            }}>
              <video muted loop playsInline autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                <source src={v.src} type="video/mp4" />
              </video>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(13,13,15,0.85))",
                padding: "32px 12px 10px", textAlign: "center"
              }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: "0.2em", color: C.gold }}>{v.label}</span>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── PROOF ─── */
function Proof() {
  const stats = [
    { v: "10", u: "", l: "Restaurant Concepts" },
    { v: "8", u: "+", l: "Cities" },
    { v: "50", u: "K+", l: "Guests Served" },
    { v: "∞", u: "", l: "Ambition" },
  ];
  return (
    <section style={{ padding: "140px 6vw", background: C.base, position: "relative", overflow: "hidden" }}>
      {[25, 50, 75].map(p => <div key={p} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: 1, background: C.steel }} />)}
      <R><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,8vw,120px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.9, color: C.cream, margin: "0 0 80px" }}>Scale.</h2></R>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", position: "relative", zIndex: 1 }}>
        {stats.map((s, i) => (
          <R key={s.l} delay={0.08 + i * 0.08}>
            <div style={{ padding: "40px 20px 40px 0" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,6vw,80px)", fontWeight: 400, color: C.gold, lineHeight: 1, display: "flex", alignItems: "baseline" }}>
                {s.v}<span style={{ fontSize: "clamp(14px,1.5vw,20px)", fontFamily: "'DM Mono',monospace", marginLeft: 2, color: C.dim }}>{s.u}</span>
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: C.dim, marginTop: 12 }}>{s.l}</div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── CITIES ─── */
function Cities() {
  const [hov, setHov] = useState<number | null>(null);
  const cities = ["Atlanta", "Houston", "Miami", "New York", "LA", "Charlotte", "Las Vegas", "DC"];
  return (
    <section style={{ padding: "140px 6vw", background: C.deep }}>
      <R><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,7vw,100px)", fontWeight: 400, lineHeight: 0.9, color: C.cream, margin: "0 0 64px" }}>Where we<br /><em style={{ color: C.gold }}>operate.</em></h2></R>
      <R delay={0.15}><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: `1px solid ${C.steel}` }}>
        {cities.map((c, i) => (
          <div key={c} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{
            padding: "28px 16px", borderBottom: `1px solid ${C.steel}`,
            borderRight: (i + 1) % 4 !== 0 ? `1px solid ${C.steel}` : "none",
            background: hov === i ? C.burgundy : "transparent",
            transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", cursor: "default",
          }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,1.8vw,24px)", fontWeight: 400, color: hov === i ? C.cream : C.silver, transition: "color 0.3s ease" }}>{c}</span>
          </div>
        ))}
      </div></R>
    </section>
  );
}

/* ─── PARTNERSHIP ─── */
function Partnership() {
  return (
    <section style={{ minHeight: "70vh", background: C.base, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-3vw", top: "50%", transform: "translateY(-50%)", fontFamily: "'Playfair Display',serif", fontSize: "clamp(100px,18vw,260px)", fontWeight: 700, fontStyle: "italic", color: C.steel, opacity: 0.12, whiteSpace: "nowrap" }}>Invest</div>
      <div style={{ padding: "100px 6vw", position: "relative", zIndex: 1, maxWidth: "55vw", marginLeft: "auto" }}>
        <R><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 32, height: 1, background: C.gold, display: "inline-block" }} />Franchise &amp; Partnership</div></R>
        <R delay={0.1}><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 400, lineHeight: 1.05, color: C.cream, margin: "0 0 24px" }}>Build with the<br /><em style={{ color: C.gold }}>Casper universe.</em></h2></R>
        <R delay={0.2}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: C.silver, opacity: 0.5, maxWidth: 400, marginBottom: 40 }}>Franchise opportunities, white-label kitchen partnerships, and strategic joint ventures. The empire expands with the right partners.</p></R>
        <R delay={0.3}><a href="#contact" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.base, background: C.gold, padding: "14px 36px", textDecoration: "none", transition: "all 0.4s ease", display: "inline-block" }} onMouseEnter={e => { (e.target as HTMLElement).style.background = C.cream; }} onMouseLeave={e => { (e.target as HTMLElement).style.background = C.gold; }}>Partner With Us</a></R>
      </div>
    </section>
  );
}

/* ─── CONVERSION ─── */
function Conversion() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="contact" style={{ minHeight: "70vh", background: C.deep, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Playfair Display',serif", fontSize: "clamp(200px,40vw,500px)", fontWeight: 400, fontStyle: "italic", color: C.steel, opacity: 0.04 }}>CG</div>
      <div style={{ padding: "100px 6vw", position: "relative", zIndex: 1 }}>
        <R><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,10vw,140px)", fontWeight: 400, lineHeight: 0.88, color: C.cream, margin: "0 0 48px" }}>Join the<br /><em style={{ color: C.gold }}>Empire.</em></h2></R>
        <R delay={0.15}><div style={{ maxWidth: 480 }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.7, color: C.silver, opacity: 0.5, marginBottom: 36 }}>Openings, events, private dining, and franchise updates. No noise.</p>
          {!done ? (
            <div style={{ display: "flex", border: `1px solid ${C.steel}` }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, padding: "16px 20px", fontFamily: "'DM Mono',monospace", fontSize: 13, border: "none", outline: "none", background: "transparent", color: C.cream }} />
              <button onClick={() => email && setDone(true)} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 28px", background: C.burgundy, color: C.cream, border: "none", cursor: "pointer", transition: "background 0.3s ease" }} onMouseEnter={e => { (e.target as HTMLElement).style.background = C.gold; (e.target as HTMLElement).style.color = C.base; }} onMouseLeave={e => { (e.target as HTMLElement).style.background = C.burgundy; (e.target as HTMLElement).style.color = C.cream; }}>Join</button>
            </div>
          ) : <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontStyle: "italic", color: C.gold }}>Welcome to the empire.</div>}
        </div></R>
      </div>
    </section>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => { const fn = () => setS(window.scrollY > 80); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "22px 6vw", display: "flex", justifyContent: "space-between", alignItems: "center", background: s ? `${C.base}F2` : "transparent", backdropFilter: s ? "blur(24px)" : "none", borderBottom: s ? `1px solid ${C.steel}` : "1px solid transparent", transition: "all 0.5s ease" }}>
      <a href="#" style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 500, color: C.cream, textDecoration: "none", letterSpacing: "0.05em" }}>Casper <span style={{ fontStyle: "italic", color: C.gold }}>Group</span></a>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {["Concepts", "Cities", "Careers"].map(i => <a key={i} href="#" className="nav-hide" style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.dim, textDecoration: "none", transition: "color 0.3s ease" }} onMouseEnter={e => { (e.target as HTMLElement).style.color = C.cream; }} onMouseLeave={e => { (e.target as HTMLElement).style.color = C.dim; }}>{i}</a>)}
        <a href="#contact" style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: C.base, background: C.gold, padding: "8px 18px", textDecoration: "none", transition: "all 0.3s ease" }} onMouseEnter={e => { (e.target as HTMLElement).style.background = C.cream; }} onMouseLeave={e => { (e.target as HTMLElement).style.background = C.gold; }}>Connect</a>
      </div>
    </nav>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background: C.base, padding: "56px 6vw 40px", borderTop: `1px solid ${C.steel}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: C.cream, marginBottom: 8 }}>Casper <span style={{ fontStyle: "italic", color: C.gold }}>Group</span> Worldwide</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: C.dim, opacity: 0.3 }}>&copy; 2026 Casper Group &mdash; A Kollective Hospitality Group Brand</div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Instagram", "Careers", "Legal"].map(l => <a key={l} href="#" style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: C.dim, textDecoration: "none", opacity: 0.3, transition: "opacity 0.3s" }} onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "1"; }} onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "0.3"; }}>{l}</a>)}
        </div>
      </div>
    </footer>
  );
}

export default function CasperGroup() {
  return (
    <main style={{ overflowX: "hidden" }}>
      <style>{`
        @media(max-width:900px){
          div[style*="repeat(4"]{grid-template-columns:1fr 1fr!important}
          div[style*="repeat(2, 1fr)"]{grid-template-columns:1fr!important}
          h1{font-size:52px!important}
          .nav-hide{display:none}
        }
      `}</style>
      <Grain />
      <Nav />
      <Hero />
      <ConceptWall />
      <BrandReel />
      <Proof />
      <Cities />
      <Partnership />
      <Conversion />
      <Footer />
    </main>
  );
}
