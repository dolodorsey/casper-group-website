import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { CasperSiteProfile } from '@/lib/casper-site-registry';
import { getCasperBrandExperience, type CasperHomeVariant } from '@/lib/casper-brand-experience';
import './casper-brand-home.css';
import './casper-motion-refresh.css';

const PAGE_LINKS = [
  { key: 'menu', title: 'Menu', copy: 'Browse signatures by category, then open full details for the dishes calling your name.' },
  { key: 'order', title: 'Order', copy: 'Build your order from the current kitchen menu and send it directly to the brand team.' },
  { key: 'catering', title: 'Catering / Services', copy: 'Plan group orders, events, drops, staffed service, and custom experiences.' },
  { key: 'locations', title: 'Locations', copy: 'See where this brand is currently serving and what each location supports.' },
  { key: 'about', title: 'About', copy: 'Meet the story, food, culture, and point of view behind the brand.' },
  { key: 'rewards', title: 'Rewards', copy: 'Get member offers, openings, limited drops, and first access.' },
  { key: 'contact', title: 'Contact', copy: 'Questions, feedback, or help with an order? Reach the brand team here.' },
] as const;

const SIGNATURES: Record<CasperHomeVariant, { eyebrow: string; title: string; copy: string; beats: string[] }> = {
  halo: { eyebrow: 'Choose your side', title: 'HEAVEN / HELL', copy: 'A split-world experience built around crave, heat and consequence.', beats: ['MILD SIDE', 'WILD SIDE', 'SAUCE SCALE'] },
  sunrise: { eyebrow: 'The night becomes breakfast', title: '2:47 AM → 10:31 AM', copy: 'A timeline homepage that visually moves from after-hours darkness into full daylight brunch.', beats: ['2:47 AM', 'SUNRISE', 'THE CURE'] },
  smash: { eyebrow: 'Build it bigger', title: 'STACK THE DAMAGE', copy: 'Burger construction becomes the interface: layers, combinations, excess and immediate ordering.', beats: ['BUN', 'PATTY', 'SAUCE'] },
  lab: { eyebrow: 'Extraction protocol', title: 'BEAN → PRESSURE → CUP', copy: 'A precision coffee laboratory where origin, roast and extraction become navigable systems.', beats: ['ORIGIN', 'ROAST', 'EXTRACT'] },
  fresh: { eyebrow: 'Pick your state', title: 'ENERGY / GLOW / RESET', copy: 'A high-color wellness world organized around what the guest wants to feel next.', beats: ['ENERGY', 'GLOW', 'RECOVER'] },
  ocean: { eyebrow: 'Descend below the surface', title: 'OCEAN → PEARL → TABLE', copy: 'Luxury seafood told as a descent into the ocean that resolves at the raw bar.', beats: ['DEPTH', 'PEARL', 'CHAMPAGNE'] },
  candy: { eyebrow: 'Enter dessert logic', title: 'REAL TREATS. UNREAL WORLD.', copy: 'A surreal candy universe with oversized scale, impossible rooms and indulgent product moments.', beats: ['CAKE', 'CANDY', 'CHAOS'] },
  fire: { eyebrow: 'Where tacos meet fire', title: 'STREET → GRILL → FLAME', copy: 'A kinetic night-market interface driven by heat, sparks, smoke and hibachi movement.', beats: ['STREET', 'GRILL', 'FIRE'] },
  garden: { eyebrow: 'Build it fresh', title: 'PICK / TOSS / TRACK', copy: 'Ingredients move like interface objects while nutrition and customization stay visible in real time.', beats: ['GREENS', 'PROTEIN', 'TOSS'] },
  sauce: { eyebrow: 'Carbs with confidence', title: 'PASTA AS FASHION EDITORIAL', copy: 'Flash photography, red sauce, Italian cinema and sculptural pasta replace the expected restaurant grid.', beats: ['SHAPE', 'SAUCE', 'SERVE'] },
  peace: { eyebrow: 'Give pizza a chance', title: 'SLICE / SOUND / PSYCHEDELIA', copy: 'Counterculture poster energy, hand-drawn movement and pizza iconography create a playful anti-chain world.', beats: ['SLICE', 'SPIN', 'SHARE'] },
  dragon: { eyebrow: 'American-Chinese after dark', title: 'ENTER FUTURE CHINATOWN', copy: 'Neon, steam, takeout ritual and a moving dragon language turn ordering into a cinematic night-market journey.', beats: ['NEON', 'STEAM', 'DRAGON'] },
};

