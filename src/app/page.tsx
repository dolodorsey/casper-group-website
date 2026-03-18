"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// CASPER GROUP V3 — "DARK APPETITE"
// Award-level restaurant empire site.
// Hero: CASPER_ani.mov (casper-ani.mp4) fullscreen with edge-color matching
// Signature interaction: Brand portal grid with portal art gateways
// Palette: near-black (#0d0f0e) / cream / burgundy / gold
// Typography: Playfair Display (display) + DM Sans (body) + DM Mono (labels)
// ═══════════════════════════════════════════════════════════════════════════════

const C = {
  bg:          "#0d0f0e",
  base:        "#0f0d0b",
  dark:        "#090807",
  surface:     "#151311",
  surface2:    "#1a1715",
  cream:       "#F6F0E7",
  gold:        "#D89A2B",
  goldDim:     "rgba(216,154,43,0.15)",
  burgundy:    "#5E1F24",
  burgundyGlow:"rgba(94,31,36,0.20)",
  silver:      "#B9BDC7",
  muted:       "rgba(246,240,231,0.50)",
  dim:         "rgba(246,240,231,0.12)",
  border:      "rgba(246,240,231,0.06)",
  orange:      "#C85A1A",
};

const F = {
  serif: "'Playfair Display', Georgia, serif",
  sans:  "'DM Sans', system-ui, sans-serif",
  mono:  "'DM Mono', monospace",
};

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold, rootMargin: "60px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, v] as const;
}

function Reveal({ children, delay = 0, y = 50 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{
      transform: v ? "translateY(0)" : `translateY(${y}px)`,
      opacity: v ? 1 : 0,
      transition: `all 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const Grain = ({ opacity = 0.03 }: { opacity?: number }) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />
);

const Divider = () => (
  <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 clamp(32px,5vw,80px)" }}>
    <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.border}, ${C.gold}22, ${C.border}, transparent)` }} />
  </div>
);

const BRANDS = [
  { name: "Angel Wings", type: "Wings", logo: "/images/logo-angel-wings.png", portal: "/images/portal-angel-wings.jpeg", food: ["/images/angel-wings-plate.jpg"], accent: "#C85A1A", bg: "#1a1008", tagline: "Heaven-sent heat.", desc: "Atlanta-style lemon pepper wings built for mass demand and ghost kitchen velocity. Every wing gets the halo treatment — sauced, tossed, and served with divine crunch.", url: "https://angel-wings-website.vercel.app" },
  { name: "Tha Morning After", type: "Breakfast", logo: "/images/logo-morning-after.png", portal: "/images/portal-morning-after.jpeg", food: ["/images/morning-french-toast.jpg", "/images/morning-sandwiches.jpg"], accent: "#D89A2B", bg: "#1a1608", tagline: "Wake up legendary.", desc: "Creative breakfast culture engineered for craveability and all-day repeat traffic. French toast that makes you forget last night.", url: "#" },
  { name: "Patty Daddy", type: "Burgers", logo: "/images/logo-patty-daddy.png", portal: "/images/portal-patty-daddy.jpeg", food: ["/images/patty-smashburger.jpg", "/images/patty-sliders.jpg"], accent: "#D89A2B", bg: "#18120a", tagline: "Bigger. Bolder. Daddy.", desc: "Larger-than-life burger concept with bold personality and franchise-ready systems. Smashed patties, towers of flavor.", url: "#" },
  { name: "Espresso Co.", type: "Coffee Lab", logo: "/images/logo-espresso-co.png", portal: "/images/portal-espresso.jpeg", food: ["/images/espresso-lab.png", "/images/espresso-latte.png"], accent: "#8A6A3A", bg: "#15120a", tagline: "Science of the perfect cup.", desc: "Modern coffee culture meets lab precision. Every pour is an experiment. Every sip is the result.", url: "https://espresso-co-website.vercel.app" },
  { name: "Mojo Juice", type: "Juice & Smoothies", logo: "/images/logo-mojo-juice.png", portal: "/images/portal-mojo.jpeg", food: ["/images/mojo-smoothie.png"], accent: "#4A8A3A", bg: "#0e1608", tagline: "Fuel the ritual.", desc: "Fresh-pressed ritual with bright wellness positioning and lifestyle brand appeal.", url: "#" },
  { name: "Mr. Oyster", type: "Seafood Bar", logo: "/images/logo-mr-oyster.png", portal: "/images/portal-mr-oyster.jpeg", food: ["/images/oyster-scallops.jpg"], accent: "#3A6A8A", bg: "#0a1018", tagline: "The deep end of flavor.", desc: "Elevated seafood with visual authority. Squid ink pasta, seared scallops, calamari towers.", url: "#" },
  { name: "Sweet Tooth", type: "Desserts", logo: "/images/logo-sweet-tooth.png", portal: "/images/portal-sweet-tooth.jpeg", food: [], accent: "#C83A8A", bg: "#180a18", tagline: "Indulgence engineered.", desc: "Dessert indulgence engineered for impulse, social virality, and high-margin volume.", url: "#" },
  { name: "Taco Yaki", type: "Fusion", logo: "/images/logo-taco-yaki.png", portal: "/images/portal-taco-yaki.png", food: ["/images/taco-platter.jpg", "/images/taco-hibachi.jpg"], accent: "#C85A1A", bg: "#1a1008", tagline: "East meets west. Fire meets grill.", desc: "Fusion tacos meet hibachi heat. Wood-fired tortillas loaded with global flavors.", url: "#" },
  { name: "Toss'd", type: "Healthy Bowls", logo: "/images/logo-tossd.png", portal: "/images/portal-tossd.jpeg", food: [], accent: "#4A8A3A", bg: "#0e1608", tagline: "Fresh. Fast. No excuses.", desc: "Fresh bowls and salads with speed, simplicity, and wellness-forward brand identity.", url: "#" },
  { name: "Pasta Bish", type: "Pasta", logo: "/images/logo-pasta-bish.png", portal: "/images/portal-pasta-bish.jpeg", food: ["/images/pasta-fettuccine.jpg", "/images/pasta-marinara.jpg"], accent: "#C83A3A", bg: "#180808", tagline: "Comfort with attitude.", desc: "Comfort-food pasta with personality. Creamy fettuccine, proper marinara, fresh herbs.", url: "#" },
];

