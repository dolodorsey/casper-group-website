import Link from 'next/link';
import { casperSiteProfiles } from '@/lib/casper-site-registry';
import './corporate.css';

const brands = Object.values(casperSiteProfiles);
const companyPages = [
  ['/about','About'],['/brands','Brands'],['/locations','Locations'],['/franchise','Franchise'],['/careers','Careers'],['/press','Press'],['/contact','Contact'],
] as const;

export default function CasperCorporatePage() {
  return (
    <main className="ccorp">
      <nav className="ccorp-nav">
        <Link href="/" className="ccorp-mark"><img src="/images/casper-logo-white.png" alt="Casper Group" /></Link>
        <div>{companyPages.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}</div>
        <Link className="ccorp-cta" href="/franchise">Build with Casper ↗</Link>
      </nav>

      <section className="ccorp-hero" id="top">
        <div className="ccorp-hero-bg" aria-hidden="true" />
        <div className="ccorp-orbit" aria-hidden="true"><i/><i/><i/></div>
        <div className="ccorp-hero-copy">
          <span>CASPER GROUP WORLDWIDE / RESTAURANT PLATFORM</span>
          <h1>ONE ENGINE.<br/><em>TWELVE WORLDS.</em></h1>
          <p>Casper Group builds and operates distinct restaurant concepts across hospitality, delivery, events, catering, nightlife and scalable kitchen environments. Shared infrastructure creates leverage; every consumer brand keeps its own identity.</p>
          <div><Link href="/about">Meet Casper Group ↗</Link><Link href="#brands">Enter the universe</Link></div>
        </div>
        <aside><small>THE SYSTEM</small><strong>12</strong><span>distinct consumer concepts</span></aside>
      </section>

      <section className="ccorp-story" aria-label="Casper Group corporate story">
        <div className="ccorp-story-copy">
          <span>THE COMPANY</span>
          <h2>Restaurant development is the product.</h2>
          <p>Casper is built to create brands, activate kitchens, develop locations, support venue partners, operate consumer experiences and expand the concepts that earn the right to scale.</p>
          <div className="ccorp-story-links"><Link href="/about">Company story ↗</Link><Link href="/locations">Kitchen network ↗</Link><Link href="/franchise">Development ↗</Link></div>
        </div>
        <div className="ccorp-story-media">
          <figure><img src="/images/casper-kitchen.png" alt="Casper Group kitchen operations"/><figcaption>Kitchen infrastructure</figcaption></figure>
          <figure><img src="/images/casper-team.png" alt="Casper Group team"/><figcaption>People + operating culture</figcaption></figure>
          <figure><img src="/images/casper-ghost-delivery.png" alt="Casper Group delivery character"/><figcaption>Delivery-native thinking</figcaption></figure>
        </div>
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

      <section className="ccorp-company-pages" aria-label="Casper Group company pages">
        <header><span>COMPANY DIRECTORY</span><h2>More than a brand grid.</h2><p>Corporate information stays on fully developed pages instead of being compressed into one homepage.</p></header>
        <div>{companyPages.map(([href,label],index)=><Link href={href} key={href}><small>0{index+1}</small><strong>{label}</strong><span>↗</span></Link>)}</div>
      </section>

      <section className="ccorp-growth" id="growth">
        <div><span>DEVELOPMENT / FRANCHISE / PARTNERSHIPS</span><h2>Build the next room.</h2><p>Casper is structured to expand concept by concept, market by market, without giving up the identity that makes each brand worth entering.</p></div>
        <div className="ccorp-growth-rail"><Link href="/franchise">Development inquiry ↗</Link><Link href="/brands">Explore all brands ↗</Link></div>
      </section>

      <footer><img src="/images/casper-logo-white.png" alt="Casper Group"/><span>A Kollective Hospitality Group platform</span><span>ATLANTA · LAS VEGAS · MULTI-MARKET</span></footer>
    </main>
  );
}