export default function CasperBrandHomePage({ profile }: { profile: CasperSiteProfile }) {
  const experience = getCasperBrandExperience(profile.slug);
  if (!experience) return null;
  const signature = SIGNATURES[experience.variant];

  return (
    <main className="cbh-site" data-variant={experience.variant} style={{ '--cbh-accent': profile.accent, '--cbh-accent-bright': profile.accentBright, '--cbh-secondary': profile.secondary } as CSSProperties}>
      <nav className="cbh-nav" aria-label={`${profile.name} navigation`}>
        <Link className="cbh-brand" href={`/${profile.slug}`}><img src={profile.logo} alt={profile.name} /></Link>
        <div className="cbh-nav-links">
          <Link href={`/${profile.slug}/menu`}>Menu</Link><Link href={`/${profile.slug}/order`}>Order</Link><Link href={`/${profile.slug}/catering`}>{profile.serviceLabel}</Link><Link href={`/${profile.slug}/locations`}>Locations</Link><Link href={`/${profile.slug}/about`}>About</Link><Link href={`/${profile.slug}/rewards`}>{profile.clubLabel}</Link><Link href={`/${profile.slug}/contact`}>Contact</Link>
        </div>
        <Link className="cbh-nav-cta" href={`/${profile.slug}/order`}>Order</Link>
      </nav>

      <section className="cbh-hero">
        <div className="cbh-hero-media" aria-hidden="true">
          {experience.heroVideo ? (
            <video autoPlay muted loop playsInline preload="metadata" poster={profile.heroImage}>
              {experience.heroVideoMobile ? <source media="(max-width: 700px)" src={experience.heroVideoMobile} type="video/mp4" /> : null}
              <source src={experience.heroVideo} type="video/mp4" />
            </video>
          ) : <Image src={profile.heroImage} alt="" fill priority sizes="100vw" />}
        </div>
        <div className="cbh-hero-scrim" />
        <div className="cbh-hero-geometry" aria-hidden="true"><i/><i/><i/></div>
        <div className="cbh-hero-content"><div className="cbh-kicker">{experience.shortLabel} · A Casper Group brand</div><img className="cbh-hero-logo" src={profile.logo} alt={profile.name} /><p>{profile.description}</p><div className="cbh-actions"><Link className="cbh-button cbh-button-primary" href={`/${profile.slug}/menu`}>Enter the menu</Link><Link className="cbh-button" href={`/${profile.slug}/order`}>Start an order</Link></div></div>
        {experience.mascot ? <div className="cbh-mascot" aria-hidden="true"><img src={experience.mascot} alt="" /></div> : null}
        <div className="cbh-hero-index" aria-hidden="true"><span>{profile.name}</span><b>{experience.variant.toUpperCase()}</b></div>
      </section>

      <section className="cbh-signature" aria-label={`${profile.name} signature experience`}>
        <div className="cbh-signature-intro"><span>{signature.eyebrow}</span><h1>{signature.title}</h1><p>{signature.copy}</p></div>
        <div className="cbh-signature-beats">{signature.beats.map((beat, index)=><div key={beat}><small>0{index+1}</small><strong>{beat}</strong></div>)}</div>
      </section>

      <section className="cbh-directory" aria-labelledby={`${profile.slug}-directory`}>
        <div className="cbh-directory-head"><div><span>Explore {profile.name}</span><h2 id={`${profile.slug}-directory`}>Pick your next move.</h2></div><p>Menu, ordering, events, locations, member access, the brand story, and guest support—each ready when you need it.</p></div>
        <div className="cbh-page-grid">{PAGE_LINKS.map((page,index)=><Link className="cbh-page-card" href={`/${profile.slug}/${page.key}`} key={page.key}><span className="cbh-page-number">0{index+1}</span><div><h3>{page.key==='catering'?profile.serviceLabel:page.key==='rewards'?profile.clubLabel:page.title}</h3><p>{page.copy}</p></div><span className="cbh-arrow">↗</span></Link>)}</div>
      </section>

      <section className="cbh-media-deck" aria-label={`${profile.name} visual world`}>
        {experience.secondaryVideo ? <div className="cbh-media cbh-media-video"><video autoPlay muted loop playsInline preload="metadata"><source src={experience.secondaryVideo} type="video/mp4" /></video></div> : null}
        {experience.gallery.map((src,index)=><div className={`cbh-media cbh-media-${index+1}`} key={src}><Image src={src} alt={`${profile.name} visual ${index+1}`} fill sizes="(max-width: 900px) 100vw, 50vw" /></div>)}
      </section>

      <section className="cbh-final-cta"><span>{experience.shortLabel}</span><h2>{profile.tagline}</h2><div><Link className="cbh-button cbh-button-primary" href={`/${profile.slug}/order`}>Order {profile.name}</Link><Link className="cbh-button" href={`/${profile.slug}/about`}>Enter the story</Link></div></section>

      <footer className="cbh-footer"><div><strong>{profile.name}</strong><span>{profile.format}</span></div><div className="cbh-footer-links"><Link href={`/${profile.slug}/menu`}>Menu</Link><Link href={`/${profile.slug}/catering`}>{profile.serviceLabel}</Link><Link href={`/${profile.slug}/rewards`}>{profile.clubLabel}</Link><Link href={`/${profile.slug}/contact`}>Contact</Link><Link href="/brands">Casper brands</Link></div></footer>
    </main>
  );
}
