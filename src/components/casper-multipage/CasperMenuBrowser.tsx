'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { CasperSiteProfile } from '@/lib/casper-site-registry';
import { getCasperBrandExperience } from '@/lib/casper-brand-experience';
import './casper-menu-browser.css';

type MenuItem = {
  slug: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  image_path?: string | null;
  featured?: boolean;
};

function categorySlug(value: string) {
  return value.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function labelize(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function CasperMenuBrowser({ profile }: { profile: CasperSiteProfile }) {
  const experience = getCasperBrandExperience(profile.slug);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`/api/brand/${profile.slug}?resource=menu`, { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Menu unavailable.');
        if (active) setItems(Array.isArray(data.menu) ? data.menu : []);
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Menu unavailable.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [profile.slug]);

  const categories = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const item of items) {
      const name = item.category || 'Signature';
      map.set(name, [...(map.get(name) || []), item]);
    }
    return Array.from(map.entries()).map(([name, entries]) => ({
      name,
      slug: categorySlug(name),
      count: entries.length,
      image: entries.find((item) => item.featured && item.image_path)?.image_path || entries.find((item) => item.image_path)?.image_path || experience?.gallery?.[0] || profile.heroImage,
      preview: entries.slice(0, 3).map((item) => item.name),
    }));
  }, [experience?.gallery, items, profile.heroImage]);

  return (
    <main className="cmb-site" data-variant={experience?.variant || 'halo'} style={{ '--cmb-accent': profile.accent, '--cmb-bright': profile.accentBright } as React.CSSProperties}>
      <nav className="cmb-nav">
        <Link href={`/${profile.slug}`} className="cmb-brand"><img src={profile.logo} alt={profile.name} /></Link>
        <div className="cmb-nav-links">
          <Link href={`/${profile.slug}`}>Home</Link><Link href={`/${profile.slug}/order`}>Order</Link><Link href={`/${profile.slug}/catering`}>{profile.serviceLabel}</Link><Link href={`/${profile.slug}/locations`}>Locations</Link><Link href={`/${profile.slug}/about`}>About</Link>
        </div>
        <Link className="cmb-order" href={`/${profile.slug}/order`}>Order</Link>
      </nav>

      <header className="cmb-hero">
        <div className="cmb-hero-media">
          {experience?.secondaryVideo ? <video autoPlay muted loop playsInline poster={profile.heroImage}><source src={experience.secondaryVideo} type="video/mp4" /></video> : <Image src={experience?.gallery?.[0] || profile.heroImage} alt="" fill priority sizes="100vw" />}
        </div>
        <div className="cmb-scrim" />
        <div className="cmb-hero-copy"><span>Menu / {profile.name}</span><h1>Choose a menu.<br />Then go deeper.</h1><p>The menu is now organized as real pages by category instead of one endless scroll. Pick the lane you want, then browse that menu on its own page.</p></div>
      </header>

      <section className="cmb-category-landing">
        <div className="cmb-results-head"><div><span>{profile.name}</span><h2>Menu departments</h2></div><p>{items.length} live items across {categories.length} categories</p></div>
        {loading ? <div className="cmb-state">Loading live menu…</div> : null}
        {error ? <div className="cmb-state">{error}</div> : null}
        {!loading && !error && !items.length ? <div className="cmb-state">No active menu items are published yet.</div> : null}
        <div className="cmb-category-grid">
          {categories.map((group) => (
            <Link className="cmb-category-card" href={`/${profile.slug}/menu/${group.slug}`} key={group.slug}>
              <div className="cmb-category-media">{group.image ? <img src={group.image} alt="" loading="lazy" /> : null}<div className="cmb-category-overlay" /></div>
              <div className="cmb-category-body"><span>{group.count} item{group.count === 1 ? '' : 's'}</span><h3>{labelize(group.name)}</h3><p>{group.preview.join(' · ')}</p><strong>Open this menu →</strong></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cmb-menu-actions"><Link href={`/${profile.slug}/order`}>Start an order</Link><Link href={`/${profile.slug}/catering`}>Plan {profile.serviceLabel.toLowerCase()}</Link><Link href={`/${profile.slug}/locations`}>Find a location</Link></section>
      <footer className="cmb-footer"><Link href={`/${profile.slug}`}>← {profile.name} home</Link><Link href={`/${profile.slug}/order`}>Build an order →</Link></footer>
    </main>
  );
}