function Nav() {
  const [sc, setSc] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 80); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, padding: sc ? "14px clamp(24px,4vw,60px)" : "28px clamp(24px,4vw,60px)", display: "flex", justifyContent: "space-between", alignItems: "center", background: sc ? "rgba(13,15,14,0.92)" : "transparent", backdropFilter: sc ? "blur(24px) saturate(180%)" : "none", borderBottom: sc ? `1px solid ${C.border}` : "none", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
      <img src="/images/casper-logo-white.png" alt="Casper Group" style={{ height: sc ? "22px" : "28px", width: "auto", transition: "height 0.4s ease", opacity: 0.9 }} />
      <div style={{ display: "flex", gap: "clamp(20px,3vw,40px)", alignItems: "center" }}>
        {["Brands", "Story", "Franchise"].map(n => (
          <a key={n} href={`#${n.toLowerCase()}`} style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 400, letterSpacing: "0.25em", textTransform: "uppercase", color: C.silver, textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = C.cream}
            onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = C.silver}
          >{n}</a>
        ))}
        <a href="#franchise" style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: C.bg, background: C.gold, padding: "10px 28px", textDecoration: "none", transition: "all 0.3s" }}>Inquire</a>
      </div>
    </nav>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Left accent image — subtle, just so sides aren't blank */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "25%", zIndex: 0, overflow: "hidden" }}>
        <img src="/images/casper-background.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", opacity: 0.2, filter: "brightness(0.4) saturate(0.5)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.bg}44 0%, ${C.bg} 100%)` }} />
      </div>
      {/* Right accent image — mirrored */}
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "25%", zIndex: 0, overflow: "hidden" }}>
        <img src="/images/casper-background.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", opacity: 0.2, filter: "brightness(0.4) saturate(0.5)", transform: "scaleX(-1)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to left, ${C.bg}44 0%, ${C.bg} 100%)` }} />
      </div>
      {/* MAIN ANIMATION — center focus, as big as possible without stretching */}
      <video src="/videos/casper-ani.mp4" autoPlay muted loop playsInline onLoadedData={() => setLoaded(true)}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", objectPosition: "center center", opacity: loaded ? 1 : 0, transition: "opacity 1.6s ease", zIndex: 2 }} />
      {/* Soft vignette top/bottom only — no side gradients blocking animation */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "12%", zIndex: 3, pointerEvents: "none", background: `linear-gradient(to bottom, ${C.bg} 0%, transparent 100%)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "12%", zIndex: 3, pointerEvents: "none", background: `linear-gradient(to top, ${C.bg} 0%, transparent 100%)` }} />
      <Grain opacity={0.02} />
      <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: loaded ? 0.35 : 0, transition: "opacity 1.2s ease 3s", zIndex: 10 }}>
        <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.cream }}>Scroll</div>
        <div style={{ width: "1px", height: "40px", background: `linear-gradient(180deg, ${C.gold}, transparent)` }} />
      </div>
    </section>
  );
}

function Thesis() {
  return (
    <section style={{ background: C.bg, padding: "clamp(80px,10vh,140px) clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.05 }}>
        <img src="/images/casper-kitchen.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(0.4)" }} />
      </div>
      <Grain opacity={0.02} />
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(48px,6vw,120px)", alignItems: "start" }}>
        <Reveal>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
              The Empire
            </div>
            <h2 style={{ fontFamily: F.serif, fontSize: "clamp(40px,5.5vw,76px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.92, letterSpacing: "-0.02em", color: C.cream, margin: 0 }}>
              Ten brands.<br /><span style={{ color: C.gold }}>One kitchen.</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div style={{ paddingTop: "clamp(8px,2vw,40px)" }}>
            <p style={{ fontFamily: F.sans, fontSize: "clamp(15px,1.3vw,18px)", lineHeight: 1.85, color: C.muted, marginBottom: "28px" }}>
              Casper Group is a multi-concept restaurant empire — ten distinct food brands operating from shared infrastructure. Every brand has its own identity, its own mascot, and its own lane. But behind the scenes, they all run on one system built for ghost kitchens, franchising, and scale.
            </p>
            <p style={{ fontFamily: F.sans, fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.85, color: "rgba(246,240,231,0.35)" }}>
              From Atlanta to Houston to Charlotte — Casper Group is building the future of multi-brand food operations. Wings, burgers, breakfast, pasta, seafood, coffee, juice, fusion, desserts, and salads. Every daypart. Every craving. One empire.
            </p>
          </div>
        </Reveal>
      </div>
      <div style={{ maxWidth: "1200px", margin: "clamp(56px,6vh,96px) auto 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2px", background: C.border }}>
        {[["10+", "Concepts"], ["15", "Original Mascots"], ["3+", "Active Markets"], ["∞", "Ghost Kitchen Ready"]].map(([val, label], i) => (
          <Reveal key={label} delay={0.1 * i}>
            <div style={{ background: C.bg, padding: "clamp(28px,3vh,48px) clamp(20px,2vw,36px)", textAlign: "center" }}>
              <div style={{ fontFamily: F.serif, fontSize: "clamp(28px,3.5vw,52px)", fontStyle: "italic", color: C.gold, lineHeight: 1 }}>{val}</div>
              <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.4em", textTransform: "uppercase", color: C.muted, marginTop: "10px" }}>{label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BrandPortals() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <section id="brands" style={{ background: C.bg, paddingBottom: 0 }}>
      <div style={{ padding: "clamp(80px,10vh,120px) clamp(32px,5vw,80px) clamp(40px,5vh,64px)", maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
            Brand Portfolio
          </div>
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.92, color: C.cream }}>
            Enter the Universe
          </h2>
        </Reveal>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px", background: C.border }}>
        {BRANDS.map((b, i) => (
          <div key={b.name} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} onClick={() => { if (b.url && b.url !== "#") { window.open(b.url, "_blank"); } else { setExpanded(expanded === i ? null : i); } }}
            style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", cursor: "pointer", background: b.bg }}>
            <img src={b.portal} alt={b.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease", transform: hovered === i ? "scale(1.08)" : "scale(1)", filter: hovered === i ? "brightness(1.15) saturate(1.1)" : "brightness(0.75) saturate(0.9)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: b.accent, opacity: hovered === i ? 1 : 0, transition: "opacity 0.3s ease", zIndex: 5 }} />
            <div style={{ position: "absolute", top: "14px", right: "14px", zIndex: 5, fontFamily: F.mono, fontSize: "7px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "5px 10px" }}>{b.type}</div>
            {/* Brand LOGO centered on card */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", width: "70%", pointerEvents: "none" }}>
              <img src={b.logo} alt={b.name} style={{ width: "100%", maxHeight: "120px", objectFit: "contain", filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.8))", opacity: 0.9, transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)", transform: hovered === i ? "scale(1.1)" : "scale(1)", mixBlendMode: "lighten" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 18px", zIndex: 5 }}>
              <div style={{ fontFamily: F.serif, fontSize: "clamp(14px,1.4vw,20px)", fontStyle: "italic", color: "#fff", lineHeight: 1.1, marginBottom: "4px", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>{b.name}</div>
              <div style={{ fontFamily: F.sans, fontSize: "10px", color: "rgba(255,255,255,0.4)", lineHeight: 1.3, opacity: hovered === i ? 1 : 0, transform: hovered === i ? "translateY(0)" : "translateY(6px)", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)" }}>{b.tagline}</div>
            </div>
          </div>
        ))}
      </div>
      {expanded !== null && (() => {
        const b = BRANDS[expanded];
        return (
          <div style={{ background: b.bg, borderTop: `2px solid ${b.accent}`, padding: "clamp(48px,5vh,72px) clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
            <Grain opacity={0.03} />
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${b.accent}15, transparent 60%)` }} />
            <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(32px,4vw,64px)", alignItems: "start" }}>
                <div style={{ width: "clamp(80px,8vw,120px)" }}><img src={b.logo} alt={b.name} style={{ width: "100%", height: "auto", filter: "brightness(1.1)", mixBlendMode: "lighten" }} /></div>
                <div>
                  <h3 style={{ fontFamily: F.serif, fontSize: "clamp(28px,3.5vw,48px)", fontStyle: "italic", fontWeight: 400, color: C.cream, margin: "0 0 8px", lineHeight: 1 }}>{b.name}</h3>
                  <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: b.accent, marginBottom: "20px" }}>{b.type} — {b.tagline}</div>
                  <p style={{ fontFamily: F.sans, fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.8, color: C.muted, maxWidth: "640px" }}>{b.desc}</p>
                </div>
              </div>
              {b.food.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: b.food.length > 1 ? "1fr 1fr" : "1fr", gap: "3px", marginTop: "36px" }}>
                  {b.food.map((img, fi) => (
                    <div key={fi} style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9", background: "#0a0a0a" }}>
                      <img src={img} alt={`${b.name} food`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.9) contrast(1.05) saturate(1.1)" }} />
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${b.accent}10, transparent 60%)`, pointerEvents: "none" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setExpanded(null)} style={{ position: "absolute", top: "20px", right: "clamp(24px,4vw,60px)", background: "none", border: `1px solid ${C.border}`, color: C.muted, fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 20px", cursor: "pointer", zIndex: 10 }}>Close ×</button>
          </div>
        );
      })()}
    </section>
  );
}

function FoodGallery() {
  const foods = [
    { src: "/images/angel-wings-plate.jpg", brand: "Angel Wings" },
    { src: "/images/patty-smashburger.jpg", brand: "Patty Daddy" },
    { src: "/images/oyster-scallops.jpg", brand: "Mr. Oyster" },
    { src: "/images/mojo-smoothie.png", brand: "Mojo Juice" },
    { src: "/images/pasta-marinara.jpg", brand: "Pasta Bish" },
    { src: "/images/taco-platter.jpg", brand: "Taco Yaki" },
    { src: "/images/morning-french-toast.jpg", brand: "Morning After" },
    { src: "/images/espresso-latte.png", brand: "Espresso Co." },
    { src: "/images/taco-hibachi.jpg", brand: "Taco Yaki" },
    { src: "/images/pasta-fettuccine.jpg", brand: "Pasta Bish" },
    { src: "/images/morning-sandwiches.jpg", brand: "Morning After" },
    { src: "/images/food/green-juice-splash.png", brand: "Mojo Juice" },
  ];
  return (
    <section style={{ background: C.bg, padding: "clamp(80px,10vh,120px) 0", position: "relative" }}>
      <Grain opacity={0.02} />
      {/* Section background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.06 }}>
        <img src="/images/casper-background.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4) saturate(0.5)" }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, padding: "0 clamp(32px,5vw,80px) clamp(40px,5vh,56px)", maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
            From Our Kitchens
          </div>
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.92, color: C.cream }}>Every plate tells a story</h2>
        </Reveal>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3px", padding: "0 3px" }}>
        {foods.map((f, i) => (
          <Reveal key={i} delay={0.05 * i} y={30}>
            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", background: "#0a0a0a" }}>
              <img src={f.src} alt={f.brand} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.85) contrast(1.05) saturate(1.05)", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.filter = "brightness(1) contrast(1.05) saturate(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(0.85) contrast(1.05) saturate(1.05)"; }} />
              <div style={{ position: "absolute", bottom: "12px", left: "14px", zIndex: 2, fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "4px 10px" }}>{f.brand}</div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)", pointerEvents: "none" }} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Operation() {
  return (
    <section id="story" style={{ background: C.bg, padding: "clamp(80px,10vh,140px) clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.06 }}>
        <img src="/images/casper-background.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(0.5)" }} />
      </div>
      <Grain opacity={0.02} />
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
            The Machine Behind The Brands
          </div>
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.92, color: C.cream, marginBottom: "clamp(40px,5vh,64px)" }}>
            Built to scale.<br /><span style={{ color: C.gold }}>Built to last.</span>
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3px" }}>
          <Reveal><div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", background: "#0a0a0a" }}>
            <img src="/images/casper-kitchen.png" alt="Casper Group Kitchen" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.9) contrast(1.05)" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${C.bg}44, transparent 40%)`, pointerEvents: "none" }} />
          </div></Reveal>
          <Reveal delay={0.1}><div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", background: "#0a0a0a" }}>
            <img src="/images/casper-team.png" alt="Casper Group Team" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.95) contrast(1.05)" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to left, ${C.bg}44, transparent 40%)`, pointerEvents: "none" }} />
          </div></Reveal>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px", marginTop: "2px", background: C.border }}>
          {[
            { title: "Shared Infrastructure", desc: "One supply chain, one kitchen system, ten brands running simultaneously. Maximum efficiency." },
            { title: "Ghost Kitchen Native", desc: "Every brand is designed for delivery-first. Low overhead, high velocity, scalable anywhere." },
            { title: "Franchise Ready", desc: "Turnkey systems for operators. Training, supply, branding, tech — all built and documented." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={0.1 * i}><div style={{ background: C.bg, padding: "clamp(28px,3vh,48px) clamp(20px,2vw,32px)", borderTop: `2px solid ${C.gold}22` }}>
              <div style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gold, marginBottom: "14px" }}>{item.title}</div>
              <p style={{ fontFamily: F.sans, fontSize: "13px", lineHeight: 1.75, color: C.muted, margin: 0 }}>{item.desc}</p>
            </div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCasper() {
  return (
    <section style={{ background: C.bg, padding: "clamp(80px,10vh,120px) clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.05 }}>
        <img src="/images/casper-team.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.25) saturate(0.4)" }} />
      </div>
      <Grain opacity={0.02} />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "clamp(56px,6vh,80px)" }}>
            <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "16px" }}>The Power Platform</div>
            <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.92, color: C.cream }}>Why Casper Group</h2>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px", background: C.border }}>
          {[
            { title: "Our Brands", color: C.burgundy, items: ["10+ distinct restaurant concepts", "Original mascot IP per brand", "Multi-daypart coverage built in", "Shared operational infrastructure"] },
            { title: "Our Markets", color: C.gold, items: ["Atlanta — Flagship", "Houston — Active expansion", "Charlotte — Growing demand", "Nationwide ghost kitchen network"] },
            { title: "Our Advantage", color: C.orange, items: ["Franchise-ready systems", "Dual kitchen operating model", "Proprietary mascot IP library", "Central supply chain + support"] },
          ].map((col, ci) => (
            <Reveal key={col.title} delay={0.1 * ci}><div style={{ background: C.bg, padding: "clamp(36px,4vh,56px) clamp(24px,2.5vw,40px)", height: "100%", borderTop: `2px solid ${col.color}` }}>
              <div style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: col.color, marginBottom: "28px" }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {col.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: col.color, flexShrink: 0, marginTop: "8px" }} />
                    <span style={{ fontFamily: F.sans, fontSize: "14px", lineHeight: 1.65, color: C.muted }}>{item}</span>
                  </div>
                ))}
              </div>
            </div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FranchiseCTA() {
  return (
    <section id="franchise" style={{ background: C.bg, padding: "clamp(100px,12vh,160px) clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.07 }}>
        <img src="/images/lifestyle/casper-kitchen-crew.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(0.4)" }} />
      </div>
      <Grain opacity={0.03} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 50%, ${C.burgundyGlow}, transparent 50%), radial-gradient(ellipse at 70% 50%, ${C.goldDim}, transparent 50%)` }} />
      <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <Reveal>
          <img src="/images/casper-logo-white.png" alt="Casper Group" style={{ height: "44px", margin: "0 auto 36px", display: "block", opacity: 0.6 }} />
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5.5vw,76px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.0, color: C.cream, marginBottom: "20px" }}>Own a Casper brand.</h2>
          <p style={{ fontFamily: F.sans, fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.85, color: C.muted, maxWidth: "520px", margin: "0 auto 44px" }}>
            Operators, landlords, and strategic partners — Casper Group has a franchise path built for velocity, scale, and cultural relevance in every market.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:info@caspergroupworldwide.com?subject=Franchise Inquiry" style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: C.bg, background: C.gold, padding: "16px 48px", textDecoration: "none", transition: "all 0.3s" }}>Start Franchise Inquiry</a>
            <a href="mailto:info@caspergroupworldwide.com?subject=Partnership" style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: C.cream, background: "transparent", border: `1px solid ${C.border}`, padding: "16px 36px", textDecoration: "none", transition: "all 0.3s" }}>Operator Partnership</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.dark, borderTop: `1px solid ${C.border}`, padding: "64px clamp(32px,5vw,80px) 40px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3,1fr)", gap: "48px", marginBottom: "56px" }}>
          <div>
            <img src="/images/casper-logo-white.png" alt="Casper Group" style={{ height: "32px", marginBottom: "16px", display: "block", opacity: 0.7 }} />
            <p style={{ fontFamily: F.sans, fontSize: "13px", lineHeight: 1.75, color: "rgba(246,240,231,0.35)" }}>10+ concepts. 15 original characters.<br />One infrastructure built to scale.</p>
          </div>
          {[
            { h: "Brands", l: BRANDS.map(b => b.name) },
            { h: "Company", l: ["About Us", "Locations", "Franchise", "Ghost Kitchen", "Press"] },
            { h: "Contact", l: ["info@caspergroupworldwide.com", "Franchise Inquiry", "Landlord Inquiry", "Media & Press"] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: F.mono, fontSize: "8px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: "18px" }}>{col.h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>{col.l.map(item => <div key={item} style={{ fontFamily: F.sans, fontSize: "12px", color: "rgba(246,240,231,0.3)" }}>{item}</div>)}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontFamily: F.mono, fontSize: "9px", color: "rgba(246,240,231,0.15)" }}>© 2026 Casper Group. A KHG Enterprise.</div>
          <div style={{ display: "flex", gap: "24px" }}>{["Privacy", "Terms"].map(item => <span key={item} style={{ fontFamily: F.mono, fontSize: "9px", color: "rgba(246,240,231,0.15)", cursor: "pointer" }}>{item}</span>)}</div>
        </div>
      </div>
    </footer>
  );
}

export default function CasperGroupV3() {
  return (
    <div style={{ background: C.bg }}>
      <Nav />
      <Hero />
      <Thesis />
      <Divider />
      <BrandPortals />
      <FoodGallery />
      <Divider />
      <Operation />
      <Divider />
      <WhyCasper />
      <FranchiseCTA />
      <Footer />
    </div>
  );
}
