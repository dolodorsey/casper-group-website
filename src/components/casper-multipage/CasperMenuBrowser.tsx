'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { CasperSiteProfile } from '@/lib/casper-site-registry';
import { getCasperBrandExperience } from '@/lib/casper-brand-experience';
import './casper-menu-browser.css';

type MenuItem = {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  image_path?: string | null;
  featured?: boolean;
};

const PAGE_SIZE = 6;

function money(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Market';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function labelize(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function CasperMenuBrowser({ profile }: { profile: CasperSiteProfile }) {
  const experience = getCasperBrandExperience(profile.slug);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`/api/brand/${profile.slug}?resource=menu`, { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Menu unavailable.');
        const nextItems = Array.isArray(data.menu) ? data.menu : [];
        if (!active) return;
        setItems(nextItems);
        const firstCategory = nextItems.find((item: MenuItem) => item.category)?.category || 'Signature';
        setCategory(String(firstCategory));
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Menu unavailable.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [profile.slug]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category || 'Signature'))),
    [items]
  );

  const filtered = useMemo(
    () => items.filter((item) => (item.category || 'Signature') === category),
    [category, items]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectCategory = (next: string) => {
    setCategory(next);
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main
      className="cmb-site"
      data-variant={experience?.variant || 'halo'}
      style={{ '--cmb-accent': profile.accent, '--cmb-bright': profile.accentBright } as React.CSSProperties}
    >
      <nav className="cmb-nav">
        <Link href={`/${profile.slug}`} className="cmb-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.logo} alt={profile.name} />
        </Link>
        <div className="cmb-nav-links">
          <Link href={`/${profile.slug}`}>Home</Link>
          <Link href={`/${profile.slug}/order`}>Order</Link>
          <Link href={`/${profile.slug}/catering`}>{profile.serviceLabel}</Link>
          <Link href={`/${profile.slug}/locations`}>Locations</Link>
        </div>
        <Link className="cmb-order" href={`/${profile.slug}/order`}>Order</Link>
      </nav>

      <header className="cmb-hero">
        <div className="cmb-hero-media">
          {experience?.secondaryVideo ? (
            <video autoPlay muted loop playsInline poster={profile.heroImage}>
              <source src={experience.secondaryVideo} type="video/mp4" />
            </video>
          ) : (
            <Image src={experience?.gallery?.[0] || profile.heroImage} alt="" fill priority sizes="100vw" />
          )}
        </div>
        <div className="cmb-scrim" />
        <div className="cmb-hero-copy">
          <span>Menu / {profile.name}</span>
          <h1>Pick a lane.<br />Then pick your favorite.</h1>
          <p>No endless menu wall. Choose a category and browse a focused set of items at a time.</p>
        </div>
      </header>

      <section className="cmb-browser">
        <aside className="cmb-categories" aria-label="Menu categories">
          <div className="cmb-category-label">Menu categories</div>
          {categories.map((name) => (
            <button type="button" key={name} data-active={category === name} onClick={() => selectCategory(name)}>
              <span>{labelize(name)}</span>
              <small>{items.filter((item) => (item.category || 'Signature') === name).length}</small>
            </button>
          ))}
        </aside>

        <div className="cmb-results">
          <div className="cmb-results-head">
            <div>
              <span>Now browsing</span>
              <h2>{category ? labelize(category) : 'Menu'}</h2>
            </div>
            <p>{filtered.length} item{filtered.length === 1 ? '' : 's'} · page {page} of {totalPages}</p>
          </div>

          {loading ? <div className="cmb-state">Loading live menu…</div> : null}
          {error ? <div className="cmb-state">{error}</div> : null}
          {!loading && !error && !items.length ? <div className="cmb-state">No active menu items are published yet.</div> : null}

          <div className="cmb-grid">
            {visible.map((item) => (
              <article className="cmb-card" key={item.slug}>
                <div className="cmb-card-media">
                  {item.image_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_path} alt={item.name} loading="lazy" />
                  ) : (
                    <Image src={experience?.gallery?.[0] || profile.heroImage} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" />
                  )}
                </div>
                <div className="cmb-card-body">
                  <span>{labelize(item.category || 'Signature')}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description || 'A current brand menu item.'}</p>
                  <div className="cmb-card-bottom">
                    <strong>{money(item.price)}</strong>
                    <Link href={`/${profile.slug}/order`}>Order ↗</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="cmb-pagination">
              <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>← Previous</button>
              <span>{page} / {totalPages}</span>
              <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next →</button>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="cmb-footer">
        <Link href={`/${profile.slug}`}>← {profile.name} home</Link>
        <Link href={`/${profile.slug}/order`}>Build an order →</Link>
      </footer>
    </main>
  );
}
