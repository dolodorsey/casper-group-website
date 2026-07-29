import Link from "next/link";
import { notFound } from "next/navigation";

type Brand = {
  name: string;
  type: string;
  tagline: string;
  description: string;
  logo: string;
  hero: string;
  accent: string;
  palette: string[];
  pillars: { title: string; text: string }[];
  menu: string[];
  audience: string[];
  focus: string;
};

const brands: Record<string, Brand> = {
  "tha-morning-after": {
    name: "Tha Morning After",
    type: "Breakfast Bar",
    tagline: "Wake up legendary.",
    description: "A high-energy breakfast concept built for recovery mornings, all-day brunch cravings, delivery velocity, and unapologetically memorable comfort food.",
    logo: "/images/logo-morning-after.png",
    hero: "/images/portal-morning-after.jpeg",
    accent: "#D89A2B",
    palette: ["Golden yolk", "Toast brown", "Midnight black"],
    pillars: [
      { title: "All-day breakfast", text: "A flexible menu engineered to perform beyond the traditional morning window." },
      { title: "Recovery culture", text: "Big flavor, humor, and satisfying portions designed for the morning after any kind of night." },
      { title: "Delivery ready", text: "Portable builds and packaging that protect temperature, texture, and presentation." },
    ],
    menu: ["Stuffed French toast", "Breakfast sandwiches", "Loaded hash bowls", "Burritos and biscuit builds", "Coffee and recovery drinks"],
    audience: ["Brunch regulars", "Late-night workers", "Weekend groups", "Delivery-first guests"],
    focus: "Finalize the launch menu, packaging system, and flagship-market operating plan.",
  },
  "patty-daddy": {
    name: "Patty Daddy",
    type: "Burger Bar",
    tagline: "Bigger. Bolder. Daddy.",
    description: "A personality-led smash-burger concept with towering builds, memorable character IP, and a kitchen model designed for fast execution and repeatable quality.",
    logo: "/images/logo-patty-daddy.png",
    hero: "/images/portal-patty-daddy.jpeg",
    accent: "#E0A22F",
    palette: ["Molten gold", "Charred brown", "Cream"],
    pillars: [
      { title: "Smash discipline", text: "Crisp edges, juicy centers, and calibrated cook times anchor every burger." },
      { title: "Larger-than-life voice", text: "A bold brand personality turns the menu, packaging, and mascot into shareable culture." },
      { title: "Franchise logic", text: "Focused ingredients and modular builds support efficient training and expansion." },
    ],
    menu: ["Signature smash burgers", "Patty melts", "Loaded fries", "Mini slider flights", "Shakes and fountain drinks"],
    audience: ["Burger loyalists", "Families", "Sports crowds", "Late-night delivery"],
    focus: "Complete the flagship prototype, core recipe standards, and franchise-ready training system.",
  },
  "mojo-juice": {
    name: "Mojo Juice",
    type: "Juice Bar",
    tagline: "Fuel the ritual.",
    description: "A bright wellness concept built around fresh-pressed juice, functional smoothies, and everyday rituals that feel energetic rather than clinical.",
    logo: "/images/logo-mojo-juice.png",
    hero: "/images/portal-mojo.jpeg",
    accent: "#63A647",
    palette: ["Mango", "Leaf green", "Clean white"],
    pillars: [
      { title: "Functional flavor", text: "Every drink pairs a clear benefit with a craveable, balanced flavor profile." },
      { title: "Daily ritual", text: "Programs and bundles encourage repeat routines before work, after training, and between meals." },
      { title: "Visible freshness", text: "Color, ingredients, and preparation create a transparent and highly visual experience." },
    ],
    menu: ["Fresh-pressed juices", "Functional smoothies", "Wellness shots", "Protein blends", "Seasonal fruit bowls"],
    audience: ["Wellness customers", "Fitness communities", "Busy professionals", "Families"],
    focus: "Lock the functional menu architecture, sourcing standards, and recurring ritual program.",
  },
  "mr-oyster": {
    name: "Mr. Oyster",
    type: "Oyster & Seafood Bar",
    tagline: "The deep end of flavor.",
    description: "An elevated seafood concept balancing raw-bar confidence, dramatic hot dishes, and polished presentation for dine-in, catering, and special occasions.",
    logo: "/images/logo-mr-oyster.png",
    hero: "/images/portal-mr-oyster.jpeg",
    accent: "#4C86A8",
    palette: ["Deep ocean blue", "Pearl", "Ink black"],
    pillars: [
      { title: "Raw-bar authority", text: "Oysters and chilled seafood are handled with visible sourcing and service discipline." },
      { title: "Dramatic plates", text: "Hot seafood, pasta, towers, and shareables bring spectacle without losing consistency." },
      { title: "Occasion ready", text: "The concept flexes from casual happy hour to private dinners and premium catering." },
    ],
    menu: ["Oyster selections", "Seafood towers", "Seared scallops", "Calamari and shellfish", "Ink pasta and seasonal specials"],
    audience: ["Seafood enthusiasts", "Date-night guests", "Corporate hosts", "Celebration groups"],
    focus: "Develop the sourcing calendar, raw-bar service standards, and premium event packages.",
  },
  "sweet-tooth": {
    name: "Sweet Tooth",
    type: "Dessert Bar",
    tagline: "Indulgence engineered.",
    description: "A dessert-first concept designed for visual appetite, high-margin customization, celebration moments, and late-night delivery.",
    logo: "/images/logo-sweet-tooth.png",
    hero: "/images/portal-sweet-tooth.jpeg",
    accent: "#D74B9B",
    palette: ["Candy pink", "Chocolate", "Vanilla cream"],
    pillars: [
      { title: "Built to share", text: "Desserts arrive camera-ready, portionable, and easy to personalize." },
      { title: "Celebration engine", text: "Birthdays, office drops, and event packages extend the brand beyond individual orders." },
      { title: "Late-night margin", text: "A focused assembly system supports high-demand evening delivery windows." },
    ],
    menu: ["Signature dessert cups", "Warm cookie builds", "Cake and brownie flights", "Soft-serve combinations", "Party boxes"],
    audience: ["Families", "Date nights", "Celebrations", "Late-night delivery customers"],
    focus: "Finalize signature products, celebration bundles, and temperature-safe delivery packaging.",
  },
  "taco-yaki": {
    name: "Taco Yaki",
    type: "Taco × Hibachi",
    tagline: "East meets west. Fire meets grill.",
    description: "A fusion concept combining the portability of tacos with hibachi technique, bold sauces, and a high-energy visual identity.",
    logo: "/images/logo-taco-yaki.png",
    hero: "/images/portal-taco-yaki.png",
    accent: "#E45D22",
    palette: ["Fire orange", "Sumi black", "Rice white"],
    pillars: [
      { title: "Fusion with logic", text: "Hibachi proteins, vegetables, rice, and sauces translate naturally into handheld builds." },
      { title: "Live-fire energy", text: "Sizzle, flame, and finishing rituals give the brand a distinct experience." },
      { title: "Modular menu", text: "Shared components create tacos, bowls, platters, and catering formats efficiently." },
    ],
    menu: ["Hibachi tacos", "Fire-grilled bowls", "Rice and noodle sides", "Fusion platters", "House sauces"],
    audience: ["Fusion explorers", "Lunch crowds", "Event guests", "Delivery customers"],
    focus: "Complete sauce standards, protein builds, and the catering platter system.",
  },
  tossd: {
    name: "Toss'd",
    type: "Salad & Bowl Bar",
    tagline: "Fresh. Fast. No excuses.",
    description: "A fast, flexible wellness concept serving composed salads, warm bowls, and build-your-own meals without sacrificing flavor or speed.",
    logo: "/images/logo-tossd.png",
    hero: "/images/portal-tossd.jpeg",
    accent: "#61A146",
    palette: ["Leaf green", "Herb", "Stone"],
    pillars: [
      { title: "Craveable wellness", text: "Dressings, crunch, herbs, and warm components prevent healthy food from feeling like compromise." },
      { title: "Fast assembly", text: "A disciplined line supports lunch peaks, delivery, and customized orders." },
      { title: "Flexible diets", text: "Clear ingredient logic supports protein, plant-forward, and allergen-aware choices." },
    ],
    menu: ["Signature salads", "Warm grain bowls", "Build-your-own combinations", "Soups and sides", "Fresh teas"],
    audience: ["Office lunch guests", "Wellness diners", "Athletes", "Diet-conscious families"],
    focus: "Lock the ingredient matrix, nutrition communication, and peak-hour line design.",
  },
  "pasta-bish": {
    name: "Pasta Bish",
    type: "Pasta Bar",
    tagline: "Comfort with attitude.",
    description: "A bold pasta concept pairing familiar comfort with playful voice, sauce-driven customization, and delivery-friendly bowls.",
    logo: "/images/logo-pasta-bish.png",
    hero: "/images/portal-pasta-bish.jpeg",
    accent: "#C9473E",
    palette: ["Tomato red", "Basil", "Parchment"],
    pillars: [
      { title: "Sauce first", text: "Distinct sauces anchor a flexible system of noodles, proteins, vegetables, and finishes." },
      { title: "Comfort on demand", text: "Generous portions and recognizable flavors support lunch, dinner, and late-night occasions." },
      { title: "Personality everywhere", text: "Naming, copy, packaging, and character design give classic pasta a modern point of view." },
    ],
    menu: ["Creamy fettuccine", "Proper marinara", "Baked pasta bowls", "Protein add-ons", "Garlic bread and salads"],
    audience: ["Comfort-food diners", "Families", "College markets", "Delivery customers"],
    focus: "Standardize the sauce library, bowl sizes, and delivery hold-time tests.",
  },
  "peace-pizza": {
    name: "Peace Pizza",
    type: "Pizza Bar",
    tagline: "Good slices. Good energy.",
    description: "A retro, optimistic pizza brand where a cheese-pull peace sign becomes the icon for shareable pies, neighborhood energy, and culture-led gatherings.",
    logo: "/images/logo-peace-pizza.png",
    hero: "/images/portal-peace-pizza.png",
    accent: "#F28C28",
    palette: ["Sunset orange", "Cheese gold", "Olive green"],
    pillars: [
      { title: "Peace by the piece", text: "The identity turns every slice, box, and gathering into a positive, recognizable ritual." },
      { title: "Built for sharing", text: "Whole pies, slice flights, party packs, and event formats invite groups into the experience." },
      { title: "Neighborhood energy", text: "Music, art, and community collaborations give the concept a life beyond the menu." },
    ],
    menu: ["Signature peace-sign pies", "Classic and specialty slices", "Garlic knots", "Shareable salads", "Party packs"],
    audience: ["Families", "College communities", "Creative neighborhoods", "Events and group orders"],
    focus: "Develop the opening menu, box system, community calendar, and flagship-market launch plan.",
  },
  "american-dragon": {
    name: "American Dragon",
    type: "American Chinese · Luxury Takeout",
    tagline: "Luxury takeout. American fire.",
    description: "An American Chinese concept that elevates familiar favorites through premium ingredients, polished packaging, late-night confidence, and a cinematic gold-and-red identity.",
    logo: "/images/logo-american-dragon.png",
    hero: "/images/portal-american-dragon.png",
    accent: "#D9A52E",
    palette: ["Imperial gold", "Lacquer red", "Obsidian"],
    pillars: [
      { title: "Familiar, elevated", text: "Recognizable American Chinese dishes receive sharper technique, ingredients, and presentation." },
      { title: "Luxury at home", text: "Packaging, service, and finishing details make takeout feel like an occasion." },
      { title: "Night-market energy", text: "A confident evening identity positions the brand for dinner, nightlife, and delivery." },
    ],
    menu: ["Signature fried rice", "Wok-fired noodles", "Crisp chicken and shrimp", "Dumplings and shareables", "Premium family feasts"],
    audience: ["Dinner delivery guests", "Nightlife markets", "Families", "Corporate and event orders"],
    focus: "Finalize wok recipes, premium packaging, family-feast architecture, and the launch market.",
  },
};

