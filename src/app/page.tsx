"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const C = { base: "#111111", cream: "#F6F0E7", burgundy: "#5E1F24", silver: "#B9BDC7", gold: "#D89A2B", steel: "#1C1C1E", dim: "#7A7A80", warm: "#2A1A1C", deep: "#0D0D0F" };

/* ─── Shared ─── */
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

/* ─── BRAND DATA ─── */
const BRANDS = [
  { name: "Angel Wings", type: "Wing Bar", desc: "East Atlanta Lou's wing spot. Basketball meets heat-level battles.", color: "#2A1510", accent: "#E8A020", img: "/images/angel-wings-hero.jpg", vid: "/videos/angel-wings.mp4", logo: "/images/logo-angel-wings.png", mascot: "/images/mascot-loudini.png", mascotName: "Loudini" },
  { name: "Espresso Co", type: "Coffee Lab", desc: "Steampunk coffee laboratory. Mad-scientist craft espresso.", color: "#0E2420", accent: "#4DD9B4", img: "/images/espresso-machine.jpg", vid: "/videos/espresso-co.mp4", logo: "/images/logo-espresso-co.png", mascot: "/images/mascot-beanzo.png", mascotName: "Beanzo" },
  { name: "Mojo Juice", type: "Juice Bar", desc: "Tropical juice on wheels. Skateboard culture, island energy.", color: "#2D1A08", accent: "#F5A623", img: "/images/mojo-juice.png", vid: "/videos/mojo-juice.mp4", logo: "/images/logo-mojo-juice.png", mascot: "/images/mascot-mojo.png", mascotName: "Mojo" },
  { name: "Morning After", type: "Brunch", desc: "Hangover-cure breakfast. Egg mascots. No judgment.", color: "#1A1510", accent: "#E8B040", img: "/images/morning-after-booth.jpg", vid: "/videos/casper.mp4", logo: "/images/logo-morning-after.png", mascot: "/images/mascot-eggavier.png", mascotName: "Eggavier" },
  { name: "Mr. Oyster", type: "Oyster Bar", desc: "Old-money raw bar. Top hats, champagne, speakeasy soul.", color: "#1A1508", accent: "#D4A05A", img: "/images/mr-oyster.png", vid: "/videos/mr-oyster.mp4", logo: "/images/logo-mr-oyster.png", mascot: "/images/mascot-mr-miss-oyster.png", mascotName: "Mr. & Miss" },
  { name: "Pasta Bish", type: "Italian", desc: "Vault-door pasta house. Secret recipes. Truffle-forward.", color: "#1A1810", accent: "#C8A040", img: "/images/pasta-bish.jpg", vid: "/videos/pasta-bish.mp4", logo: "/images/logo-pasta-bish.png", mascot: "/images/mascot-mac-daddy.png", mascotName: "Mac Daddy" },
  { name: "Patty Daddy", type: "Burgers", desc: "Neon burger empire. Smash burgers, loaded fries, late nights.", color: "#2A0A08", accent: "#E85020", img: "/images/patty-daddy-hero.jpg", vid: "/videos/patty-daddy.mp4", logo: "/images/logo-patty-daddy.png", mascot: "/images/mascot-paddy-daddy.png", mascotName: "Paddy Daddy" },
  { name: "Sweet Tooth", type: "Desserts", desc: "Pink neon dessert kingdom. Cakes, donuts, sugar artistry.", color: "#2A0820", accent: "#E860A0", img: "/images/sweet-tooth.png", vid: "/videos/sweet-tooth.mp4", logo: "/images/logo-sweet-tooth.png", mascot: "/images/mascot-sweet-tooth.png", mascotName: "Sweet Tooth" },
  { name: "Toss'd", type: "Salads", desc: "Greenhouse salad bar. Lettuce royalty. Farm-to-fork bowls.", color: "#0A1A0A", accent: "#40A848", img: "/images/tossd.png", vid: "/videos/tossd.mp4", logo: "/images/logo-tossd.png", mascot: "/images/mascot-king-kale.png", mascotName: "King Kale" },
  { name: "Taco Yaki", type: "Fusion", desc: "Mexican-Japanese street food. Tacos meet yakitori flame.", color: "#2A0A08", accent: "#E04020", img: "/images/taco-yaki-ninja.jpg", vid: "/videos/taco-yaki.mp4", logo: "/images/logo-taco-yaki.png", mascot: "/images/mascot-yaki.png", mascotName: "Yaki" },
];

