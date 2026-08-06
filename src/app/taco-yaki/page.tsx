'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import './taco-yaki.css';

const API_URL = 'https://qhgmukwoennurwuvmbhy.supabase.co/functions/v1/taco-yaki-intake';

const proteins = ['House Build', 'Chicken', 'Steak', 'Shrimp', 'Vegetable'];
const riceOptions = ['Hibachi Fried Rice', 'Steamed Rice', 'No Rice'];
const sauces = ['Yaki Sauce', 'Fire Sauce', 'Citrus Mayo', 'Garlic Butter'];
const extras = ['Chili Crunch', 'Extra Scallion', 'Extra Vegetables', 'Sesame Slaw'];

const fallbackMenu: MenuItem[] = [
  { id: '1', slug: 'fire-chicken-tacos', name: 'Fire Chicken Tacos', description: 'Three hibachi chicken tacos with grilled vegetables, scallion, sesame, and fire sauce.', category: 'tacos', price: 15, image_path: '/images/taco-hibachi.jpg', featured: true, spicy_level: 2, sort_order: 10 },
  { id: '2', slug: 'steak-yaki-tacos', name: 'Steak Yaki Tacos', description: 'Three seared steak tacos with onion, zucchini, garlic butter, and yaki sauce.', category: 'tacos', price: 18, image_path: '/images/taco-hibachi.jpg', featured: true, spicy_level: 1, sort_order: 20 },
  { id: '3', slug: 'shrimp-heat-tacos', name: 'Shrimp Heat Tacos', description: 'Three hibachi shrimp tacos with cabbage, scallion, chili crisp, and citrus mayo.', category: 'tacos', price: 19, image_path: '/images/taco-platter.jpg', featured: true, spicy_level: 3, sort_order: 30 },
  { id: '4', slug: 'chicken-hibachi-bowl', name: 'Chicken Hibachi Bowl', description: 'Hibachi chicken, fried rice, grilled vegetables, scallion, sesame, and house sauce.', category: 'bowls', price: 17, image_path: '/images/taco-platter.jpg', featured: true, spicy_level: 1, sort_order: 50 },
  { id: '5', slug: 'steak-hibachi-bowl', name: 'Steak Hibachi Bowl', description: 'Seared steak, fried rice, vegetables, garlic butter, scallion, and yaki sauce.', category: 'bowls', price: 21, image_path: '/images/taco-platter.jpg', featured: true, spicy_level: 1, sort_order: 60 },
  { id: '6', slug: 'shrimp-hibachi-bowl', name: 'Shrimp Hibachi Bowl', description: 'Hibachi shrimp, fried rice, vegetables, citrus mayo, and chili crunch.', category: 'bowls', price: 22, image_path: '/images/taco-platter.jpg', featured: true, spicy_level: 2, sort_order: 70 },
  { id: '7', slug: 'samurai-platter', name: 'Samurai Platter', description: 'Six tacos, fried rice, grilled vegetables, and three house sauces. Serves 2–3.', category: 'platters', price: 42, image_path: '/images/taco-platter.jpg', featured: true, spicy_level: 2, sort_order: 80 },
  { id: '8', slug: 'party-platter', name: 'Taco Yaki Party Platter', description: 'Twenty-four tacos, two proteins, fried rice, vegetables, and sauces.', category: 'platters', price: 118, image_path: '/images/taco-platter.jpg', featured: true, spicy_level: 2, sort_order: 90 },
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
  spicy_level: number;
  sort_order: number;
};

type CartItem = {
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string | null;
  protein: string;
  rice: string;
  sauce: string;
  extras: string[];
  specialInstructions: string;
};

type ModalName = 'order' | 'catering' | 'club' | null;
type ResultState = { title: string; body: string; code?: string } | null;
type ApiResponse = { ok: boolean; error?: string; message?: string; confirmationCode?: string; menu?: MenuItem[] };

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
    <div className="ty-modal-shell" role="dialog" aria-modal="true" aria-label={title}>
      <button className="ty-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="ty-modal-card">
        <div className="ty-modal-head">
          <div><span className="ty-eyebrow">{eyebrow}</span><h2>{title}</h2></div>
          <button className="ty-icon-button" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ResultPanel({ result, onDone }: { result: ResultState; onDone: () => void }) {
  if (!result) return null;
  return (
    <div className="ty-result" role="status">
      <span className="ty-result-mark">TY</span>
      <span className="ty-eyebrow">Request received</span>
      <h3>{result.title}</h3>
      <p>{result.body}</p>
      {result.code && <div className="ty-confirmation">{result.code}</div>}
      <button className="ty-button ty-button-primary" type="button" onClick={onDone}>Done</button>
    </div>
  );
}