const brandMedia: Record<string, { src: string; label: string }[]> = {
  "tha-morning-after": [
    { src: "/images/morning-french-toast.jpg", label: "Stuffed French toast direction" },
    { src: "/images/morning-sandwiches.jpg", label: "Breakfast sandwich system" },
    { src: "/images/morning-after-booth.jpg", label: "All-day breakfast environment" },
  ],
  "patty-daddy": [
    { src: "/images/patty-smashburger.jpg", label: "Signature smash discipline" },
    { src: "/images/patty-sliders.jpg", label: "Slider-flight direction" },
    { src: "/images/patty-daddy-rain.jpg", label: "Patty Daddy campaign world" },
  ],
  "mojo-juice": [
    { src: "/images/mojo-juice.png", label: "Fresh-pressed color system" },
    { src: "/images/mojo-smoothie.png", label: "Functional smoothie direction" },
    { src: "/images/food/green-juice-splash.png", label: "Ingredient-motion study" },
  ],
  "mr-oyster": [
    { src: "/images/mr-oyster.png", label: "Raw-bar identity study" },
    { src: "/images/oyster-scallops.jpg", label: "Premium hot-seafood direction" },
    { src: "/images/portal-mr-oyster.jpeg", label: "Occasion-led brand world" },
  ],
  "sweet-tooth": [
    { src: "/images/sweet-tooth.png", label: "Dessert-bar visual direction" },
    { src: "/images/portal-sweet-tooth.jpeg", label: "Celebration brand world" },
    { src: "/images/mascot-sweet-tooth.png", label: "Character system" },
  ],
  "taco-yaki": [
    { src: "/images/taco-hibachi.jpg", label: "Hibachi taco direction" },
    { src: "/images/taco-platter.jpg", label: "Catering platter system" },
    { src: "/images/taco-yaki-ninja.jpg", label: "Taco Yaki character world" },
  ],
  tossd: [
    { src: "/images/tossd.png", label: "Salad and bowl direction" },
    { src: "/images/mascot-lenny-lettuce.png", label: "Lenny Lettuce" },
    { src: "/images/mascot-king-kale.png", label: "King Kale" },
  ],
  "pasta-bish": [
    { src: "/images/pasta-fettuccine.jpg", label: "Cream-sauce direction" },
    { src: "/images/pasta-marinara.jpg", label: "Tomato-sauce direction" },
    { src: "/images/pasta-bish.jpg", label: "Pasta Bish brand world" },
  ],
  "peace-pizza": [
    { src: "/images/portal-peace-pizza.png", label: "Peace Pizza campaign world" },
    { src: "/images/logo-peace-pizza.png", label: "Cheese-pull peace mark" },
  ],
  "american-dragon": [
    { src: "/images/portal-american-dragon.png", label: "American Dragon campaign world" },
    { src: "/images/food/fried-rice-shrimp.png", label: "Fried-rice direction study" },
  ],
};