/* ═══════════════════════════════════════════════════════════════
   HERO — Casper logo animation center, brand logos orbit around it
   NO TEXT "Casper Group" — the video IS the identity
   ═══════════════════════════════════════════════════════════════ */
function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 800); }, []);

  return (
    <section style={{ height: "100vh", position: "relative", overflow: "hidden", background: C.base, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Ambient burgundy glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, ${C.burgundy}12, transparent 60%)` }} />

      {/* Gold architectural line */}
      <div style={{ position: "absolute", top: "50%", left: "6vw", right: "6vw", height: 1, background: `linear-gradient(90deg, ${C.gold}10, ${C.gold}06, ${C.gold}10)`, opacity: ready ? 1 : 0, transition: "opacity 2s ease 1s" }} />

      {/* ── CENTER: Casper Group logo animation video ── */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "clamp(240px, 30vw, 400px)", height: "clamp(240px, 30vw, 400px)",
        opacity: ready ? 1 : 0, transform: ready ? "scale(1)" : "scale(0.8)",
        transition: "all 1.5s cubic-bezier(0.16,1,0.3,1) 0.3s",
        mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"],
        background: "#000",
      }}>
        <video autoPlay muted loop playsInline style={{
          width: "100%", height: "100%", objectFit: "contain",
        }}>
          <source src="/videos/casper-logo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── ORBITING: 10 brand logo animations in a ring ── */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        animation: "orbitSpin 120s linear infinite",
      }}>
        {BRANDS.map((b, i) => {
          const angle = (i / BRANDS.length) * 360;
          const radius = "min(38vw, 340px)";
          return (
            <div key={b.name} style={{
              position: "absolute",
              width: "clamp(60px, 7vw, 90px)", height: "clamp(60px, 7vw, 90px)",
              transform: `rotate(${angle}deg) translateX(${radius}) rotate(-${angle}deg)`,
              opacity: ready ? 0.7 : 0,
              transition: `opacity 1s ease ${0.8 + i * 0.12}s`,
              mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"],
              borderRadius: "50%", overflow: "hidden", background: "#000",
            }}>
              <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                <source src={b.vid} type="video/mp4" />
              </video>
            </div>
          );
        })}
      </div>

      {/* Tagline below center logo */}
      <div style={{
        position: "absolute", bottom: "14vh", left: 0, right: 0, textAlign: "center", zIndex: 15,
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(20px)",
        transition: "all 1s ease 1.2s",
      }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 24, height: 1, background: C.gold, display: "inline-block" }} />
          Multi-Concept Dining Empire — 10 Brands — 8 Cities
          <span style={{ width: 24, height: 1, background: C.gold, display: "inline-block" }} />
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(13px,1.1vw,16px)", fontWeight: 300, color: C.silver, maxWidth: 380, margin: "0 auto", lineHeight: 1.6 }}>
          Every brand tells its own story. Every concept owns its lane.
        </p>
      </div>

      <style>{`
        @keyframes orbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONCEPT WALL — Logo animation videos replace brand names
   Mascots appear on expand. All images lighten-blended.
   ═══════════════════════════════════════════════════════════════ */
function ConceptWall() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section style={{ minHeight: "100vh", background: C.deep, padding: "120px 6vw", position: "relative" }}>
      <R><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: 64, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 32, height: 1, background: C.gold, display: "inline-block" }} />The Concepts
      </div></R>

      <div style={{ display: "grid", gridTemplateColumns: expanded !== null ? "1fr" : "repeat(2, 1fr)", gap: 3, transition: "all 0.6s ease" }}>
        {BRANDS.map((c, i) => (
          <R key={c.name} delay={0.04 + i * 0.03}>
            <div onClick={() => setExpanded(expanded === i ? null : i)} style={{
              background: C.steel, position: "relative", overflow: "hidden", cursor: "pointer",
              padding: expanded === i ? "clamp(48px,5vw,80px)" : "clamp(28px,2.5vw,44px)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
              border: `1px solid ${expanded === i ? c.accent + "30" : C.steel}`,
              minHeight: expanded === i ? 360 : "auto",
            }}>
              {/* Scene image bg — lighten blend kills dark bg */}
              <div style={{
                position: "absolute", inset: 0,
                opacity: expanded === i ? 0.2 : 0,
                transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1)",
                mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"],
              }}>
                <Image src={c.img} alt="" fill style={{ objectFit: "cover", filter: "brightness(0.7) saturate(0.7)" }} sizes="800px" />
              </div>

              {/* Color overlay when expanded */}
              <div style={{
                position: "absolute", inset: 0,
                background: expanded === i ? `${c.color}D0` : "transparent",
                transition: "background 0.5s ease",
              }} />

              {/* Ghost number */}
              <div style={{
                position: "absolute", top: 8, right: 16,
                fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,4vw,70px)",
                color: expanded === i ? c.accent : C.base, opacity: expanded === i ? 0.12 : 0.06,
                transition: "all 0.5s ease", lineHeight: 1, fontStyle: "italic", zIndex: 2
              }}>{String(i + 1).padStart(2, "0")}</div>

              {/* Content — logo animation replaces text name */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: c.accent, marginBottom: 8 }}>{c.type}</div>

                {/* LOGO IMAGE instead of text brand name */}
                <div style={{
                  position: "relative",
                  width: expanded === i ? "clamp(160px,16vw,240px)" : "clamp(100px,10vw,140px)",
                  height: expanded === i ? "clamp(60px,6vw,90px)" : "clamp(40px,4vw,55px)",
                  marginBottom: 12,
                  transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                  mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"],
                }}>
                  <Image src={c.logo} alt={c.name} fill style={{ objectFit: "contain", objectPosition: "left center" }} sizes="240px" />
                </div>

                {/* Expanded details */}
                <div style={{ maxHeight: expanded === i ? 220 : 0, opacity: expanded === i ? 1 : 0, overflow: "hidden", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.7, color: C.cream, opacity: 0.7, maxWidth: 500, marginBottom: 24 }}>{c.desc}</p>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: c.accent, borderBottom: `1px solid ${c.accent}40`, paddingBottom: 2 }}>Explore &rarr;</span>
                </div>
              </div>

              {/* Mascot — lighten blend, slides in on expand */}
              <div style={{
                position: "absolute", bottom: 0, right: expanded === i ? 20 : -120,
                width: expanded === i ? "clamp(130px,13vw,190px)" : 0,
                height: expanded === i ? "clamp(170px,17vw,250px)" : 0,
                opacity: expanded === i ? 1 : 0,
                transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
                mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"],
                pointerEvents: "none",
              }}>
                {expanded === i && <Image src={c.mascot} alt={c.mascotName} fill style={{ objectFit: "contain", objectPosition: "bottom" }} sizes="190px" />}
              </div>

              {/* Collapse hint */}
              <div style={{ position: "absolute", bottom: 12, left: expanded === i ? -100 : 20, fontFamily: "'DM Mono',monospace", fontSize: 8, color: C.dim, opacity: expanded === i ? 0 : 0.25, transition: "all 0.3s ease" }}>Click to expand</div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGO WALL — All 10 brand logos as images, lighten blended
   ═══════════════════════════════════════════════════════════════ */
