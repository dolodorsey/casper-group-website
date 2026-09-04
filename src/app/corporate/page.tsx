import Link from 'next/link';
import { casperSiteProfiles } from '@/lib/casper-site-registry';
import './corporate.css';

const brands = Object.values(casperSiteProfiles);

export default function CasperCorporatePage() {
  return (
    <main className="ccorp">
      <nav className="ccorp-nav">
        <Link href="/corporate" className="ccorp-mark"><img src="/images/casper-logo-white.png" alt="Casper Group" /></Link>
        <div><a href="#brands">Brands</a><a href="#platform">Platform</a><a href="#growth">Growth</a></div>
        <a className="ccorp-cta" href="#growth">Build with Casper ↗</a>
      </nav>

      <section className="ccorp-hero" id="top">
        <div className="ccorp-hero-bg" aria-hidden="true" />
        <div className="ccorp-orbit" aria-hidden="true"><i/><i/><i/></div>
        <div className="ccorp-hero-copy">
          <span>CASPER GROUP WORLDWIDE / RESTAURANT PLATFORM</span>
          <h1>ONE ENGINE.<br/><em>TWELVE WORLDS.</em></h1>
          <p>Casper is not one restaurant. It is a multi-concept food platform built to create, operate, scale and franchise distinct restaurant worlds without flattening them into one template.</p>
          <div><a href="#brands">Enter the universe ↗</a><a href="#growth">Development & franchise</a></div>
        </div>
        <aside><small>THE SYSTEM</small><strong>12</strong><span>distinct consumer concepts</span></aside>
      </section>

      <section className="ccorp-principles" id="platform">
        <article><span>01</span><h2>Distinct frontends.</h2><p>Each brand owns its own visual language, menu logic, audience, motion system and cultural point of view.</p></article>
        <article><span>02</span><h2>Shared operating power.</h2><p>Procurement, kitchen systems, data, development and growth infrastructure compound underneath the brand layer.</p></article>
        <article><span>03</span><h2>Built to multiply.</h2><p>Every concept is designed for physical locations, digital ordering, catering, activations and expansion.</p></article>
      </section>

      <section className="ccorp-brands" id="brands">
        <header><span>THE CASPER UNIVERSE</span><h2>Choose a world.</h2><p>No two doors should feel like the same restaurant wearing another color.</p></header>
        <div className="ccorp-grid">
          {brands.map((brand,index)=><Link href={`/${brand.slug}`} className="ccorp-card" key={brand.slug} style={{'--brand-accent':brand.accent} as React.CSSProperties}>
            <div className="ccorp-card-media"><img src={brand.heroImage} alt="" /></div>
            <div className="ccorp-card-top"><span>{String(index+1).padStart(2,'0')}</span><small>{brand.format}</small></div>
            <img className="ccorp-card-logo" src={brand.logo} alt={brand.name}/>
            <p>{brand.tagline}</p><b>ENTER ↗</b>
          </Link>)}
        </div>
      </section>

      <section className="ccorp-growth" id="growth">
        <div><span>DEVELOPMENT / FRANCHISE / PARTNERSHIPS</span><h2>Build the next room.</h2><p>Casper is structured to expand concept by concept, market by market, without giving up the identity that makes each brand worth entering.</p></div>
        <div className="ccorp-growth-rail"><a href="mailto:info@thekollectivehospitality.com">Development inquiry ↗</a><a href="/brands">Explore all brands ↗</a></div>
      </section>

      <footer><img src="/images/casper-logo-white.png" alt="Casper Group"/><span>A Kollective Hospitality Group platform</span><span>ATLANTA · LAS VEGAS · MULTI-MARKET</span></footer>
    </main>
  );
}