export default function TacoYakiPage() {
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

  function customizationFor(item: MenuItem) {
    const customizable = ['tacos', 'bowls', 'platters'].includes(item.category);
    if (!customizable) return { protein: 'House Build', rice: 'No Rice', sauce: 'Yaki Sauce', chosenExtras: [] as string[] };
    const protein = (document.getElementById(`ty-protein-${item.slug}`) as HTMLSelectElement | null)?.value || 'House Build';
    const rice = (document.getElementById(`ty-rice-${item.slug}`) as HTMLSelectElement | null)?.value || 'Hibachi Fried Rice';
    const sauce = (document.getElementById(`ty-sauce-${item.slug}`) as HTMLSelectElement | null)?.value || 'Yaki Sauce';
    const chosenExtras = Array.from(document.querySelectorAll<HTMLInputElement>(`input[data-ty-extra="${item.slug}"]:checked`)).map((input) => input.value);
    return { protein, rice, sauce, chosenExtras };
  }

  function addToCart(item: MenuItem) {
    const { protein, rice, sauce, chosenExtras } = customizationFor(item);
    const proteinPrice = protein === 'Steak' ? 4 : protein === 'Shrimp' ? 5 : 0;
    const unitPrice = Number((item.price + proteinPrice + chosenExtras.length * 1.25).toFixed(2));
    const key = `${item.slug}-${protein}-${rice}-${sauce}-${chosenExtras.join('|')}`;
    setCart((current) => {
      const index = current.findIndex((cartItem) => `${cartItem.slug}-${cartItem.protein}-${cartItem.rice}-${cartItem.sauce}-${cartItem.extras.join('|')}` === key);
      if (index >= 0) return current.map((cartItem, itemIndex) => itemIndex === index ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
      return [...current, { slug: item.slug, name: item.name, unitPrice, quantity: 1, image: item.image_path, protein, rice, sauce, extras: chosenExtras, specialInstructions: '' }];
    });
    setToast(`${item.name} added to your basket.`);
  }

  function updateQuantity(index: number, next: number) {
    setCart((current) => current.flatMap((item, itemIndex) => itemIndex === index ? (next > 0 ? [{ ...item, quantity: next }] : []) : [item]));
  }

  function openOrder() {
    if (!cart.length) {
      setCartOpen(false);
      setToast('Add at least one item before starting an order request.');
      scrollToId('ty-menu');
      return;
    }
    setCartOpen(false);
    setFormError('');
    setResult(null);
    setModal('order');
  }

  async function callApi(type: 'order' | 'catering' | 'club', payload: Record<string, unknown>) {
    const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, payload }) });
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
        customerName: data.get('customerName'), email: data.get('email'), phone: data.get('phone'),
        fulfillment: data.get('fulfillment'), requestedTime: data.get('requestedTime'), deliveryAddress: data.get('deliveryAddress'),
        notes: data.get('notes'), website: data.get('website'),
        items: cart.map(({ slug, quantity, protein, rice, sauce, extras: chosenExtras, specialInstructions }) => ({ slug, quantity, protein, rice, sauce, extras: chosenExtras, specialInstructions })),
      });
      setCart([]);
      setResult({ title: 'Your fire order is with the team.', body: response.message || 'The Taco Yaki team will confirm your order.', code: response.confirmationCode });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to submit the order request.');
    } finally { setBusy(false); }
  }

  async function submitCatering(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await callApi('catering', {
        customerName: data.get('customerName'), organization: data.get('organization'), email: data.get('email'), phone: data.get('phone'),
        eventDate: data.get('eventDate'), eventTime: data.get('eventTime'), guestCount: Number(data.get('guestCount')),
        eventType: data.get('eventType'), serviceStyle: data.get('serviceStyle'), venueAddress: data.get('venueAddress'),
        budget: data.get('budget'), menuPreferences: data.get('menuPreferences'), notes: data.get('notes'), website: data.get('website'),
      });
      setResult({ title: 'Your event is on the grill.', body: response.message || 'The Taco Yaki catering team will follow up.', code: response.confirmationCode });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to submit the catering request.');
    } finally { setBusy(false); }
  }

  async function submitClub(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await callApi('club', {
        customerName: data.get('customerName'), email: data.get('email'), phone: data.get('phone'), birthday: data.get('birthday'),
        favoriteBuild: data.get('favoriteBuild'), smsOptIn: data.get('smsOptIn') === 'on', emailOptIn: data.get('emailOptIn') === 'on', website: data.get('website'),
      });
      setResult({ title: 'Welcome to the Fire Club.', body: response.message || 'You are in for drops and first access.' });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to join the Fire Club.');
    } finally { setBusy(false); }
  }

  function closeModal() {
    setModal(null);
    setResult(null);
    setFormError('');
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="ty-site">
      <div className="ty-announcement">Tacos meet hibachi · Order requests · Live grill · Catering</div>
      <header className="ty-header">
        <a className="ty-back" href="/">← Casper Group</a>
        <a className="ty-brand" href="#ty-top" aria-label="Taco Yaki home"><img src="/images/logo-taco-yaki.png" alt="Taco Yaki" /></a>
        <nav className={mobileOpen ? 'ty-nav ty-nav-open' : 'ty-nav'}>
          <a href="#ty-menu" onClick={() => setMobileOpen(false)}>Menu</a>
          <a href="#ty-system" onClick={() => setMobileOpen(false)}>Build</a>
          <a href="#ty-catering" onClick={() => setMobileOpen(false)}>Catering</a>
          <button onClick={() => { setModal('club'); setMobileOpen(false); setResult(null); }}>Fire Club</button>
        </nav>
        <div className="ty-header-actions">
          <button className="ty-basket-button" onClick={() => setCartOpen(true)}>Basket <span>{cartCount}</span></button>
          <button className="ty-menu-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle menu">☰</button>
        </div>
      </header>

      <section className="ty-hero" id="ty-top">
        <img src="/images/portal-taco-yaki.jpeg" alt="Taco Yaki hibachi tacos" />
        <div className="ty-hero-scrim" /><div className="ty-grain" />
        <div className="ty-hero-content">
          <span className="ty-eyebrow">A Casper Group Brand · Hibachi Taco Bar</span>
          <img className="ty-hero-logo" src="/images/logo-taco-yaki.png" alt="Taco Yaki" />
          <h1>Fold the <em>fire.</em></h1>
          <p>Hibachi-grilled proteins, crisp tacos, loaded bowls, bold sauces, and live-fire energy built for the city.</p>
          <div className="ty-hero-actions">
            <button className="ty-button ty-button-primary" onClick={() => scrollToId('ty-menu')}>Build Your Order</button>
            <button className="ty-button ty-button-secondary" onClick={() => { setModal('catering'); setResult(null); setFormError(''); }}>Book Live Fire</button>
          </div>
          <small>Order requests are reviewed before final availability, timing, total, and payment.</small>
        </div>
        <div className="ty-hero-stats"><div><strong>3</strong><span>Tacos per order</span></div><div><strong>4</strong><span>House sauces</span></div><div><strong>Live</strong><span>Grill service</span></div></div>
      </section>

      <section className="ty-section">
        <div className="ty-section-head"><div><span className="ty-eyebrow">Signature fire</span><h2>The builds that lead the line.</h2></div><button className="ty-text-link" onClick={() => scrollToId('ty-menu')}>Full menu →</button></div>
        <div className="ty-featured-grid">
          {featured.map((item) => <article className="ty-featured-card" key={item.slug}><img src={item.image_path || '/images/taco-hibachi.jpg'} alt={item.name} /><div className="ty-card-shade" /><div className="ty-featured-content"><span>{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div><strong>{money(item.price)}</strong><button onClick={() => addToCart(item)}>Add +</button></div></div></article>)}
        </div>
      </section>

      <section className="ty-story"><div className="ty-story-image"><img src="/images/taco-hibachi.jpg" alt="Hibachi tacos on the grill" /></div><div className="ty-story-copy"><span className="ty-eyebrow">Two formats. One standard.</span><h2>Japanese grill discipline. <em>Taco freedom.</em></h2><p>Taco Yaki is not random fusion. It is a controlled system: properly seared protein, vegetables with texture, rice with flavor, sauce with purpose, and a tortilla that can hold the whole move.</p><div className="ty-pillars"><div><strong>01</strong><span>Grill hot</span></div><div><strong>02</strong><span>Build balanced</span></div><div><strong>03</strong><span>Serve fast</span></div></div></div></section>

      <section className="ty-section ty-menu-section" id="ty-menu">
        <div className="ty-section-head ty-menu-head"><div><span className="ty-eyebrow">The launch menu</span><h2>Choose tacos, bowls, or the full flex.</h2><p>Estimated launch pricing. Protein upgrades and extras are calculated in the basket. Final details are confirmed by the team.</p></div><div className="ty-live-badge" data-status={menuStatus}>{menuStatus === 'live' ? 'Live menu' : 'Menu preview'}</div></div>
        <div className="ty-category-tabs">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item === 'all' ? 'All' : item}</button>)}</div>
        <div className="ty-menu-grid">
          {visibleMenu.map((item) => {
            const customizable = ['tacos', 'bowls', 'platters'].includes(item.category);
            return <article className="ty-menu-card" key={item.slug}>
              <div className="ty-menu-image"><img src={item.image_path || '/images/taco-hibachi.jpg'} alt={item.name} loading="lazy" />{item.featured && <span>Fire favorite</span>}</div>
              <div className="ty-menu-body"><div className="ty-menu-title"><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><p>{item.description}</p><div className="ty-item-meta"><span>{item.spicy_level ? `${item.spicy_level}/5 heat` : 'No heat'}</span><span>{item.category}</span></div>
              {customizable && <div className="ty-options"><label>Protein<select id={`ty-protein-${item.slug}`} defaultValue="House Build">{proteins.map((value) => <option key={value}>{value}</option>)}</select></label><label>Rice<select id={`ty-rice-${item.slug}`} defaultValue={item.category === 'tacos' ? 'No Rice' : 'Hibachi Fried Rice'}>{riceOptions.map((value) => <option key={value}>{value}</option>)}</select></label><label>Sauce<select id={`ty-sauce-${item.slug}`} defaultValue="Yaki Sauce">{sauces.map((value) => <option key={value}>{value}</option>)}</select></label><fieldset><legend>Extras · $1.25 each</legend>{extras.map((value) => <label className="ty-check-small" key={value}><input type="checkbox" value={value} data-ty-extra={item.slug} /><span>{value}</span></label>)}</fieldset></div>}
              <button className="ty-button ty-button-card" onClick={() => addToCart(item)}>Add to Basket</button></div>
            </article>;
          })}
        </div>
      </section>

      <section className="ty-system" id="ty-system"><div className="ty-system-copy"><span className="ty-eyebrow">The Taco Yaki system</span><h2>Build it around your appetite.</h2><p>Start with the format, control the protein, set the rice, choose the sauce, then finish the heat. The system stays fast without making every order feel the same.</p><div className="ty-steps"><div><span>01</span><strong>Format</strong><small>Tacos · Bowl · Platter</small></div><div><span>02</span><strong>Protein</strong><small>Chicken · Steak · Shrimp · Vegetable</small></div><div><span>03</span><strong>Sauce</strong><small>Yaki · Fire · Citrus mayo · Garlic butter</small></div><div><span>04</span><strong>Finish</strong><small>Chili crunch · Scallion · Vegetables · Slaw</small></div></div><button className="ty-button ty-button-primary" onClick={() => scrollToId('ty-menu')}>Build It Now</button></div><div className="ty-system-image"><img src="/images/taco-platter.jpg" alt="Taco Yaki platter" /></div></section>

      <section className="ty-catering" id="ty-catering"><img src="/images/taco-yaki-ninja.jpg" alt="Taco Yaki live grill catering" /><div className="ty-catering-shade" /><div className="ty-catering-content"><span className="ty-eyebrow">Catering & live grill</span><h2>Bring the fire to the function.</h2><p>Office lunches, private parties, festivals, production sets, food-truck service, and staffed live-grill experiences.</p><div className="ty-tags"><span>Drop-off</span><span>Pickup</span><span>Live grill</span><span>Food truck</span></div><button className="ty-button ty-button-primary" onClick={() => { setModal('catering'); setResult(null); setFormError(''); }}>Start Catering Request</button></div></section>

      <section className="ty-club"><div><span className="ty-eyebrow">The Fire Club</span><h2>First access to the next level.</h2><p>Join for new builds, sauce drops, event windows, birthday offers, platter deals, and invitation-only tastings.</p></div><button className="ty-button ty-button-primary" onClick={() => { setModal('club'); setResult(null); setFormError(''); }}>Join the Fire Club</button></section>

      <footer className="ty-footer"><div className="ty-footer-brand"><img src="/images/logo-taco-yaki.png" alt="Taco Yaki" /><p>Tacos Meet Hibachi.<br />A Casper Group brand.</p></div><div><strong>Order</strong><a href="#ty-menu">Menu</a><button onClick={() => setCartOpen(true)}>Basket</button><button onClick={() => { setModal('catering'); setResult(null); }}>Catering</button></div><div><strong>Discover</strong><a href="#ty-system">Build System</a><button onClick={() => { setModal('club'); setResult(null); }}>Fire Club</button><a href="/">Casper Group</a></div><div><strong>Service</strong><span>Atlanta, Georgia</span><span>Pickup · Delivery · Events</span><span>Final details confirmed by team</span></div></footer>
      <div className="ty-legal"><span>© 2026 Taco Yaki. All rights reserved.</span><span>A Casper Group Brand</span></div>

      {cartOpen && <aside className="ty-cart"><button className="ty-cart-backdrop" onClick={() => setCartOpen(false)} aria-label="Close basket" /><div className="ty-cart-panel"><div className="ty-cart-head"><div><span className="ty-eyebrow">Your basket</span><h2>{cartCount} item{cartCount === 1 ? '' : 's'}</h2></div><button className="ty-icon-button" onClick={() => setCartOpen(false)}>×</button></div><div className="ty-cart-items">{!cart.length && <div className="ty-empty"><h3>The grill is waiting.</h3><p>Add tacos, bowls, platters, sides, or drinks to begin.</p><button className="ty-button ty-button-secondary" onClick={() => { setCartOpen(false); scrollToId('ty-menu'); }}>Browse Menu</button></div>}{cart.map((item, index) => <div className="ty-cart-item" key={`${item.slug}-${item.protein}-${item.rice}-${item.sauce}-${item.extras.join('|')}`}><img src={item.image || '/images/taco-hibachi.jpg'} alt="" /><div><h3>{item.name}</h3><p>{[item.protein !== 'House Build' ? item.protein : '', item.rice, item.sauce, ...item.extras].filter(Boolean).join(' · ')}</p><strong>{money(item.unitPrice * item.quantity)}</strong></div><div className="ty-quantity"><button onClick={() => updateQuantity(index, item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button></div></div>)}</div>{!!cart.length && <div className="ty-cart-summary"><div><span>Estimated subtotal</span><strong>{money(subtotal)}</strong></div><p>Taxes, delivery, fees, availability, and final payment are confirmed by the team.</p><button className="ty-button ty-button-primary" onClick={openOrder}>Continue to Order Request</button><button className="ty-clear" onClick={() => setCart([])}>Clear basket</button></div>}</div></aside>}

      {modal === 'order' && <Modal title="Confirm your order request" eyebrow="Taco Yaki basket" onClose={closeModal}>{result ? <ResultPanel result={result} onDone={closeModal} /> : <form className="ty-form" onSubmit={submitOrder}><div className="ty-order-summary">{cart.map((item) => <div key={`${item.slug}-${item.protein}-${item.rice}-${item.sauce}-${item.extras.join('|')}`}><span>{item.quantity}× {item.name}<small>{[item.protein !== 'House Build' ? item.protein : '', item.rice, item.sauce, ...item.extras].filter(Boolean).join(' · ')}</small></span><strong>{money(item.quantity * item.unitPrice)}</strong></div>)}<div className="ty-form-total"><span>Estimated subtotal</span><strong>{money(subtotal)}</strong></div></div><div className="ty-form-grid two"><label>Full name<input name="customerName" required autoComplete="name" /></label><label>Phone<input name="phone" required inputMode="tel" autoComplete="tel" /></label><label>Email<input name="email" type="email" autoComplete="email" /></label><label>Fulfillment<select name="fulfillment" defaultValue="pickup"><option value="pickup">Pickup request</option><option value="delivery">Delivery request</option><option value="event_pickup">Event pickup</option></select></label><label>Preferred time<input name="requestedTime" placeholder="Example: Friday, 9:30 PM" /></label><label>Delivery address<input name="deliveryAddress" placeholder="Required for delivery" autoComplete="street-address" /></label></div><label>Order notes<textarea name="notes" rows={3} placeholder="Allergies, access instructions, or other details" /></label><input className="ty-honeypot" name="website" tabIndex={-1} autoComplete="off" /><p className="ty-disclaimer">Submitting creates an order request, not a charged transaction. The team confirms final price, availability, location, time, and payment.</p>{formError && <p className="ty-form-error">{formError}</p>}<button className="ty-button ty-button-primary ty-full" disabled={busy}>{busy ? 'Sending Request…' : 'Submit Order Request'}</button></form>}</Modal>}

      {modal === 'catering' && <Modal title="Bring the fire to your event" eyebrow="Taco Yaki catering" onClose={closeModal}>{result ? <ResultPanel result={result} onDone={closeModal} /> : <form className="ty-form" onSubmit={submitCatering}><div className="ty-form-grid two"><label>Full name<input name="customerName" required autoComplete="name" /></label><label>Organization or event<input name="organization" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Phone<input name="phone" required inputMode="tel" /></label><label>Event date<input name="eventDate" type="date" min={today} required /></label><label>Event time<input name="eventTime" type="time" /></label><label>Guest count<input name="guestCount" type="number" min="10" max="20000" required /></label><label>Event type<input name="eventType" placeholder="Birthday, office, festival…" /></label><label>Service style<select name="serviceStyle" defaultValue="drop_off"><option value="drop_off">Drop-off</option><option value="pickup">Pickup</option><option value="live_grill">Live grill</option><option value="food_truck">Food truck</option><option value="custom">Custom</option></select></label><label>Budget range<input name="budget" placeholder="$750–$2,000" /></label></div><label>Venue address<input name="venueAddress" autoComplete="street-address" /></label><label>Menu preferences<textarea name="menuPreferences" rows={3} placeholder="Tacos, bowls, proteins, sauces, vegetarian needs, platters" /></label><label>Event details<textarea name="notes" rows={4} placeholder="Access, power, staffing, service expectations, and timeline" /></label><input className="ty-honeypot" name="website" tabIndex={-1} autoComplete="off" />{formError && <p className="ty-form-error">{formError}</p>}<button className="ty-button ty-button-primary ty-full" disabled={busy}>{busy ? 'Sending Request…' : 'Submit Catering Request'}</button></form>}</Modal>}

      {modal === 'club' && <Modal title="Join the Taco Yaki Fire Club" eyebrow="Drops · deals · first access" onClose={closeModal}>{result ? <ResultPanel result={result} onDone={closeModal} /> : <form className="ty-form" onSubmit={submitClub}><div className="ty-form-grid two"><label>Full name<input name="customerName" required autoComplete="name" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Phone<input name="phone" inputMode="tel" /></label><label>Birthday<input name="birthday" placeholder="MM/DD" inputMode="numeric" /></label></div><label>Favorite build<input name="favoriteBuild" placeholder="Steak tacos, shrimp bowl, fire sauce…" /></label><label className="ty-check"><input type="checkbox" name="emailOptIn" defaultChecked /><span>Email me menu drops, offers, and launch windows.</span></label><label className="ty-check"><input type="checkbox" name="smsOptIn" /><span>Text me limited drops and order windows. Message and data rates may apply.</span></label><input className="ty-honeypot" name="website" tabIndex={-1} autoComplete="off" />{formError && <p className="ty-form-error">{formError}</p>}<button className="ty-button ty-button-primary ty-full" disabled={busy}>{busy ? 'Joining…' : 'Join the Fire Club'}</button></form>}</Modal>}

      {toast && <div className="ty-toast" role="status">{toast}</div>}
    </main>
  );
}
