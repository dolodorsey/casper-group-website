'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import './pasta-bish.css';

const API_URL = 'https://qhgmukwoennurwuvmbhy.supabase.co/functions/v1/pasta-bish-intake';

const noodles = ['Fettuccine', 'Rigatoni', 'Penne', 'Spaghetti'];
const sauces = ['Roasted Garlic Cream', 'Proper Marinara', 'Pink Sauce', 'Spicy Tomato Cream'];
const proteins = ['None', 'Chicken', 'Meatballs', 'Shrimp'];
const extras = ['Extra Parmesan', 'Mushrooms', 'Spinach', 'Chili Crunch'];

const fallbackMenu: MenuItem[] = [
  { id: '1', slug: 'creamy-bish', name: 'Creamy Bish', description: 'Fettuccine, roasted garlic cream, parmesan, cracked pepper, and parsley.', category: 'signature_pasta', price: 16, image_path: '/images/pasta-fettuccine.jpg', featured: true, vegetarian: true, spicy_level: 0, sort_order: 10 },
  { id: '2', slug: 'red-flag-rigatoni', name: 'Red Flag Rigatoni', description: 'Rigatoni, proper marinara, whipped ricotta, basil, and chili crunch.', category: 'signature_pasta', price: 16, image_path: '/images/pasta-marinara.jpg', featured: true, vegetarian: true, spicy_level: 2, sort_order: 20 },
  { id: '3', slug: 'pink-sauce-penne', name: 'Pink Sauce Penne', description: 'Penne in a tomato-cream sauce with parmesan and fresh basil.', category: 'signature_pasta', price: 17, image_path: '/images/pasta-bish.jpg', featured: true, vegetarian: true, spicy_level: 1, sort_order: 30 },
  { id: '4', slug: 'shrimp-alfredo', name: 'Shrimp Alfredo Energy', description: 'Fettuccine, seasoned shrimp, roasted garlic cream, parmesan, and herbs.', category: 'signature_pasta', price: 22, image_path: '/images/pasta-fettuccine.jpg', featured: true, vegetarian: false, spicy_level: 1, sort_order: 40 },
  { id: '5', slug: 'meatball-marinara', name: 'Big Meatball Behavior', description: 'Spaghetti, slow marinara, beef meatballs, parmesan, and basil.', category: 'signature_pasta', price: 20, image_path: '/images/pasta-marinara.jpg', featured: true, vegetarian: false, spicy_level: 1, sort_order: 50 },
  { id: '6', slug: 'chicken-parm-bowl', name: 'Chicken Parm Bowl', description: 'Breaded chicken, rigatoni, marinara, mozzarella, parmesan, and basil.', category: 'baked', price: 21, image_path: '/images/pasta-bish.jpg', featured: true, vegetarian: false, spicy_level: 1, sort_order: 60 },
  { id: '7', slug: 'build-your-own', name: 'Build Your Own Bish', description: 'Choose a noodle, sauce, protein, and finish. Base price includes noodle and sauce.', category: 'build_your_own', price: 14, image_path: '/images/pasta-bish.jpg', featured: true, vegetarian: true, spicy_level: 0, sort_order: 80 },
  { id: '8', slug: 'family-tray', name: 'Family Tray', description: 'A large-format pasta tray serving 6–8. Choose one sauce and one protein.', category: 'family', price: 68, image_path: '/images/pasta-marinara.jpg', featured: true, vegetarian: false, spicy_level: 0, sort_order: 120 },
];

type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_path: string | null;
  featured: boolean;
  vegetarian: boolean;
  spicy_level: number;
  sort_order: number;
};

type CartItem = {
  slug: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string | null;
  noodle: string;
  sauce: string;
  protein: string;
  extras: string[];
  specialInstructions: string;
};

type ModalName = 'order' | 'catering' | 'club' | null;

type ApiResponse = {
  ok: boolean;
  error?: string;
  message?: string;
  confirmationCode?: string;
  estimatedSubtotal?: number;
  menu?: MenuItem[];
};