function LogoWall() {
  const [ref, vis] = useInView(0.05);
  return (
    <section ref={ref} style={{ padding: "100px 6vw", background: C.base, position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <R><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Brand Identities</div></R>
        <R delay={0.1}><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 400, color: C.cream }}>The <em style={{ color: C.gold }}>Empire.</em></h2></R>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, maxWidth: 1200, margin: "0 auto" }}>
        {BRANDS.map((b, i) => (
          <R key={b.name} delay={0.03 * i}>
            <div style={{
              position: "relative", aspectRatio: "1/1",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 20,
              opacity: vis ? 1 : 0, transform: vis ? "scale(1)" : "scale(0.9)",
              transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.04 * i}s`,
              mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"],
            }}>
              <Image src={b.logo} alt={b.name} fill style={{ objectFit: "contain", padding: 16 }} sizes="220px" />
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MASCOT PARADE — All characters, lighten blend on black bg
   ═══════════════════════════════════════════════════════════════ */
function MascotParade() {
  const [ref, vis] = useInView(0.05);
  const mascots = [
    { img: "/images/mascot-loudini.png", name: "Loudini", brand: "Angel Wings" },
    { img: "/images/mascot-beanzo.png", name: "Beanzo", brand: "Espresso Co" },
    { img: "/images/mascot-mojo.png", name: "Mojo", brand: "Mojo Juice" },
    { img: "/images/mascot-eggavier.png", name: "Eggavier", brand: "Morning After" },
    { img: "/images/mascot-scrambalina.png", name: "Scrambalina", brand: "Morning After" },
    { img: "/images/mascot-mr-miss-oyster.png", name: "Mr. & Miss", brand: "Mr. Oyster" },
    { img: "/images/mascot-mac-daddy.png", name: "Mac Daddy", brand: "Pasta Bish" },
    { img: "/images/mascot-lil-linguine.png", name: "Lil Linguine", brand: "Pasta Bish" },
    { img: "/images/mascot-paddy-daddy.png", name: "Paddy Daddy", brand: "Patty Daddy" },
    { img: "/images/mascot-baby-bunz.png", name: "Baby Bunz", brand: "Patty Daddy" },
    { img: "/images/mascot-sweet-tooth.png", name: "Sweet Tooth", brand: "Sweet Tooth" },
    { img: "/images/mascot-king-kale.png", name: "King Kale", brand: "Toss'd" },
    { img: "/images/mascot-sista-greens.png", name: "Sista Greens", brand: "Toss'd" },
    { img: "/images/mascot-lenny-lettuce.png", name: "Lenny", brand: "Toss'd" },
    { img: "/images/mascot-yaki.png", name: "Yaki", brand: "Taco Yaki" },
  ];
  return (
    <section ref={ref} style={{ padding: "100px 6vw", background: C.deep, position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <R><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Meet The Cast</div></R>
        <R delay={0.1}><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 400, color: C.cream }}>The <em style={{ color: C.gold }}>Characters.</em></h2></R>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, maxWidth: 1200, margin: "0 auto" }}>
        {mascots.map((m, i) => (
          <R key={m.name} delay={0.03 * i}>
            <div style={{ textAlign: "center", opacity: vis ? 1 : 0, transition: `all 0.6s ease ${0.04 * i}s` }}
              onMouseEnter={e => { const el = e.currentTarget.querySelector(".m-img") as HTMLElement; if (el) el.style.transform = "translateY(-8px) scale(1.04)"; }}
              onMouseLeave={e => { const el = e.currentTarget.querySelector(".m-img") as HTMLElement; if (el) el.style.transform = "translateY(0) scale(1)"; }}
            >
              <div className="m-img" style={{
                position: "relative", width: "100%", aspectRatio: "3/4",
                mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"],
                transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <Image src={m.img} alt={m.name} fill style={{ objectFit: "contain", objectPosition: "bottom" }} sizes="220px" />
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(11px,1.1vw,15px)", color: C.cream, marginTop: 6 }}>{m.name}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, letterSpacing: "0.2em", color: C.dim, marginTop: 2 }}>{m.brand}</div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
function Proof() {
  const stats = [{ v: "10", u: "", l: "Concepts" }, { v: "8", u: "+", l: "Cities" }, { v: "50", u: "K+", l: "Guests" }, { v: "∞", u: "", l: "Ambition" }];
  return (
    <section style={{ padding: "140px 6vw", background: C.base, position: "relative", overflow: "hidden" }}>
      {[25, 50, 75].map(p => <div key={p} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: 1, background: C.steel }} />)}
      <R><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,8vw,120px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.9, color: C.cream, margin: "0 0 80px" }}>Scale.</h2></R>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", position: "relative", zIndex: 1 }}>
        {stats.map((s, i) => (
          <R key={s.l} delay={0.08 + i * 0.08}><div style={{ padding: "40px 20px 40px 0" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,6vw,80px)", fontWeight: 400, color: C.gold, lineHeight: 1 }}>{s.v}<span style={{ fontSize: "clamp(14px,1.5vw,20px)", fontFamily: "'DM Mono',monospace", marginLeft: 2, color: C.dim }}>{s.u}</span></div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: C.dim, marginTop: 12 }}>{s.l}</div>
          </div></R>
        ))}
      </div>
    </section>
  );
}

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
            background: hov === i ? C.burgundy : "transparent", transition: "all 0.4s ease", cursor: "default",
          }}><span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px,1.8vw,24px)", fontWeight: 400, color: hov === i ? C.cream : C.silver, transition: "color 0.3s" }}>{c}</span></div>
        ))}
      </div></R>
    </section>
  );
}

function Partnership() {
  return (
    <section style={{ minHeight: "70vh", background: C.base, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-3vw", top: "50%", transform: "translateY(-50%)", fontFamily: "'Playfair Display',serif", fontSize: "clamp(100px,18vw,260px)", fontWeight: 700, fontStyle: "italic", color: C.steel, opacity: 0.12, whiteSpace: "nowrap" }}>Invest</div>
      <div style={{ padding: "100px 6vw", position: "relative", zIndex: 1, maxWidth: "55vw", marginLeft: "auto" }}>
        <R><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 32, height: 1, background: C.gold, display: "inline-block" }} />Franchise &amp; Partnership</div></R>
        <R delay={0.1}><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 400, lineHeight: 1.05, color: C.cream, margin: "0 0 24px" }}>Build with the<br /><em style={{ color: C.gold }}>Casper universe.</em></h2></R>
        <R delay={0.2}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: C.silver, opacity: 0.5, maxWidth: 400, marginBottom: 40 }}>Franchise opportunities, white-label kitchen partnerships, and strategic joint ventures.</p></R>
        <R delay={0.3}><a href="#contact" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.base, background: C.gold, padding: "14px 36px", textDecoration: "none", display: "inline-block", transition: "all 0.4s" }} onMouseEnter={e => { (e.target as HTMLElement).style.background = C.cream; }} onMouseLeave={e => { (e.target as HTMLElement).style.background = C.gold; }}>Partner With Us</a></R>
      </div>
    </section>
  );
}

function Conversion() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="contact" style={{ minHeight: "70vh", background: C.deep, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
      {/* Casper logo watermark — lighten blend */}
      <div style={{ position: "absolute", right: "6vw", top: "50%", transform: "translateY(-50%)", width: "clamp(200px,25vw,350px)", height: "clamp(200px,25vw,350px)", opacity: 0.06, mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"] }}>
        <Image src="/images/casper-logo-white.png" alt="" fill style={{ objectFit: "contain" }} sizes="350px" />
      </div>
      <div style={{ padding: "100px 6vw", position: "relative", zIndex: 1 }}>
        <R><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,10vw,140px)", fontWeight: 400, lineHeight: 0.88, color: C.cream, margin: "0 0 48px" }}>Join the<br /><em style={{ color: C.gold }}>Empire.</em></h2></R>
        <R delay={0.15}><div style={{ maxWidth: 480 }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.7, color: C.silver, opacity: 0.5, marginBottom: 36 }}>Openings, events, private dining, and franchise updates.</p>
          {!done ? (
            <div style={{ display: "flex", border: `1px solid ${C.steel}` }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, padding: "16px 20px", fontFamily: "'DM Mono',monospace", fontSize: 13, border: "none", outline: "none", background: "transparent", color: C.cream }} />
              <button onClick={() => email && setDone(true)} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 28px", background: C.burgundy, color: C.cream, border: "none", cursor: "pointer", transition: "background 0.3s" }} onMouseEnter={e => { (e.target as HTMLElement).style.background = C.gold; (e.target as HTMLElement).style.color = C.base; }} onMouseLeave={e => { (e.target as HTMLElement).style.background = C.burgundy; (e.target as HTMLElement).style.color = C.cream; }}>Join</button>
            </div>
          ) : <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontStyle: "italic", color: C.gold }}>Welcome to the empire.</div>}
        </div></R>
      </div>
    </section>
  );
}

function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => { const fn = () => setS(window.scrollY > 80); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "22px 6vw", display: "flex", justifyContent: "space-between", alignItems: "center", background: s ? `${C.base}F2` : "transparent", backdropFilter: s ? "blur(24px)" : "none", borderBottom: s ? `1px solid ${C.steel}` : "1px solid transparent", transition: "all 0.5s ease" }}>
      {/* Nav logo — white ghost mark, lighten blend */}
      <div style={{ width: 28, height: 28, mixBlendMode: s ? "normal" as React.CSSProperties["mixBlendMode"] : "lighten" as React.CSSProperties["mixBlendMode"], position: "relative" }}>
        <Image src="/images/casper-logo-white.png" alt="Casper" fill style={{ objectFit: "contain" }} sizes="28px" />
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {["Concepts", "Cities", "Careers"].map(i => <a key={i} href="#" className="nav-hide" style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.dim, textDecoration: "none", transition: "color 0.3s" }} onMouseEnter={e => { (e.target as HTMLElement).style.color = C.cream; }} onMouseLeave={e => { (e.target as HTMLElement).style.color = C.dim; }}>{i}</a>)}
        <a href="#contact" style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: C.base, background: C.gold, padding: "8px 18px", textDecoration: "none", transition: "all 0.3s" }} onMouseEnter={e => { (e.target as HTMLElement).style.background = C.cream; }} onMouseLeave={e => { (e.target as HTMLElement).style.background = C.gold; }}>Connect</a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.base, padding: "56px 6vw 40px", borderTop: `1px solid ${C.steel}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 24, height: 24, position: "relative", mixBlendMode: "lighten" as React.CSSProperties["mixBlendMode"] }}>
            <Image src="/images/casper-logo-white.png" alt="" fill style={{ objectFit: "contain" }} sizes="24px" />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.cream, letterSpacing: "0.1em" }}>Casper Group Worldwide</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: C.dim, opacity: 0.3 }}>&copy; 2026 &mdash; A Kollective Hospitality Group Brand</div>
          </div>
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
          div[style*="repeat(5"]{grid-template-columns:repeat(3,1fr)!important}
          div[style*="repeat(4"]{grid-template-columns:1fr 1fr!important}
          div[style*="repeat(2, 1fr)"]{grid-template-columns:1fr!important}
          .nav-hide{display:none}
        }
      `}</style>
      <Grain />
      <Nav />
      <Hero />
      <ConceptWall />
      <LogoWall />
      <MascotParade />
      <Proof />
      <Cities />
      <Partnership />
      <Conversion />
      <Footer />
    </main>
  );
}
