"use client";
import { useState, useEffect, useRef } from "react";

// ─── DESIGN SYSTEM — CASPER GROUP V2 ─────────────────────────────────────────
// Aesthetic: "Dark Appetite" — luxury fast-casual empire meets cinematic mascot world
// Palette: near-black / cream / deep burgundy / gold / silver
// Signature interaction: mascot-forward brand cards (mascot IS the visual, not a thumbnail)
// Hero: casper-logo.mp4 FILLS 100vh 100vw — animation IS the homescreen

const C = {
  base:        "#0f0d0b",
  dark:        "#090807",
  surface:     "#161310",
  surface2:    "#1c1814",
  cream:       "#F6F0E7",
  gold:        "#D89A2B",
  goldDim:     "rgba(216,154,43,0.18)",
  burgundy:    "#5E1F24",
  burgundyGlow:"rgba(94,31,36,0.22)",
  silver:      "#B9BDC7",
  muted:       "rgba(246,240,231,0.45)",
  dim:         "rgba(246,240,231,0.12)",
  border:      "rgba(246,240,231,0.07)",
  orange:      "#C85A1A",
};

const F = {
  serif: "'Playfair Display', Georgia, serif",
  sans:  "'DM Sans', system-ui, sans-serif",
  mono:  "'DM Mono', monospace",
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, v] as const;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{
      transform: v ? "translateY(0)" : "translateY(40px)",
      opacity: v ? 1 : 0,
      transition: `all 1.0s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const Grain = ({ opacity = 0.03 }: { opacity?: number }) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
    opacity,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }} />
);

// ─── BRAND DATA ───────────────────────────────────────────────────────────────
const BRANDS = [
  {
    name: "Angel Wings",       type: "Wings",     slug: "angel-wings",
    logo: "/images/logo-angel-wings.png",
    video: "/videos/angel-wings.mp4",
    mascot: "/images/mascot-loudini.png",       mascotName: "LOUDINI",
    accent: "#C85A1A",         bg: "#1a1008",
    desc: "Atlanta-style lemon pepper wings built for mass demand and ghost kitchen velocity.",
    heroImg: "/images/angel-wings-hero.jpg",
  },
  {
    name: "Tha Morning After", type: "Breakfast", slug: "morning-after",
    logo: "/images/logo-morning-after.png",
    video: null,
    mascot: "/images/mascot-eggavier.png",      mascotName: "EGGAVIER",
    accent: "#D89A2B",         bg: "#1a1608",
    desc: "Creative breakfast culture engineered for craveability and all-day repeat traffic.",
    heroImg: "/images/morning-after-hero.jpg",
  },
  {
    name: "Patty Daddy",       type: "Burgers",   slug: "patty-daddy",
    logo: "/images/logo-patty-daddy.png",
    video: "/videos/patty-daddy.mp4",
    mascot: "/images/mascot-paddy-daddy.png",   mascotName: "PADDY DADDY",
    accent: "#D89A2B",         bg: "#18120a",
    desc: "Larger-than-life burger concept with bold personality and franchise-ready systems.",
    heroImg: "/images/patty-daddy-hero.jpg",
  },
  {
    name: "Espresso Co.",      type: "Coffee",    slug: "espresso-co",
    logo: "/images/logo-espresso-co.png",
    video: "/videos/espresso-co.mp4",
    mascot: "/images/mascot-beanzo.png",        mascotName: "BEANZO",
    accent: "#8A6A3A",         bg: "#15120a",
    desc: "Modern coffee culture driving premium everyday traffic and high repeat frequency.",
    heroImg: "/images/espresso-machine.jpg",
  },
  {
    name: "Mojo Juice",        type: "Juice Bar", slug: "mojo-juice",
    logo: "/images/logo-mojo-juice.png",
    video: "/videos/mojo-juice.mp4",
    mascot: "/images/mascot-mojo.png",          mascotName: "MOJO",
    accent: "#4A8A3A",         bg: "#0e1608",
    desc: "Fresh-pressed ritual with bright wellness positioning and lifestyle brand appeal.",
    heroImg: "/images/mojo-juice.png",
  },
  {
    name: "Mr. Oyster",        type: "Seafood",   slug: "mr-oyster",
    logo: "/images/logo-mr-oyster.png",
    video: "/videos/mr-oyster.mp4",
    mascot: "/images/mascot-mr-miss-oyster.png", mascotName: "MR. OYSTER",
    accent: "#3A6A8A",         bg: "#0a1018",
    desc: "Elevated seafood with visual authority, strong unit economics, and premium positioning.",
    heroImg: "/images/mr-oyster.png",
  },
  {
    name: "Sweet Tooth",       type: "Desserts",  slug: "sweet-tooth",
    logo: "/images/logo-sweet-tooth.png",
    video: "/videos/sweet-tooth.mp4",
    mascot: "/images/mascot-sweet-tooth.png",   mascotName: "SWEET TOOTH",
    accent: "#C83A8A",         bg: "#180a18",
    desc: "Dessert indulgence engineered for impulse, social virality, and high-margin volume.",
    heroImg: "/images/sweet-tooth.png",
  },
  {
    name: "Taco Yaki",         type: "Fusion",    slug: "taco-yaki",
    logo: "/images/logo-taco-yaki.png",
    video: "/videos/taco-yaki.mp4",
    mascot: "/images/mascot-yaki.png",          mascotName: "YAKI",
    accent: "#C85A1A",         bg: "#1a1008",
    desc: "Fusion tacos with high-visual appeal, urban energy, and cross-cultural cravability.",
    heroImg: "/images/taco-yaki-ninja.jpg",
  },
  {
    name: "Toss'd",            type: "Healthy",   slug: "tossd",
    logo: "/images/logo-tossd.png",
    video: "/videos/tossd.mp4",
    mascot: "/images/mascot-king-kale.png",     mascotName: "KING KALE",
    accent: "#4A8A3A",         bg: "#0e1608",
    desc: "Fresh bowls and salads with speed, simplicity, and wellness-forward brand identity.",
    heroImg: "/images/tossd.png",
  },
  {
    name: "Pasta Bish",        type: "Pasta",     slug: "pasta-bish",
    logo: "/images/logo-pasta-bish.png",
    video: "/videos/pasta-bish.mp4",
    mascot: "/images/mascot-lil-linguine.png",  mascotName: "LIL LINGUINE",
    accent: "#C83A3A",         bg: "#180808",
    desc: "Comfort-food pasta with attitude, flexibility, and ghost kitchen dominance potential.",
    heroImg: "/images/pasta-bish.jpg",
  },
];

// Extra mascots not tied to a concept card
const EXTRA_MASCOTS = [
  { name: "BABY BUNZ",     src: "/images/mascot-baby-bunz.png",    brand: "Morning After" },
  { name: "MAC DADDY",     src: "/images/mascot-mac-daddy.png",    brand: "Patty Daddy" },
  { name: "SCRAMBALINA",   src: "/images/mascot-scrambalina.png",  brand: "Morning After" },
  { name: "LENNY LETTUCE", src: "/images/mascot-lenny-lettuce.png",brand: "Toss'd" },
  { name: "SISTA GREENS",  src: "/images/mascot-sista-greens.png", brand: "Toss'd" },
];

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
      padding: sc ? "12px clamp(24px,4vw,60px)" : "24px clamp(24px,4vw,60px)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: sc ? "rgba(9,8,7,0.96)" : "transparent",
      backdropFilter: sc ? "blur(24px)" : "none",
      borderBottom: sc ? `1px solid ${C.border}` : "none",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Logo — pure transparent PNG, NO background plate */}
      <img
        src="/images/casper-logo-white.png"
        alt="Casper Group"
        style={{ height: sc ? "24px" : "30px", width: "auto", transition: "height 0.4s ease" }}
      />
      <div style={{ display: "flex", gap: "clamp(16px,2.5vw,36px)", alignItems: "center" }}>
        {["Brands", "Universe", "Franchise"].map(n => (
          <a key={n} href={`#${n.toLowerCase()}`}
            style={{ fontFamily: F.sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.silver, textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = C.cream}
            onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = C.silver}
          >{n}</a>
        ))}
        <a href="#franchise" style={{
          fontFamily: F.sans, fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          color: C.dark, background: C.gold, padding: "10px 24px", textDecoration: "none", display: "inline-block",
          transition: "all 0.3s",
        }}>Inquire</a>
      </div>
    </nav>
  );
}