export function generateStaticParams() {
  return Object.keys(brands).map((slug) => ({ slug }));
}

export default function BrandPage({ params }: { params: { slug: string } }) {
  const brand = brands[params.slug];
  const media = brandMedia[params.slug] || [];
  if (!brand) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "#0d0f0e", color: "#F6F0E7", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <nav style={{ position: "absolute", inset: "0 0 auto", zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px clamp(20px,5vw,72px)" }}>
        <Link href="/" style={{ color: "#F6F0E7", textDecoration: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase" }}>← Casper Group</Link>
        <Link href="/connect" style={{ color: "#0d0f0e", background: brand.accent, padding: "11px 20px", textDecoration: "none", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>Connect</Link>
      </nav>

      <section style={{ minHeight: "92vh", position: "relative", display: "grid", placeItems: "center", overflow: "hidden", padding: "120px clamp(20px,5vw,72px) 72px" }}>
        <img src={brand.hero} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.38, filter: "saturate(.9) brightness(.55)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(13,15,14,.35),#0d0f0e 95%)" }} />
        <div style={{ position: "relative", maxWidth: 960, textAlign: "center" }}>
          <img src={brand.logo} alt={`${brand.name} logo`} style={{ width: "min(430px,78vw)", maxHeight: 310, objectFit: "contain", filter: "drop-shadow(0 18px 38px rgba(0,0,0,.55))" }} />
          <p style={{ margin: "28px 0 10px", color: brand.accent, textTransform: "uppercase", letterSpacing: "0.34em", fontSize: 11 }}>{brand.type}</p>
          <h1 style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(42px,7vw,88px)", lineHeight: .95, fontStyle: "italic", fontWeight: 500 }}>{brand.tagline}</h1>
          <p style={{ maxWidth: 740, margin: "28px auto 0", color: "rgba(246,240,231,.72)", fontSize: "clamp(16px,2vw,21px)", lineHeight: 1.7 }}>{brand.description}</p>
        </div>
      </section>

      <section style={{ background: "#090807", padding: "0 0 90px" }}>
        <div style={{ padding: "0 clamp(20px,5vw,72px) 28px", display: "flex", justifyContent: "space-between", gap: 20, alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ color: brand.accent, textTransform: "uppercase", letterSpacing: "0.3em", fontSize: 11 }}>Brand world</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(38px,5vw,66px)", fontWeight: 500, margin: "12px 0 0" }}>The appetite, character,<br />and occasion.</h2>
          </div>
          <p style={{ maxWidth: 420, color: "rgba(246,240,231,.52)", lineHeight: 1.7, margin: 0 }}>{media.length < 3 ? "Current approved visual studies are shown here. The complete food, environment, packaging, and lifestyle production is listed in the asset register." : "Existing approved studies establish the visual appetite. Final launch photography will convert the direction into a complete customer-facing system."}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", minHeight: 520 }}>
          {media.map((item, index) => <figure key={item.src} style={{ position: "relative", margin: 0, minHeight: 520, overflow: "hidden", borderLeft: index ? "3px solid #090807" : 0 }}>
            <img src={item.src} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.88) contrast(1.04)", position: "absolute", inset: 0 }} />
            <figcaption style={{ position: "absolute", inset: "auto 0 0", padding: "70px 24px 24px", background: "linear-gradient(transparent,rgba(0,0,0,.9))", color: "#fff", fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase" }}><span style={{ color: brand.accent, marginRight: 12 }}>0{index + 1}</span>{item.label}</figcaption>
          </figure>)}
        </div>
      </section>

      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "90px clamp(20px,5vw,72px)" }}>
        <p style={{ color: brand.accent, textTransform: "uppercase", letterSpacing: "0.3em", fontSize: 11 }}>The concept</p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(38px,5vw,66px)", fontWeight: 500, margin: "12px 0 40px" }}>Built to be distinct.<br />Built to operate together.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {brand.pillars.map((pillar) => (
            <article key={pillar.title} style={{ border: `1px solid ${brand.accent}44`, background: "#151311", padding: 28 }}>
              <h3 style={{ color: brand.accent, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 27, margin: "0 0 14px" }}>{pillar.title}</h3>
              <p style={{ color: "rgba(246,240,231,.62)", lineHeight: 1.7, margin: 0 }}>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: "#090807", padding: "90px clamp(20px,5vw,72px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(42px,7vw,110px)" }}>
          <div>
            <p style={{ color: brand.accent, textTransform: "uppercase", letterSpacing: "0.3em", fontSize: 11 }}>Menu direction</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 44, margin: "12px 0 24px" }}>What the brand serves</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {brand.menu.map((item) => <li key={item} style={{ padding: "14px 0", borderBottom: "1px solid rgba(246,240,231,.1)", color: "rgba(246,240,231,.72)" }}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p style={{ color: brand.accent, textTransform: "uppercase", letterSpacing: "0.3em", fontSize: 11 }}>Audience</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 44, margin: "12px 0 24px" }}>Who it is built for</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {brand.audience.map((item) => <li key={item} style={{ padding: "14px 0", borderBottom: "1px solid rgba(246,240,231,.1)", color: "rgba(246,240,231,.72)" }}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", padding: "100px clamp(20px,5vw,72px)" }}>
        <p style={{ color: brand.accent, textTransform: "uppercase", letterSpacing: "0.3em", fontSize: 11 }}>Current focus</p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(38px,5vw,62px)", fontWeight: 500, margin: "16px 0 26px" }}>{brand.focus}</h2>
        <p style={{ color: "rgba(246,240,231,.58)", lineHeight: 1.8, maxWidth: 720, margin: "0 auto 38px" }}>Casper Group is preparing this concept for its next operating phase. Partners, operators, property owners, vendors, and collaborators can identify the brand in the inquiry notes.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link href="/forms/consultation" style={{ background: brand.accent, color: "#090807", padding: "15px 24px", textDecoration: "none", fontWeight: 800 }}>Discuss this concept</Link>
          <Link href="/forms/sponsor" style={{ border: "1px solid rgba(246,240,231,.28)", color: "#F6F0E7", padding: "15px 24px", textDecoration: "none" }}>Partnership inquiry</Link>
          <Link href="/#brands" style={{ border: "1px solid rgba(246,240,231,.28)", color: "#F6F0E7", padding: "15px 24px", textDecoration: "none" }}>View all 12 brands</Link>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(246,240,231,.08)", padding: "26px clamp(20px,5vw,72px)", display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", color: "rgba(246,240,231,.42)", fontSize: 12 }}>
        <span>© 2026 Casper Group · {brand.name}</span>
        <span>{brand.palette.join(" · ")}</span>
      </footer>
    </main>
  );
}