type ResultState = {
  title: string;
  body: string;
  code?: string;
} | null;

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Modal({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="pb-modal-shell" role="dialog" aria-modal="true" aria-label={title}>
      <button className="pb-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="pb-modal-card">
        <div className="pb-modal-head">
          <div><span className="pb-eyebrow">{eyebrow}</span><h2>{title}</h2></div>
          <button className="pb-icon-button" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ResultPanel({ result, onDone }: { result: ResultState; onDone: () => void }) {
  if (!result) return null;
  return (
    <div className="pb-result" role="status">
      <span className="pb-result-mark">PB</span>
      <span className="pb-eyebrow">Request received</span>
      <h3>{result.title}</h3>
      <p>{result.body}</p>
      {result.code && <div className="pb-confirmation">{result.code}</div>}
      <button className="pb-button pb-button-primary" type="button" onClick={onDone}>Done</button>
    </div>
  );
}

export default function PastaBishPage() {
  const [menu, setMenu] = useState<MenuItem[]>(fallbackMenu);
  const [menuStatus, setMenuStatus] = useState<'loading' | 'live' | 'preview'>('loading');
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [result, setResult] = useState<ResultState>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}?resource=menu`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Menu unavailable');
        return response.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        if (!active || !data.ok || !Array.isArray(data.menu)) return;
        const normalized = data.menu.map((item) => ({ ...item, price: Number(item.price), spicy_level: Number(item.spicy_level || 0) }));
        if (normalized.length) {
          setMenu(normalized);
          setMenuStatus('live');
        }
      })
      .catch(() => active && setMenuStatus('preview'))
      .finally(() => active && setMenuStatus((current) => current === 'loading' ? 'preview' : current));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const categories = useMemo(() => ['all', ...Array.from(new Set(menu.map((item) => item.category)))], [menu]);
  const visibleMenu = useMemo(() => category === 'all' ? menu : menu.filter((item) => item.category === category), [category, menu]);
  const featured = useMemo(() => menu.filter((item) => item.featured).slice(0, 4), [menu]);
  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0), [cart]);

  function showToast(message: string) {
    setToast(message);
  }

  function customizationFor(item: MenuItem) {
    const customizable = ['signature_pasta', 'build_your_own', 'baked', 'family'].includes(item.category);
    if (!customizable) return { noodle: 'Standard', sauce: 'Standard', protein: 'None', chosenExtras: [] as string[] };
    const noodle = (document.getElementById(`pb-noodle-${item.slug}`) as HTMLSelectElement | null)?.value || noodles[0];
    const sauce = (document.getElementById(`pb-sauce-${item.slug}`) as HTMLSelectElement | null)?.value || sauces[0];
    const protein = (document.getElementById(`pb-protein-${item.slug}`) as HTMLSelectElement | null)?.value || 'None';
    const chosenExtras = Array.from(document.querySelectorAll<HTMLInputElement>(`input[data-pb-extra="${item.slug}"]:checked`)).map((input) => input.value);
    return { noodle, sauce, protein, chosenExtras };
  }

  function addToCart(item: MenuItem) {
    const { noodle, sauce, protein, chosenExtras } = customizationFor(item);
    const proteinPrice = protein === 'Shrimp' ? 7 : protein === 'Chicken' ? 5 : protein === 'Meatballs' ? 6 : 0;
    const unitPrice = Number((item.price + proteinPrice + chosenExtras.length * 1.5).toFixed(2));
    const key = `${item.slug}-${noodle}-${sauce}-${protein}-${chosenExtras.join('|')}`;

    setCart((current) => {
      const index = current.findIndex((cartItem) => `${cartItem.slug}-${cartItem.noodle}-${cartItem.sauce}-${cartItem.protein}-${cartItem.extras.join('|')}` === key);
      if (index >= 0) return current.map((cartItem, itemIndex) => itemIndex === index ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
      return [...current, {
        slug: item.slug,
        name: item.name,
        basePrice: item.price,
        unitPrice,
        quantity: 1,
        image: item.image_path,
        noodle,
        sauce,
        protein,
        extras: chosenExtras,
        specialInstructions: '',
      }];
    });
    showToast(`${item.name} added to your basket.`);
  }

  function updateQuantity(index: number, next: number) {
    setCart((current) => current.flatMap((item, itemIndex) => itemIndex === index ? (next > 0 ? [{ ...item, quantity: next }] : []) : [item]));
  }

  function openOrder() {
    if (!cart.length) {
      setCartOpen(false);
      showToast('Add at least one item before starting an order request.');
      scrollToId('pb-menu');
      return;
    }
    setCartOpen(false);
    setFormError('');
    setResult(null);
    setModal('order');
  }

  async function callApi(type: 'order' | 'catering' | 'club', payload: Record<string, unknown>) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    });
    const data = await response.json() as ApiResponse;
    if (!response.ok || !data.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
    return data;
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await callApi('order', {
        customerName: data.get('customerName'),
        email: data.get('email'),
        phone: data.get('phone'),
        fulfillment: data.get('fulfillment'),
        requestedTime: data.get('requestedTime'),
        deliveryAddress: data.get('deliveryAddress'),
        notes: data.get('notes'),
        website: data.get('website'),
        items: cart.map(({ slug, quantity, noodle, sauce, protein, extras: chosenExtras, specialInstructions }) => ({ slug, quantity, noodle, sauce, protein, extras: chosenExtras, specialInstructions })),
      });
      setCart([]);
      setResult({ title: 'Your pasta is with the team.', body: response.message || 'The Pasta Bish team will confirm the order.', code: response.confirmationCode });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to submit the order request.');
    } finally {
      setBusy(false);
    }
  }

  async function submitCatering(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await callApi('catering', {
        customerName: data.get('customerName'),
        organization: data.get('organization'),
        email: data.get('email'),
        phone: data.get('phone'),
        eventDate: data.get('eventDate'),
        eventTime: data.get('eventTime'),
        guestCount: Number(data.get('guestCount')),
        eventType: data.get('eventType'),
        serviceStyle: data.get('serviceStyle'),
        venueAddress: data.get('venueAddress'),
        budget: data.get('budget'),
        menuPreferences: data.get('menuPreferences'),
        notes: data.get('notes'),
        website: data.get('website'),
      });
      setResult({ title: 'Your function is officially sauced.', body: response.message || 'The catering team will follow up.', code: response.confirmationCode });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to submit the catering request.');
    } finally {
      setBusy(false);
    }
  }

  async function submitClub(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await callApi('club', {
        customerName: data.get('customerName'),
        email: data.get('email'),
        phone: data.get('phone'),
        birthday: data.get('birthday'),
        favoritePasta: data.get('favoritePasta'),
        smsOptIn: data.get('smsOptIn') === 'on',
        emailOptIn: data.get('emailOptIn') === 'on',
        website: data.get('website'),
      });
      setResult({ title: 'Welcome to the Pasta Bish Club.', body: response.message || 'You are in for drops and first access.' });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to join the club.');
    } finally {
      setBusy(false);
    }
  }

  function closeModal() {
    setModal(null);
    setResult(null);
    setFormError('');
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="pb-site">
      <div className="pb-announcement">Sauce first · Order requests · Family trays · Catering</div>
      <header className="pb-header">
        <a className="pb-back" href="/">← Casper Group</a>
        <a className="pb-brand" href="#pb-top" aria-label="Pasta Bish home"><img src="/images/logo-pasta-bish.png" alt="Pasta Bish" /></a>
        <nav className={mobileOpen ? 'pb-nav pb-nav-open' : 'pb-nav'} aria-label="Pasta Bish navigation">
          <a href="#pb-menu" onClick={() => setMobileOpen(false)}>Menu</a>
          <a href="#pb-build" onClick={() => setMobileOpen(false)}>Build a Bowl</a>
          <a href="#pb-catering" onClick={() => setMobileOpen(false)}>Catering</a>
          <button onClick={() => { setModal('club'); setMobileOpen(false); setResult(null); }}>Bish Club</button>
        </nav>
        <div className="pb-header-actions">
          <button className="pb-basket-button" onClick={() => setCartOpen(true)}>Basket <span>{cartCount}</span></button>
          <button className="pb-menu-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle menu">☰</button>
        </div>
      </header>

      <section className="pb-hero" id="pb-top">
        <img src="/images/portal-pasta-bish.jpeg" alt="Pasta Bish pasta bowl" />
        <div className="pb-hero-scrim" />
        <div className="pb-grain" />
        <div className="pb-hero-content">
          <span className="pb-eyebrow">A Casper Group Brand · Pasta Bar</span>
          <img className="pb-hero-logo" src="/images/logo-pasta-bish.png" alt="Pasta Bish" />
          <h1>Comfort with <em>attitude.</em></h1>
          <p>Sauce-first pasta bowls, baked favorites, loud flavor, and enough personality to make comfort food feel brand new.</p>
          <div className="pb-hero-actions">
            <button className="pb-button pb-button-primary" onClick={() => scrollToId('pb-menu')}>Build Your Bowl</button>
            <button className="pb-button pb-button-secondary" onClick={() => { setModal('catering'); setResult(null); setFormError(''); }}>Feed the Function</button>
          </div>
          <small>Order requests are reviewed before final availability, timing, total, and payment.</small>
        </div>
        <div className="pb-hero-stats">
          <div><strong>4</strong><span>Sauce directions</span></div>
          <div><strong>6–8</strong><span>Family tray servings</span></div>
          <div><strong>Late</strong><span>Night comfort</span></div>
        </div>
      </section>

      <section className="pb-section pb-featured-section" aria-labelledby="pb-featured-title">
        <div className="pb-section-head">
          <div><span className="pb-eyebrow">Signature behavior</span><h2 id="pb-featured-title">The bowls people talk about.</h2></div>
          <button className="pb-text-link" onClick={() => scrollToId('pb-menu')}>Full menu →</button>
        </div>
        <div className="pb-featured-grid">
          {featured.map((item) => (
            <article className="pb-featured-card" key={item.slug}>
              <img src={item.image_path || '/images/pasta-bish.jpg'} alt={item.name} />
              <div className="pb-featured-overlay" />
              <div className="pb-featured-content">
                <span>{item.category.replaceAll('_', ' ')}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div><strong>{money(item.price)}</strong><button onClick={() => addToCart(item)}>Add +</button></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-statement">
        <div className="pb-statement-image"><img src="/images/pasta-fettuccine.jpg" alt="Creamy Pasta Bish bowl" /></div>
        <div className="pb-statement-copy">
          <span className="pb-eyebrow">The operating standard</span>
          <h2>Generous, saucy, and built to <em>survive the ride.</em></h2>
          <p>Pasta Bish is engineered around craveable sauces, portion discipline, texture, delivery hold time, and packaging that keeps the bowl looking like it left the kitchen.</p>
          <div className="pb-pillars">
            <div><strong>01</strong><span>Sauce properly</span></div>
            <div><strong>02</strong><span>Portion honestly</span></div>
            <div><strong>03</strong><span>Pack with respect</span></div>
          </div>
        </div>
      </section>

      <section className="pb-section pb-menu-section" id="pb-menu" aria-labelledby="pb-menu-title">
        <div className="pb-section-head pb-menu-head">
          <div>
            <span className="pb-eyebrow">The launch menu</span>
            <h2 id="pb-menu-title">Pick your situation.</h2>
            <p>Estimated launch pricing. Protein and extra-finish pricing is calculated in the basket. Final availability and payment are confirmed by the team.</p>
          </div>
          <div className="pb-live-badge" data-status={menuStatus}>{menuStatus === 'live' ? 'Live menu' : 'Menu preview'}</div>
        </div>
        <div className="pb-category-tabs" role="tablist" aria-label="Pasta Bish menu categories">
          {categories.map((item) => (
            <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>
              {item === 'all' ? 'All' : item.replaceAll('_', ' ')}
            </button>
          ))}
        </div>
        <div className="pb-menu-grid">
          {visibleMenu.map((item) => {
            const customizable = ['signature_pasta', 'build_your_own', 'baked', 'family'].includes(item.category);
            return (
              <article className="pb-menu-card" key={item.slug}>
                <div className="pb-menu-image">
                  <img src={item.image_path || '/images/pasta-bish.jpg'} alt={item.name} loading="lazy" />
                  {item.featured && <span>House favorite</span>}
                </div>
                <div className="pb-menu-body">
                  <div className="pb-menu-title-row"><h3>{item.name}</h3><strong>{money(item.price)}</strong></div>
                  <p>{item.description}</p>
                  <div className="pb-item-meta"><span>{item.vegetarian ? 'Vegetarian base' : 'Contains meat or seafood'}</span><span>{item.spicy_level ? `${item.spicy_level}/5 heat` : 'No heat'}</span></div>
                  {customizable && (
                    <div className="pb-options">
                      <label>Noodle<select id={`pb-noodle-${item.slug}`} defaultValue={item.slug.includes('rigatoni') ? 'Rigatoni' : item.slug.includes('penne') ? 'Penne' : item.slug.includes('meatball') ? 'Spaghetti' : 'Fettuccine'}>{noodles.map((value) => <option key={value}>{value}</option>)}</select></label>
                      <label>Sauce<select id={`pb-sauce-${item.slug}`} defaultValue={item.slug.includes('red') || item.slug.includes('meatball') || item.slug.includes('parm') ? 'Proper Marinara' : item.slug.includes('pink') ? 'Pink Sauce' : 'Roasted Garlic Cream'}>{sauces.map((value) => <option key={value}>{value}</option>)}</select></label>
                      <label>Protein<select id={`pb-protein-${item.slug}`} defaultValue={item.slug.includes('shrimp') ? 'Shrimp' : item.slug.includes('meatball') ? 'Meatballs' : item.slug.includes('chicken') ? 'Chicken' : 'None'}>{proteins.map((value) => <option key={value}>{value}</option>)}</select></label>
                      <fieldset><legend>Extra finishes · $1.50 each</legend>{extras.map((value) => <label className="pb-check-small" key={value}><input type="checkbox" value={value} data-pb-extra={item.slug} /><span>{value}</span></label>)}</fieldset>
                    </div>
                  )}
                  <button className="pb-button pb-button-card" onClick={() => addToCart(item)}>Add to Basket</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="pb-build-section" id="pb-build">
        <div className="pb-build-copy">
          <span className="pb-eyebrow">Build Your Own Bish</span>
          <h2>Four moves. One serious bowl.</h2>
          <p>Pick the noodle. Pick the sauce. Add the protein. Finish it how you like. The system is flexible without turning the kitchen into chaos.</p>
          <div className="pb-build-steps">
            <div><span>01</span><strong>Noodle</strong><small>Fettuccine · Rigatoni · Penne · Spaghetti</small></div>
            <div><span>02</span><strong>Sauce</strong><small>Garlic cream · Marinara · Pink · Spicy tomato cream</small></div>
            <div><span>03</span><strong>Protein</strong><small>Chicken · Meatballs · Shrimp · Keep it vegetarian</small></div>
            <div><span>04</span><strong>Finish</strong><small>Parmesan · Mushrooms · Spinach · Chili crunch</small></div>
          </div>
          <button className="pb-button pb-button-primary" onClick={() => { setCategory('build_your_own'); scrollToId('pb-menu'); }}>Build It Now</button>
        </div>
        <div className="pb-build-image"><img src="/images/pasta-bish.jpg" alt="Build your own Pasta Bish bowl" /></div>
      </section>

      <section className="pb-catering" id="pb-catering">
        <img src="/images/pasta-marinara.jpg" alt="Pasta Bish catering" />
        <div className="pb-catering-overlay" />
        <div className="pb-catering-content">
          <span className="pb-eyebrow">Catering & family trays</span>
          <h2>Feed everybody without serving boring food.</h2>
          <p>Office lunches, birthdays, production sets, game nights, private events, and large-format comfort. Tell us the headcount and the occasion.</p>
          <div className="pb-service-tags"><span>Drop-off</span><span>Pickup</span><span>Staffed buffet</span><span>Food truck</span></div>
          <button className="pb-button pb-button-primary" onClick={() => { setModal('catering'); setResult(null); setFormError(''); }}>Start Catering Request</button>
        </div>
      </section>

      <section className="pb-club-section">
        <div>
          <span className="pb-eyebrow">The Pasta Bish Club</span>
          <h2>First access tastes better.</h2>
          <p>Join for launch windows, sauce drops, family-tray deals, birthday offers, and invitation-only tastings.</p>
        </div>
        <button className="pb-button pb-button-primary" onClick={() => { setModal('club'); setResult(null); setFormError(''); }}>Join the Bish Club</button>
      </section>

      <footer className="pb-footer">
        <div className="pb-footer-brand"><img src="/images/logo-pasta-bish.png" alt="Pasta Bish" /><p>Comfort with Attitude.<br />A Casper Group brand.</p></div>
        <div><strong>Order</strong><a href="#pb-menu">Menu</a><button onClick={() => setCartOpen(true)}>Basket</button><button onClick={() => { setModal('catering'); setResult(null); }}>Catering</button></div>
        <div><strong>Discover</strong><a href="#pb-build">Build a Bowl</a><button onClick={() => { setModal('club'); setResult(null); }}>Bish Club</button><a href="/">Casper Group</a></div>
        <div><strong>Service</strong><span>Atlanta, Georgia</span><span>Pickup · Delivery · Events</span><span>Final details confirmed by team</span></div>
      </footer>
      <div className="pb-legal"><span>© 2026 Pasta Bish. All rights reserved.</span><span>A Casper Group Brand</span></div>

      {cartOpen && (
        <aside className="pb-cart" aria-label="Your Pasta Bish basket">
          <button className="pb-cart-backdrop" onClick={() => setCartOpen(false)} aria-label="Close basket" />
          <div className="pb-cart-panel">
            <div className="pb-cart-head"><div><span className="pb-eyebrow">Your basket</span><h2>{cartCount} item{cartCount === 1 ? '' : 's'}</h2></div><button className="pb-icon-button" onClick={() => setCartOpen(false)}>×</button></div>
            <div className="pb-cart-items">
              {!cart.length && <div className="pb-empty"><h3>The bowl starts empty.</h3><p>Add a pasta, side, dessert, or family tray to begin.</p><button className="pb-button pb-button-secondary" onClick={() => { setCartOpen(false); scrollToId('pb-menu'); }}>Browse Menu</button></div>}
              {cart.map((item, index) => (
                <div className="pb-cart-item" key={`${item.slug}-${item.noodle}-${item.sauce}-${item.protein}-${item.extras.join('|')}`}>
                  <img src={item.image || '/images/pasta-bish.jpg'} alt="" />
                  <div><h3>{item.name}</h3><p>{[item.noodle, item.sauce, item.protein !== 'None' ? item.protein : '', ...item.extras].filter((value) => value && value !== 'Standard').join(' · ') || 'Standard item'}</p><strong>{money(item.unitPrice * item.quantity)}</strong></div>
                  <div className="pb-quantity"><button onClick={() => updateQuantity(index, item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button></div>
                </div>
              ))}
            </div>
            {!!cart.length && <div className="pb-cart-summary"><div><span>Estimated subtotal</span><strong>{money(subtotal)}</strong></div><p>Taxes, delivery, service fees, availability, and final payment are confirmed by the team.</p><button className="pb-button pb-button-primary" onClick={openOrder}>Continue to Order Request</button><button className="pb-clear" onClick={() => setCart([])}>Clear basket</button></div>}
          </div>
        </aside>
      )}

      {modal === 'order' && (
        <Modal title="Confirm your order request" eyebrow="Pasta Bish basket" onClose={closeModal}>
          {result ? <ResultPanel result={result} onDone={closeModal} /> : (
            <form className="pb-form" onSubmit={submitOrder}>
              <div className="pb-order-summary">
                {cart.map((item) => <div key={`${item.slug}-${item.noodle}-${item.sauce}-${item.protein}-${item.extras.join('|')}`}><span>{item.quantity}× {item.name}<small>{[item.noodle, item.sauce, item.protein !== 'None' ? item.protein : '', ...item.extras].filter(Boolean).join(' · ')}</small></span><strong>{money(item.quantity * item.unitPrice)}</strong></div>)}
                <div className="pb-form-total"><span>Estimated subtotal</span><strong>{money(subtotal)}</strong></div>
              </div>
              <div className="pb-form-grid two">
                <label>Full name<input name="customerName" required autoComplete="name" /></label>
                <label>Phone<input name="phone" required inputMode="tel" autoComplete="tel" /></label>
                <label>Email<input name="email" type="email" autoComplete="email" /></label>
                <label>Fulfillment<select name="fulfillment" required defaultValue="pickup"><option value="pickup">Pickup request</option><option value="delivery">Delivery request</option><option value="event_pickup">Event pickup</option></select></label>
                <label>Preferred time<input name="requestedTime" placeholder="Example: Friday, 8:30 PM" /></label>
                <label>Delivery address<input name="deliveryAddress" autoComplete="street-address" placeholder="Required for delivery" /></label>
              </div>
              <label>Order notes<textarea name="notes" rows={3} placeholder="Allergies, access instructions, preferred contact method, or other details" /></label>
              <input className="pb-honeypot" name="website" tabIndex={-1} autoComplete="off" />
              <p className="pb-disclaimer">Submitting creates an order request, not a charged transaction. The team confirms final price, availability, location, time, and payment.</p>
              {formError && <p className="pb-form-error">{formError}</p>}
              <button className="pb-button pb-button-primary pb-full" disabled={busy}>{busy ? 'Sending Request…' : 'Submit Order Request'}</button>
            </form>
          )}
        </Modal>
      )}

      {modal === 'catering' && (
        <Modal title="Feed the whole function" eyebrow="Pasta Bish catering" onClose={closeModal}>
          {result ? <ResultPanel result={result} onDone={closeModal} /> : (
            <form className="pb-form" onSubmit={submitCatering}>
              <div className="pb-form-grid two">
                <label>Full name<input name="customerName" required autoComplete="name" /></label>
                <label>Organization or event<input name="organization" autoComplete="organization" /></label>
                <label>Email<input name="email" type="email" required autoComplete="email" /></label>
                <label>Phone<input name="phone" required inputMode="tel" autoComplete="tel" /></label>
                <label>Event date<input name="eventDate" type="date" min={today} required /></label>
                <label>Event time<input name="eventTime" type="time" /></label>
                <label>Guest count<input name="guestCount" type="number" min="10" max="20000" required /></label>
                <label>Event type<input name="eventType" placeholder="Birthday, office, production set…" /></label>
                <label>Service style<select name="serviceStyle" defaultValue="drop_off"><option value="drop_off">Drop-off</option><option value="pickup">Pickup</option><option value="staffed_buffet">Staffed buffet</option><option value="food_truck">Food truck</option><option value="custom">Custom</option></select></label>
                <label>Budget range<input name="budget" placeholder="$500–$1,500" /></label>
              </div>
              <label>Venue address<input name="venueAddress" autoComplete="street-address" /></label>
              <label>Menu preferences<textarea name="menuPreferences" rows={3} placeholder="Sauces, proteins, vegetarian needs, family trays, sides, desserts" /></label>
              <label>Event details<textarea name="notes" rows={4} placeholder="Access, staffing, service expectations, dietary needs, and timeline" /></label>
              <input className="pb-honeypot" name="website" tabIndex={-1} autoComplete="off" />
              {formError && <p className="pb-form-error">{formError}</p>}
              <button className="pb-button pb-button-primary pb-full" disabled={busy}>{busy ? 'Sending Request…' : 'Submit Catering Request'}</button>
            </form>
          )}
        </Modal>
      )}

      {modal === 'club' && (
        <Modal title="Join the Pasta Bish Club" eyebrow="Drops · deals · first access" onClose={closeModal}>
          {result ? <ResultPanel result={result} onDone={closeModal} /> : (
            <form className="pb-form" onSubmit={submitClub}>
              <div className="pb-form-grid two">
                <label>Full name<input name="customerName" required autoComplete="name" /></label>
                <label>Email<input name="email" type="email" required autoComplete="email" /></label>
                <label>Phone<input name="phone" inputMode="tel" autoComplete="tel" /></label>
                <label>Birthday<input name="birthday" placeholder="MM/DD" inputMode="numeric" /></label>
              </div>
              <label>Favorite pasta<input name="favoritePasta" placeholder="Alfredo, rigatoni, pink sauce…" /></label>
              <label className="pb-check"><input type="checkbox" name="emailOptIn" defaultChecked /><span>Email me sauce drops, offers, and launch windows.</span></label>
              <label className="pb-check"><input type="checkbox" name="smsOptIn" /><span>Text me limited drops and ordering windows. Message and data rates may apply.</span></label>
              <input className="pb-honeypot" name="website" tabIndex={-1} autoComplete="off" />
              {formError && <p className="pb-form-error">{formError}</p>}
              <button className="pb-button pb-button-primary pb-full" disabled={busy}>{busy ? 'Joining…' : 'Join the Bish Club'}</button>
            </form>
          )}
        </Modal>
      )}

      {toast && <div className="pb-toast" role="status">{toast}</div>}
    </main>
  );
}