// ─── SCREEN 1: FULL-SCREEN VIDEO HERO ─────────────────────────────────────────
// casper-logo.mp4 FILLS 100vh edge to edge. Text floats ON the video.
// This is the homescreen. Not a panel. Not a box. THE WHOLE SCREEN.
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{
      position: "relative",
      width: "100%", height: "100vh",
      overflow: "hidden",
      background: C.dark,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      {/* ── THE VIDEO — FILLS ENTIRE SCREEN ── */}
      <video
        ref={videoRef}
        src="/videos/casper-logo.mp4"
        autoPlay muted loop playsInline
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.4s ease",
        }}
      />

      {/* ── GRADIENT LAYERS over the video ── */}
      {/* Top fade — protects nav */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(to bottom, rgba(9,8,7,0.6) 0%, transparent 100%)",
      }} />
      {/* Bottom fade — creates reading surface for copy */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
        background: "linear-gradient(to top, rgba(9,8,7,0.97) 0%, rgba(9,8,7,0.6) 50%, transparent 100%)",
      }} />
      {/* Subtle burgundy atmosphere */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 80%, ${C.burgundyGlow} 0%, transparent 50%)`,
      }} />
      <Grain opacity={0.025} />

      {/* ── HERO COPY — anchored to bottom-left ── */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "0 clamp(32px,5vw,80px) clamp(60px,7vh,96px)",
        maxWidth: "1400px", margin: "0 auto", width: "100%",
      }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase",
          color: C.gold, marginBottom: "20px",
          opacity: loaded ? 1 : 0, transition: "opacity 1s ease 0.6s",
        }}>
          Restaurant Concepts Worldwide
        </div>

        {/* Main headline — minimal, powerful */}
        <h1 style={{
          fontFamily: F.serif,
          fontSize: "clamp(52px,8.5vw,128px)",
          fontWeight: 400, fontStyle: "italic",
          lineHeight: 0.88, letterSpacing: "-0.02em",
          color: C.cream, margin: "0 0 12px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(50px)",
          transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.7s",
        }}>
          Ten worlds.
        </h1>
        <h1 style={{
          fontFamily: F.serif,
          fontSize: "clamp(52px,8.5vw,128px)",
          fontWeight: 400, fontStyle: "italic",
          lineHeight: 0.88, letterSpacing: "-0.02em",
          color: C.gold, margin: "0 0 40px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(50px)",
          transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.9s",
        }}>
          One empire.
        </h1>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: "14px", flexWrap: "wrap",
          opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1.4s",
        }}>
          <a href="#brands" style={{
            fontFamily: F.sans, fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            color: C.dark, background: C.gold, padding: "15px 44px", textDecoration: "none", display: "inline-block",
            transition: "all 0.3s",
          }}>Explore Brands</a>
          <a href="#franchise" style={{
            fontFamily: F.sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
            color: C.cream, background: "transparent", border: `1px solid rgba(246,240,231,0.2)`, padding: "15px 36px",
            textDecoration: "none", display: "inline-block", transition: "all 0.3s",
          }}>Franchise Inquiry</a>
        </div>
      </div>

      {/* Stats — bottom right corner */}
      <div style={{
        position: "absolute", bottom: "clamp(48px,6vh,80px)", right: "clamp(32px,5vw,80px)",
        display: "flex", gap: "32px", zIndex: 2,
        opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1.6s",
      }}>
        {[["10+", "Concepts"], ["15", "Mascots"], ["25+", "Markets"]].map(([v, l]) => (
          <div key={l} style={{ textAlign: "right" }}>
            <div style={{ fontFamily: F.serif, fontSize: "clamp(22px,2.5vw,36px)", fontStyle: "italic", color: C.gold, lineHeight: 1 }}>{v}</div>
            <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.35em", textTransform: "uppercase", color: C.muted, marginTop: "5px" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        opacity: loaded ? 0.4 : 0, transition: "opacity 1s ease 2.2s", zIndex: 2,
      }}>
        <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.4em", textTransform: "uppercase", color: C.cream }}>Scroll</div>
        <div style={{ width: "1px", height: "36px", background: `linear-gradient(180deg, ${C.gold}, transparent)` }} />
      </div>

      <style>{`@keyframes heroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </section>
  );
}

