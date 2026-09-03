import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { CasperSiteProfile } from '@/lib/casper-site-registry';
import { getCasperBrandExperience } from '@/lib/casper-brand-experience';
import './casper-brand-home.css';

const PAGE_LINKS = [
  { key: 'menu', title: 'Menu', copy: 'Browse signatures by category, then open full details for the dishes calling your name.' },
  { key: 'order', title: 'Order', copy: 'Build your order from the current kitchen menu and send it directly to the brand team.' },
  { key: 'catering', title: 'Catering / Services', copy: 'Plan group orders, events, drops, staffed service, and custom experiences.' },
  { key: 'locations', title: 'Locations', copy: 'See where this brand is currently serving and what each location supports.' },
  { key: 'about', title: 'About', copy: 'Meet the story, food, culture, and point of view behind the brand.' },
  { key: 'rewards', title: 'Rewards', copy: 'Get member offers, openings, limited drops, and first access.' },
  { key: 'contact', title: 'Contact', copy: 'Questions, feedback, or help with an order? Reach the brand team here.' },
] as const;

export default function CasperBrandHomePage({ profile }: { profile: CasperSiteProfile }) {
  const experience = getCasperBrandExperience(profile.slug);
  if (!experience) return null;

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
        <div className="cbh-hero-media" aria-hidden="true">{experience.heroVideo ? <video autoPlay muted loop playsInline poster={profile.heroImage}><source src={experience.heroVideo} type="video/mp4" /></video> : <Image src={profile.heroImage} alt="" fill priority sizes="100vw" />}</div>
        <div className="cbh-hero-scrim" />
        <div className="cbh-hero-content"><div className="cbh-kicker">{experience.shortLabel} · A Casper Group brand</div><img className="cbh-hero-logo" src={profile.logo} alt={profile.name} /><p>{profile.description}</p><div className="cbh-actions"><Link className="cbh-button cbh-button-primary" href={`/${profile.slug}/menu`}>Enter the menu</Link><Link className="cbh-button" href={`/${profile.slug}/order`}>Start an order</Link></div></div>
        {experience.mascot ? <div className="cbh-mascot" aria-hidden="true"><img src={experience.mascot} alt="" /></div> : null}
      </section>

      <section className="cbh-directory" aria-labelledby={`${profile.slug}-directory`}>
        <div className="cbh-directory-head"><div><span>Explore {profile.name}</span><h1 id={`${profile.slug}-directory`}>Pick your next move.</h1></div><p>Menu, ordering, events, locations, member access, the brand story, and guest support—each ready when you need it.</p></div>
        <div className="cbh-page-grid">{PAGE_LINKS.map((page,index)=><Link className="cbh-page-card" href={`/${profile.slug}/${page.key}`} key={page.key}><span className="cbh-page-number">0{index+1}</span><div><h2>{page.key==='catering'?profile.serviceLabel:page.key==='rewards'?profile.clubLabel:page.title}</h2><p>{page.copy}</p></div><span className="cbh-arrow">↗</span></Link>)}</div>
      </section>

      <section className="cbh-media-deck" aria-label={`${profile.name} visual world`}>
        {experience.secondaryVideo ? <div className="cbh-media cbh-media-video"><video autoPlay muted loop playsInline poster={experience.gallery[0]}><source src={experience.secondaryVideo} type="video/mp4" /></video></div> : null}
        {experience.gallery.map((src,index)=><div className="cbh-media" key={src}><Image src={src} alt={`${profile.name} visual ${index+1}`} fill sizes="(max-width: 900px) 100vw, 33vw" /></div>)}
      </section>

      <footer className="cbh-footer"><div><strong>{profile.name}</strong><span>{profile.format}</span></div><div className="cbh-footer-links"><Link href={`/${profile.slug}/menu`}>Menu</Link><Link href={`/${profile.slug}/catering`}>{profile.serviceLabel}</Link><Link href={`/${profile.slug}/rewards`}>{profile.clubLabel}</Link><Link href={`/${profile.slug}/contact`}>Contact</Link><Link href="/brands">Casper brands</Link></div></footer>
    </main>
  );
}