// ─── SCREEN 2: UNIVERSE THESIS ────────────────────────────────────────────────
function UniverseThesis() {
  return (
    <section style={{
      background: C.dark, padding: "120px clamp(32px,5vw,80px)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${C.burgundyGlow} 0%, transparent 55%)` }} />
      <Grain opacity={0.025} />
      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "80px", alignItems: "center" }}>
          <Reveal>
            <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
              The Infrastructure
            </div>
            <h2 style={{
              fontFamily: F.serif, fontSize: "clamp(36px,5.5vw,76px)",
              fontWeight: 400, fontStyle: "italic", lineHeight: 1.0,
              color: C.cream, marginBottom: "28px",
            }}>
              Not a restaurant group.<br />
              <em style={{ color: C.gold }}>A culinary universe.</em>
            </h2>
            <p style={{ fontFamily: F.sans, fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.9, color: C.muted, maxWidth: "520px", marginBottom: "40px" }}>
              Ten distinct restaurant concepts. Fifteen original mascot characters. One shared infrastructure built for franchise scale, ghost kitchen dominance, and multi-daypart ownership across every major market.
            </p>
            <div style={{ display: "flex", gap: "32px" }}>
              {[["10+", "Brand Concepts"], ["15", "IP Mascots"], ["150+", "Target Locations"], ["2", "Kitchen Models"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: F.serif, fontSize: "clamp(28px,3.5vw,48px)", fontStyle: "italic", color: C.gold, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: C.muted, marginTop: "6px" }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            {/* Ghost delivery mascot — clean, no box */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{
                position: "absolute", width: "380px", height: "380px", borderRadius: "50%",
                background: `radial-gradient(circle, ${C.burgundyGlow} 0%, transparent 70%)`,
              }} />
              <img
                src="/images/casper-ghost-scooter.png"
                alt="Casper Group Ghost Delivery"
                style={{ width: "100%", maxWidth: "420px", height: "auto", position: "relative", zIndex: 1 }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── SCREEN 3: BRAND WORLDS — MASCOT-FORWARD ──────────────────────────────────
// Each card: mascot FILLS the card. Logo floats clean top-left. NO background boxes on logo.
function BrandWorlds() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="brands" style={{ background: C.base, padding: "120px 0" }}>
      <div style={{ padding: "0 clamp(32px,5vw,80px)", maxWidth: "1400px", margin: "0 auto 56px" }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
            Brand Portfolio
          </div>
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.9, letterSpacing: "-0.02em", color: C.cream }}>
            Ten Brand Worlds
          </h2>
        </Reveal>
      </div>

      {/* 5×2 MASCOT-FORWARD GRID — full bleed, no padding */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px" }}>
        {BRANDS.map((b, i) => (
          <div
            key={b.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === i ? null : i)}
            style={{
              position: "relative", overflow: "hidden",
              height: "420px", cursor: "pointer",
              background: b.bg,
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Brand color atmosphere */}
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at 50% 30%, ${b.accent}18 0%, transparent 65%)`,
            }} />

            {/* ── MASCOT IMAGE — fills 75% of card height, bottom-anchored ── */}
            <div style={{
              position: "absolute", bottom: 0, left: "50%",
              transform: hovered === i ? "translateX(-50%) translateY(-8px) scale(1.04)" : "translateX(-50%) translateY(0) scale(1)",
              transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
              width: "85%", height: "75%",
              display: "flex", alignItems: "flex-end", justifyContent: "center",
            }}>
              <img
                src={b.mascot} alt={b.mascotName}
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }}
              />
            </div>

            {/* Bottom gradient — reading surface */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
              background: `linear-gradient(to top, ${b.bg} 0%, ${b.bg}CC 40%, transparent 100%)`,
            }} />

            {/* Top-left: logo — TRANSPARENT, NO BOX, NO BACKGROUND */}
            <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 3 }}>
              <img
                src={b.logo} alt={b.name}
                style={{ height: "36px", width: "auto", objectFit: "contain" }}
              />
            </div>

            {/* Top-right: category tag */}
            <div style={{
              position: "absolute", top: "16px", right: "16px", zIndex: 3,
              fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase",
              color: b.accent, opacity: 0.8,
            }}>
              {b.type}
            </div>

            {/* Bottom content */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", zIndex: 3 }}>
              {/* Mascot name */}
              <div style={{
                fontFamily: F.mono, fontSize: "9px", fontWeight: 700, letterSpacing: "0.25em",
                color: b.accent, marginBottom: "4px",
              }}>
                {b.mascotName}
              </div>
              {/* Brand name */}
              <div style={{
                fontFamily: F.serif, fontSize: "clamp(16px,1.8vw,22px)", fontStyle: "italic",
                color: C.cream, marginBottom: "6px", lineHeight: 1.1,
              }}>
                {b.name}
              </div>
              {/* Description — visible on hover */}
              <div style={{
                fontFamily: F.sans, fontSize: "11px", lineHeight: 1.65, color: C.muted,
                maxHeight: hovered === i ? "60px" : "0",
                overflow: "hidden", opacity: hovered === i ? 1 : 0,
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}>
                {b.desc}
              </div>
            </div>

            {/* Accent border on hover */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: b.accent,
              opacity: hovered === i ? 1 : 0,
              transition: "opacity 0.4s ease",
            }} />
          </div>
        ))}
      </div>

      {/* ── ACTIVE BRAND DEEP DIVE — brand video + mascot full reveal ── */}
      {active !== null && (
        <div style={{ margin: "3px 0 0", position: "relative", overflow: "hidden" }}>
          <div style={{
            background: BRANDS[active].bg,
            padding: "56px clamp(32px,5vw,80px)",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "48px", alignItems: "center",
            borderTop: `2px solid ${BRANDS[active].accent}`,
          }}>
            {/* Video — if available */}
            <div>
              {BRANDS[active].video ? (
                <video key={BRANDS[active].video} autoPlay muted loop playsInline
                  style={{ width: "100%", height: "auto", display: "block" }}>
                  <source src={BRANDS[active].video} type="video/mp4" />
                </video>
              ) : (
                <img src={BRANDS[active].heroImg} alt={BRANDS[active].name}
                  style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }} />
              )}
            </div>

            {/* Brand info */}
            <div>
              {/* Logo clean — no box */}
              <img src={BRANDS[active].logo} alt={BRANDS[active].name}
                style={{ height: "48px", width: "auto", marginBottom: "20px", display: "block" }} />
              <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: BRANDS[active].accent, marginBottom: "12px" }}>
                {BRANDS[active].type}
              </div>
              <h3 style={{ fontFamily: F.serif, fontSize: "clamp(28px,3.5vw,48px)", fontStyle: "italic", fontWeight: 400, color: C.cream, marginBottom: "16px" }}>
                {BRANDS[active].name}
              </h3>
              <p style={{ fontFamily: F.sans, fontSize: "14px", lineHeight: 1.8, color: C.muted, marginBottom: "28px" }}>
                {BRANDS[active].desc}
              </p>
              <a href="#franchise" style={{
                fontFamily: F.sans, fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                color: C.dark, background: BRANDS[active].accent, padding: "12px 32px",
                textDecoration: "none", display: "inline-block",
              }}>Franchise This Brand</a>
            </div>

            {/* Mascot — large, clean, no background */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", height: "300px" }}>
              <img src={BRANDS[active].mascot} alt={BRANDS[active].mascotName}
                style={{ height: "100%", width: "auto", objectFit: "contain" }} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── SCREEN 4: MASCOT UNIVERSE ────────────────────────────────────────────────
// All 15 mascots. This is Casper's #1 differentiator. Make it BIG.
function MascotUniverse() {
  // Build full mascot roster from brands + extras
  const allMascots = [
    ...BRANDS.map(b => ({ name: b.mascotName, src: b.mascot, brand: b.name, accent: b.accent })),
    ...EXTRA_MASCOTS.map(m => ({ name: m.name, src: m.src, brand: m.brand, accent: C.gold })),
  ];

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="universe" style={{
      background: C.dark, padding: "120px 0",
      position: "relative", overflow: "hidden",
    }}>
      {/* Big watermark text */}
      <div style={{
        position: "absolute", top: "5%", left: "-2%",
        fontFamily: F.serif, fontSize: "clamp(100px,18vw,260px)",
        fontStyle: "italic", fontWeight: 400, lineHeight: 1,
        color: "rgba(246,240,231,0.018)", pointerEvents: "none", whiteSpace: "nowrap",
        zIndex: 0,
      }}>
        Universe
      </div>
      <Grain opacity={0.02} />

      <div style={{ padding: "0 clamp(32px,5vw,80px)", maxWidth: "1400px", margin: "0 auto 64px", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
            Mascot IP
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
            <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5.5vw,80px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.9, color: C.cream }}>
              15 Characters.<br />
              <span style={{ color: C.gold }}>Infinite Loyalty.</span>
            </h2>
            <p style={{ fontFamily: F.sans, fontSize: "clamp(13px,1.1vw,16px)", lineHeight: 1.85, color: C.muted, maxWidth: "400px" }}>
              Each Casper brand has its own original mascot character — a proprietary IP asset that drives customer loyalty, social virality, and franchise desirability at a level no competitor can replicate.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Mascot grid — full width, cinematic */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "2px",
        position: "relative", zIndex: 1,
      }}>
        {allMascots.map((m, i) => (
          <div
            key={m.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative", overflow: "hidden",
              height: i < 5 ? "380px" : "320px",
              background: C.surface,
              cursor: "default",
            }}
          >
            {/* Accent glow on hover */}
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(circle at 50% 80%, ${m.accent}18, transparent 65%)`,
              opacity: hovered === i ? 1 : 0,
              transition: "opacity 0.5s ease",
            }} />

            {/* Mascot — large, fills cell */}
            <div style={{
              position: "absolute", bottom: "48px", left: "50%",
              transform: hovered === i
                ? "translateX(-50%) translateY(-10px) scale(1.06)"
                : "translateX(-50%) translateY(0) scale(1)",
              transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
              width: "80%", height: "75%",
              display: "flex", alignItems: "flex-end", justifyContent: "center",
            }}>
              <img
                src={m.src} alt={m.name}
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }}
              />
            </div>

            {/* Name strip at bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "12px 16px",
              background: `linear-gradient(to top, ${C.dark}CC, transparent)`,
            }}>
              <div style={{
                fontFamily: F.mono, fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.25em", textTransform: "uppercase",
                color: hovered === i ? m.accent : C.muted,
                transition: "color 0.3s", marginBottom: "2px",
              }}>
                {m.name}
              </div>
              <div style={{ fontFamily: F.sans, fontSize: "10px", color: "rgba(246,240,231,0.3)" }}>
                {m.brand}
              </div>
            </div>

            {/* Top accent line on hover */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: m.accent, opacity: hovered === i ? 1 : 0,
              transition: "opacity 0.4s ease",
            }} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SCREEN 5: FOOD GALLERY ───────────────────────────────────────────────────
function FoodGallery() {
  const images = [
    { src: "/images/food/lemon-pepper-wings.png", label: "Angel Wings", accent: "#C85A1A", wide: true },
    { src: "/images/food/premium-burger.png",      label: "Patty Daddy", accent: "#D89A2B", wide: false },
    { src: "/images/food/green-juice-splash.png",  label: "Mojo Juice",  accent: "#4A8A3A", wide: false },
    { src: "/images/food/fusion-tacos.png",        label: "Taco Yaki",   accent: "#C85A1A", wide: true },
    { src: "/images/food/breakfast-sandwich.png",  label: "Morning After",accent: "#D89A2B",wide: false },
    { src: "/images/food/fried-rice-shrimp.png",   label: "Ghost Kitchen",accent: C.gold,   wide: false },
  ];

  return (
    <section style={{
      background: C.base, padding: "120px 0",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ padding: "0 clamp(32px,5vw,80px)", maxWidth: "1400px", margin: "0 auto 56px" }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
            The Food
          </div>
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.9, color: C.cream }}>
            Flavor in<br />
            <span style={{ color: C.burgundy }}>every frame.</span>
          </h2>
        </Reveal>
      </div>

      {/* Asymmetric gallery — not a uniform grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "auto auto", gap: "3px", padding: "0 3px" }}>
        {images.map((img, i) => {
          const gridColumn = i === 0 ? "1" : i === 3 ? "2 / span 2" : undefined;
          const gridRow = i === 0 ? "1" : i === 3 ? "2" : undefined;
          return (
            <div key={i} style={{
              position: "relative", overflow: "hidden",
              height: i === 0 || i === 3 ? "480px" : "380px",
              gridColumn, gridRow,
            }}>
              <img
                src={img.src} alt={img.label} loading="lazy"
                style={{
                  width: "100%", height: "100%", objectFit: "cover", display: "block",
                  transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(9,8,7,0.6) 0%, transparent 50%)",
              }} />
              <div style={{
                position: "absolute", bottom: "20px", left: "20px",
                fontFamily: F.mono, fontSize: "9px", fontWeight: 700,
                letterSpacing: "0.3em", textTransform: "uppercase", color: img.accent,
              }}>
                {img.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── SCREEN 6: GHOST KITCHEN INFRASTRUCTURE ───────────────────────────────────
function GhostKitchen() {
  return (
    <section style={{
      background: C.surface, padding: "120px clamp(32px,5vw,80px)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 50%, ${C.burgundyGlow}, transparent 55%)` }} />
      <Grain opacity={0.02} />
      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <Reveal>
            <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
              Ghost Kitchen
            </div>
            <h2 style={{ fontFamily: F.serif, fontSize: "clamp(32px,4.5vw,64px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.0, color: C.cream, marginBottom: "24px" }}>
              Delivered<br /><span style={{ color: C.burgundy }}>with a smile.</span>
            </h2>
            <p style={{ fontFamily: F.sans, fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.85, color: C.muted, marginBottom: "40px" }}>
              Multi-brand delivery from a single kitchen. Ten concepts, one infrastructure, nationwide reach. The ghost kitchen model that gives franchisees 10x the revenue potential of a single-concept operation.
            </p>
            <div style={{ display: "flex", gap: "32px" }}>
              {[["10", "Virtual Brands Per Kitchen"], ["150+", "Delivery Zones"], ["30min", "Avg Fulfillment"]].map(([v, l]) => (
                <div key={l} style={{ borderLeft: `2px solid ${C.burgundy}`, paddingLeft: "16px" }}>
                  <div style={{ fontFamily: F.serif, fontSize: "clamp(22px,2.5vw,36px)", fontStyle: "italic", color: C.gold }}>{v}</div>
                  <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: C.muted, marginTop: "4px" }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ position: "relative" }}>
              {/* Ghost delivery image — no box, just the character */}
              <div style={{
                position: "absolute", width: "320px", height: "320px", borderRadius: "50%",
                background: `radial-gradient(circle, ${C.burgundyGlow} 0%, transparent 70%)`,
                top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              }} />
              <img
                src="/images/casper-ghost-delivery.png"
                alt="Casper Ghost Kitchen Delivery"
                style={{ width: "100%", height: "auto", position: "relative", zIndex: 1 }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── SCREEN 7: WHY CASPER GROUP ───────────────────────────────────────────────
function WhyCasper() {
  return (
    <section id="franchise" style={{ background: C.dark, padding: "120px clamp(32px,5vw,80px)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "32px", height: "1px", background: C.gold, display: "inline-block" }} />
            The Power Platform
          </div>
          <h2 style={{ fontFamily: F.serif, fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, fontStyle: "italic", lineHeight: 0.9, color: C.cream, marginBottom: "64px" }}>
            Why Casper Group
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2px", background: C.border }}>
          {[
            {
              title: "Our Brands", color: C.burgundy,
              items: ["10+ distinct restaurant concepts", "Original mascot IP per brand", "Multi-daypart coverage built in", "Shared operational infrastructure"],
            },
            {
              title: "Our Markets", color: C.gold,
              items: ["Atlanta — Flagship", "Houston — Active expansion", "Charlotte — Growing demand", "Nationwide ghost kitchen network"],
            },
            {
              title: "Our Advantage", color: C.orange,
              items: ["Franchise-ready systems", "Dual kitchen operating model", "Proprietary mascot IP", "Central support + supply chain"],
            },
          ].map(col => (
            <Reveal key={col.title}>
              <div style={{ background: C.base, padding: "48px 36px", height: "100%", borderTop: `2px solid ${col.color}` }}>
                <div style={{ fontFamily: F.mono, fontSize: "9px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: col.color, marginBottom: "24px" }}>{col.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                  {col.items.map(item => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: col.color, flexShrink: 0, marginTop: "8px" }} />
                      <span style={{ fontFamily: F.sans, fontSize: "14px", lineHeight: 1.65, color: C.muted }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SCREEN 8: FRANCHISE CTA ──────────────────────────────────────────────────
function FranchiseCTA() {
  return (
    <section style={{
      background: C.base, padding: "140px clamp(32px,5vw,80px)",
      position: "relative", overflow: "hidden",
    }}>
      <Grain opacity={0.03} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 35% 50%, ${C.burgundyGlow}, transparent 50%), radial-gradient(ellipse at 65% 50%, ${C.goldDim}, transparent 50%)`,
      }} />
      <div style={{ maxWidth: "840px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <Reveal>
          {/* Logo — transparent, no plate */}
          <img
            src="/images/casper-logo-white.png" alt="Casper Group"
            style={{ height: "52px", margin: "0 auto 36px", display: "block", opacity: 0.65 }}
          />
          <h2 style={{
            fontFamily: F.serif, fontSize: "clamp(36px,5.5vw,76px)",
            fontWeight: 400, fontStyle: "italic", lineHeight: 1.0,
            color: C.cream, marginBottom: "24px",
          }}>
            Own a Casper brand.
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.85, color: C.muted, maxWidth: "520px", margin: "0 auto 48px" }}>
            Operators, landlords, and strategic partners — Casper Group has a franchise path built for velocity, scale, and cultural relevance in every market.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:info@caspergroupworldwide.com?subject=Franchise Inquiry" style={{
              fontFamily: F.sans, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              color: C.dark, background: C.gold, padding: "16px 52px",
              textDecoration: "none", display: "inline-block", transition: "all 0.3s",
            }}>Start Franchise Inquiry</a>
            <a href="mailto:info@caspergroupworldwide.com?subject=Partnership Inquiry" style={{
              fontFamily: F.sans, fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase",
              color: C.cream, background: "transparent", border: `1px solid ${C.border}`, padding: "16px 40px",
              textDecoration: "none", display: "inline-block", transition: "all 0.3s",
            }}>Operator Partnership</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.dark, borderTop: `1px solid ${C.border}`, padding: "64px clamp(32px,5vw,80px) 40px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(3,1fr)", gap: "48px", marginBottom: "56px" }}>
          <div>
            {/* Logo — transparent, no background plate */}
            <img src="/images/casper-logo-white.png" alt="Casper Group"
              style={{ height: "36px", marginBottom: "16px", display: "block" }} />
            <p style={{ fontFamily: F.sans, fontSize: "13px", lineHeight: 1.75, color: C.muted }}>
              10+ concepts. 15 original characters.<br />One infrastructure built to scale.
            </p>
          </div>
          {[
            { h: "Brands", l: ["Angel Wings", "Tha Morning After", "Patty Daddy", "Espresso Co.", "Mojo Juice", "Mr. Oyster", "Toss'd", "Taco Yaki", "Pasta Bish"] },
            { h: "Company", l: ["About Us", "Locations", "Franchise", "Ghost Kitchen", "Vendors", "Press"] },
            { h: "Contact", l: ["info@caspergroupworldwide.com", "Franchise Inquiry", "Landlord Inquiry", "Media & Press"] },
          ].map(col => (
            <div key={col.h}>
              <div style={{ fontFamily: F.mono, fontSize: "8px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, marginBottom: "18px" }}>{col.h}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
                {col.l.map(item => <li key={item} style={{ fontFamily: F.sans, fontSize: "12px", color: C.muted }}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontFamily: F.mono, fontSize: "10px", color: "rgba(246,240,231,0.2)" }}>© 2026 Casper Group. A KHG Enterprise. All rights reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy", "Terms", "Contact"].map(item => <span key={item} style={{ fontFamily: F.mono, fontSize: "10px", color: "rgba(246,240,231,0.2)", cursor: "pointer" }}>{item}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function CasperGroupV2() {
  return (
    <div style={{ background: C.base }}>
      <Nav />
      <Hero />
      <UniverseThesis />
      <BrandWorlds />
      <MascotUniverse />
      <FoodGallery />
      <GhostKitchen />
      <WhyCasper />
      <FranchiseCTA />
      <Footer />
    </div>
  );
}
