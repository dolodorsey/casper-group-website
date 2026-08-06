'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import type { CasperCommerceBrand } from '@/lib/casper-commerce-config';
import './casper-commerce.css';

const API_URL = 'https://qhgmukwoennurwuvmbhy.supabase.co/functions/v1/casper-brand-intake';

type Choice = { name: string; price: number };
type OptionDefinition = { key: string; label: string; choices: Choice[] };
type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_path: string | null;
  featured: boolean;
  heat: number;
  tags: string[];
  options: OptionDefinition[];
  sort_order: number;
};
type CartItem = {
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string | null;
  selections: Record<string, string>;
  specialInstructions: string;
};
type ModalName = 'order' | 'service' | 'club' | null;
type ResultState = { title: string; body: string; code?: string } | null;
type ApiResponse = {
  ok: boolean;
  error?: string;
  message?: string;
  confirmationCode?: string;
  estimatedSubtotal?: number;
  menu?: MenuItem[];
};

type ThemeStyle = CSSProperties & {
  '--cbc-accent': string;
  '--cbc-accent-bright': string;
  '--cbc-accent-dark': string;
  '--cbc-secondary': string;
};

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function titleCase(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectionKey(item: CartItem) {
  return `${item.slug}:${Object.entries(item.selections).map(([key, value]) => `${key}=${value}`).join('|')}`;
}

function Modal({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="cbc-modal-shell" role="dialog" aria-modal="true" aria-label={title}>
      <button className="cbc-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="cbc-modal-card">
        <div className="cbc-modal-head">
          <div><span className="cbc-eyebrow">{eyebrow}</span><h2>{title}</h2></div>
          <button className="cbc-icon-button" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ResultPanel({ result, onDone, mark }: { result: ResultState; onDone: () => void; mark: string }) {
  if (!result) return null;
  return (
    <div className="cbc-result" role="status">
      <span className="cbc-result-mark">{mark}</span>
      <span className="cbc-eyebrow">Request received</span>
      <h3>{result.title}</h3>
      <p>{result.body}</p>
      {result.code && <div className="cbc-confirmation">{result.code}</div>}
      <button className="cbc-button cbc-button-primary" type="button" onClick={onDone}>Done</button>
    </div>
  );
}

export default function CasperCommercePage({ brand }: { brand: CasperCommerceBrand }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuStatus, setMenuStatus] = useState<'loading' | 'live' | 'unavailable'>('loading');
  const [category, setCategory] = useState('all');
  const [selections, setSelections] = useState<Record<string, Record<string, string>>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [result, setResult] = useState<ResultState>(null);
  const [toast, setToast] = useState('');

  const themeStyle: ThemeStyle = {
    '--cbc-accent': brand.accent,
    '--cbc-accent-bright': brand.accentBright,
    '--cbc-accent-dark': brand.accentDark,
    '--cbc-secondary': brand.secondary,
  };

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}?brand=${encodeURIComponent(brand.slug)}&resource=menu`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Menu unavailable');
        return response.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        if (!active || !data.ok || !Array.isArray(data.menu)) throw new Error('Menu unavailable');
        const normalized = data.menu.map((item) => ({
          ...item,
          price: Number(item.price),
          heat: Number(item.heat || 0),
          tags: Array.isArray(item.tags) ? item.tags : [],
          options: Array.isArray(item.options)
            ? item.options.map((option) => ({
                ...option,
                choices: Array.isArray(option.choices)
                  ? option.choices.map((choice) => ({ ...choice, price: Number(choice.price || 0) }))
                  : [],
              }))
            : [],
        }));
        setMenu(normalized);
        setSelections(Object.fromEntries(normalized.map((item) => [
          item.slug,
          Object.fromEntries(item.options.map((option) => [option.key, option.choices[0]?.name || ''])),
        ])));
        setMenuStatus('live');
      })
      .catch(() => active && setMenuStatus('unavailable'));
    return () => { active = false; };
  }, [brand.slug]);

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
  const brandMark = brand.name.split(/\s+/).map((word) => word[0]).join('').slice(0, 3).toUpperCase();

  function setItemSelection(itemSlug: string, optionKey: string, value: string) {
    setSelections((current) => ({
      ...current,
      [itemSlug]: { ...current[itemSlug], [optionKey]: value },
    }));
  }

  function pricedSelection(item: MenuItem) {
    const itemSelections = selections[item.slug] || {};
    let optionTotal = 0;
    const normalized: Record<string, string> = {};
    item.options.forEach((option) => {
      const selectedName = itemSelections[option.key] || option.choices[0]?.name || '';
      const selected = option.choices.find((choice) => choice.name === selectedName) || option.choices[0];
      normalized[option.key] = selected?.name || '';
      optionTotal += Number(selected?.price || 0);
    });
    return { normalized, unitPrice: Math.max(0, Number((item.price + optionTotal).toFixed(2))) };
  }

  function addToCart(item: MenuItem) {
    const { normalized, unitPrice } = pricedSelection(item);
    const candidate: CartItem = {
      slug: item.slug,
      name: item.name,
      unitPrice,
      quantity: 1,
      image: item.image_path,
      selections: normalized,
      specialInstructions: '',
    };
    const key = selectionKey(candidate);
    setCart((current) => {
      const index = current.findIndex((cartItem) => selectionKey(cartItem) === key);
      if (index >= 0) return current.map((cartItem, itemIndex) => itemIndex === index ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
      return [...current, candidate];
    });
    setToast(`${item.name} added to your basket.`);
  }

  function updateQuantity(index: number, next: number) {
    setCart((current) => current.flatMap((item, itemIndex) => itemIndex === index ? (next > 0 ? [{ ...item, quantity: next }] : []) : [item]));
  }

  function openOrder() {
    if (!cart.length) {
      setCartOpen(false);
      setToast(`Add at least one ${brand.itemNoun} before starting an order request.`);
      scrollToId(`${brand.slug}-menu`);
      return;
    }
    setCartOpen(false);
    setFormError('');
    setResult(null);
    setModal('order');
  }

  function openModal(name: ModalName) {
    setFormError('');
    setResult(null);
    setModal(name);
  }

  function closeModal() {
    setModal(null);
    setResult(null);
    setFormError('');
  }

  async function callApi(type: 'order' | 'service' | 'club', payload: Record<string, unknown>) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand: brand.slug, type, payload }),
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
        items: cart.map(({ slug, quantity, selections: chosen, specialInstructions }) => ({ slug, quantity, selections: chosen, specialInstructions })),
      });
      setCart([]);
      setResult({
        title: `Your ${brand.name} request is with the team.`,
        body: response.message || 'The team will confirm availability, timing, final total, and payment.',
        code: response.confirmationCode,
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to submit the order request.');
    } finally {
      setBusy(false);
    }
  }

  async function submitService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await callApi('service', {
        customerName: data.get('customerName'),
        organization: data.get('organization'),
        email: data.get('email'),
        phone: data.get('phone'),
        eventDate: data.get('eventDate'),
        eventTime: data.get('eventTime'),
        guestCount: Number(data.get('guestCount') || 0),
        requestType: data.get('requestType'),
        serviceStyle: data.get('serviceStyle'),
        venueAddress: data.get('venueAddress'),
        budget: data.get('budget'),
        preferences: data.get('preferences'),
        notes: data.get('notes'),
        website: data.get('website'),
      });
      setResult({
        title: `Your ${brand.name} service brief is in.`,
        body: response.message || 'The team will review the scope and follow up.',
        code: response.confirmationCode,
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to submit the service request.');
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
        favorite: data.get('favorite'),
        smsOptIn: data.get('smsOptIn') === 'on',
        emailOptIn: data.get('emailOptIn') === 'on',
        website: data.get('website'),
      });
      setResult({ title: `Welcome to ${brand.clubName}.`, body: response.message || 'You are in for drops, offers, and first access.' });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to complete the signup.');
    } finally {
      setBusy(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="cbc-site" style={themeStyle}>
      <div className="cbc-announcement">{brand.format} · Order requests · Group service · First access</div>
      <header className="cbc-header">
        <a className="cbc-back" href="/">← Casper Group</a>
        <a className="cbc-brand" href={`#${brand.slug}-top`} aria-label={`${brand.name} home`}><img src={brand.logo} alt={brand.name} /></a>
        <nav className={mobileOpen ? 'cbc-nav cbc-nav-open' : 'cbc-nav'} aria-label={`${brand.name} navigation`}>
          <a href={`#${brand.slug}-menu`} onClick={() => setMobileOpen(false)}>Menu</a>
          <a href={`#${brand.slug}-system`} onClick={() => setMobileOpen(false)}>The System</a>
          <a href={`#${brand.slug}-service`} onClick={() => setMobileOpen(false)}>Group Service</a>
          <button onClick={() => { openModal('club'); setMobileOpen(false); }}>{brand.clubName}</button>
        </nav>
        <div className="cbc-header-actions">
          <button className="cbc-basket-button" onClick={() => setCartOpen(true)}>Basket <span>{cartCount}</span></button>
          <button className="cbc-menu-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle menu">☰</button>
        </div>
      </header>

      <section className="cbc-hero" id={`${brand.slug}-top`}>
        <img src={brand.heroImage} alt={`${brand.name} food and brand experience`} />
        <div className="cbc-hero-scrim" /><div className="cbc-grain" />
        <div className="cbc-hero-content">
          <span className="cbc-eyebrow">{brand.eyebrow}</span>
          <img className="cbc-hero-logo" src={brand.logo} alt={brand.name} />
          <h1>{brand.heroLead} <em>{brand.heroAccent}</em><br />{brand.heroTail}</h1>
          <p>{brand.heroCopy}</p>
          <div className="cbc-hero-actions">
            <button className="cbc-button cbc-button-primary" onClick={() => scrollToId(`${brand.slug}-menu`)}>{brand.orderCta}</button>
            <button className="cbc-button cbc-button-secondary" onClick={() => openModal('service')}>{brand.serviceCta}</button>
          </div>
          <small>Online requests are reviewed before final availability, timing, total, location, and payment.</small>
        </div>
        <div className="cbc-hero-stats">
          <div><strong>Live</strong><span>Menu data</span></div>
          <div><strong>Built</strong><span>Group service</span></div>
          <div><strong>Direct</strong><span>Customer capture</span></div>
        </div>
      </section>

      <section className="cbc-section">
        <div className="cbc-section-head">
          <div><span className="cbc-eyebrow">{brand.signatureEyebrow}</span><h2>{brand.signatureHeading}</h2></div>
          <button className="cbc-text-link" onClick={() => scrollToId(`${brand.slug}-menu`)}>Complete menu →</button>
        </div>
        <div className="cbc-featured-grid">
          {featured.map((item) => (
            <article className="cbc-featured-card" key={item.slug}>
              <img src={item.image_path || brand.heroImage} alt={item.name} />
              <div className="cbc-card-shade" />
              <div className="cbc-featured-content">
                <span>{titleCase(item.category)}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div><strong>{money(pricedSelection(item).unitPrice)}</strong><button onClick={() => addToCart(item)}>Add +</button></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cbc-story">
        <div className="cbc-story-image"><img src={brand.heroImage} alt={`${brand.name} operating standard`} /></div>
        <div className="cbc-story-copy">
          <span className="cbc-eyebrow">{brand.standardEyebrow}</span>
          <h2>{brand.standardHeading} <em>{brand.standardAccent}</em></h2>
          <p>{brand.standardCopy}</p>
          <div className="cbc-pillars">
            {brand.standards.map((standard, index) => <div key={standard}><strong>0{index + 1}</strong><span>{standard}</span></div>)}
          </div>
        </div>
      </section>

      <section className="cbc-section cbc-menu-section" id={`${brand.slug}-menu`} aria-labelledby={`${brand.slug}-menu-title`}>
        <div className="cbc-section-head cbc-menu-head">
          <div><span className="cbc-eyebrow">{brand.menuEyebrow}</span><h2 id={`${brand.slug}-menu-title`}>{brand.menuHeading}</h2><p>Estimated launch pricing. Selected upgrades appear in the basket. The team confirms availability, fulfillment, final total, and payment.</p></div>
          <div className="cbc-live-badge" data-status={menuStatus}>{menuStatus === 'live' ? 'Live menu' : menuStatus === 'loading' ? 'Loading menu' : 'Menu unavailable'}</div>
        </div>
        {menuStatus === 'unavailable' ? (
          <div className="cbc-menu-error"><h3>The live menu is temporarily unavailable.</h3><p>The storefront remains online, but ordering is paused until the menu service reconnects.</p></div>
        ) : (
          <>
            <div className="cbc-category-tabs" role="tablist" aria-label={`${brand.name} menu categories`}>
              {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>{item === 'all' ? 'All' : titleCase(item)}</button>)}
            </div>
            <div className="cbc-menu-grid">
              {visibleMenu.map((item) => {
                const price = pricedSelection(item).unitPrice;
                return (
                  <article className="cbc-menu-card" key={item.slug}>
                    <div className="cbc-menu-image"><img src={item.image_path || brand.heroImage} alt={item.name} loading="lazy" />{item.featured && <span>House favorite</span>}</div>
                    <div className="cbc-menu-body">
                      <div className="cbc-menu-title"><h3>{item.name}</h3><strong>{money(price)}</strong></div>
                      <p>{item.description}</p>
                      <div className="cbc-item-meta">
                        {item.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
                        {item.heat > 0 && <span>{item.heat}/5 heat</span>}
                      </div>
                      {!!item.options.length && (
                        <div className="cbc-options">
                          {item.options.map((option) => (
                            <label key={option.key}>{option.label}
                              <select value={selections[item.slug]?.[option.key] || option.choices[0]?.name || ''} onChange={(event) => setItemSelection(item.slug, option.key, event.target.value)}>
                                {option.choices.map((choice) => <option key={choice.name} value={choice.name}>{choice.name}{choice.price ? ` (${choice.price > 0 ? '+' : ''}${money(choice.price)})` : ''}</option>)}
                              </select>
                            </label>
                          ))}
                        </div>
                      )}
                      <button className="cbc-button cbc-button-card" onClick={() => addToCart(item)}>Add to Basket</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      <section className="cbc-system" id={`${brand.slug}-system`}>
        <div className="cbc-system-copy">
          <span className="cbc-eyebrow">{brand.systemEyebrow}</span>
          <h2>{brand.systemHeading}</h2>
          <p>{brand.systemCopy}</p>
          <div className="cbc-steps">
            {brand.systemSteps.map((step, index) => <div key={step.title}><span>0{index + 1}</span><strong>{step.title}</strong><small>{step.detail}</small></div>)}
          </div>
          <button className="cbc-button cbc-button-primary" onClick={() => scrollToId(`${brand.slug}-menu`)}>Build It Now</button>
        </div>
        <div className="cbc-system-image"><img src={brand.heroImage} alt={`${brand.name} menu system`} /></div>
      </section>

      <section className="cbc-service" id={`${brand.slug}-service`}>
        <img src={brand.heroImage} alt={`${brand.name} group service`} />
        <div className="cbc-service-shade" />
        <div className="cbc-service-content">
          <span className="cbc-eyebrow">{brand.serviceEyebrow}</span>
          <h2>{brand.serviceHeading}</h2>
          <p>{brand.serviceCopy}</p>
          <div className="cbc-tags">{brand.serviceTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <button className="cbc-button cbc-button-primary" onClick={() => openModal('service')}>Start Service Request</button>
        </div>
      </section>

      <section className="cbc-club">
        <div><span className="cbc-eyebrow">{brand.clubName}</span><h2>{brand.clubHeading}</h2><p>{brand.clubCopy}</p></div>
        <button className="cbc-button cbc-button-primary" onClick={() => openModal('club')}>Join {brand.clubName}</button>
      </section>

      <footer className="cbc-footer">
        <div className="cbc-footer-brand"><img src={brand.logo} alt={brand.name} /><p>{brand.heroAccent}<br />A Casper Group brand.</p></div>
        <div><strong>Order</strong><a href={`#${brand.slug}-menu`}>Menu</a><button onClick={() => setCartOpen(true)}>Basket</button><button onClick={() => openModal('service')}>Group Service</button></div>
        <div><strong>Discover</strong><a href={`#${brand.slug}-system`}>The System</a><button onClick={() => openModal('club')}>{brand.clubName}</button><a href="/">Casper Group</a></div>
        <div><strong>Service</strong><span>Atlanta, Georgia</span><span>Pickup · Delivery · Events</span><span>Final details confirmed by team</span></div>
      </footer>
      <div className="cbc-legal"><span>© 2026 {brand.name}. All rights reserved.</span><span>{brand.legalNote || 'A Casper Group Brand'}</span></div>

      {cartOpen && (
        <aside className="cbc-cart" aria-label={`Your ${brand.name} basket`}>
          <button className="cbc-cart-backdrop" onClick={() => setCartOpen(false)} aria-label="Close basket" />
          <div className="cbc-cart-panel">
            <div className="cbc-cart-head"><div><span className="cbc-eyebrow">Your basket</span><h2>{cartCount} item{cartCount === 1 ? '' : 's'}</h2></div><button className="cbc-icon-button" onClick={() => setCartOpen(false)}>×</button></div>
            <div className="cbc-cart-items">
              {!cart.length && <div className="cbc-empty"><h3>Your basket is open.</h3><p>Add at least one {brand.itemNoun} to begin.</p><button className="cbc-button cbc-button-secondary" onClick={() => { setCartOpen(false); scrollToId(`${brand.slug}-menu`); }}>Browse Menu</button></div>}
              {cart.map((item, index) => (
                <div className="cbc-cart-item" key={selectionKey(item)}>
                  <img src={item.image || brand.heroImage} alt="" />
                  <div><h3>{item.name}</h3><p>{Object.values(item.selections).filter(Boolean).join(' · ') || 'House build'}</p><strong>{money(item.unitPrice * item.quantity)}</strong></div>
                  <div className="cbc-quantity"><button onClick={() => updateQuantity(index, item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button></div>
                </div>
              ))}
            </div>
            {!!cart.length && <div className="cbc-cart-summary"><div><span>Estimated subtotal</span><strong>{money(subtotal)}</strong></div><p>Taxes, delivery, service fees, availability, and final payment are confirmed by the team.</p><button className="cbc-button cbc-button-primary" onClick={openOrder}>Continue to Order Request</button><button className="cbc-clear" onClick={() => setCart([])}>Clear basket</button></div>}
          </div>
        </aside>
      )}

      {modal === 'order' && (
        <Modal title="Confirm your order request" eyebrow={`${brand.name} basket`} onClose={closeModal}>
          {result ? <ResultPanel result={result} onDone={closeModal} mark={brandMark} /> : (
            <form className="cbc-form" onSubmit={submitOrder}>
              <div className="cbc-order-summary">
                {cart.map((item) => <div key={selectionKey(item)}><span>{item.quantity}× {item.name}<small>{Object.values(item.selections).filter(Boolean).join(' · ')}</small></span><strong>{money(item.quantity * item.unitPrice)}</strong></div>)}
                <div className="cbc-form-total"><span>Estimated subtotal</span><strong>{money(subtotal)}</strong></div>
              </div>
              <div className="cbc-form-grid two">
                <label>Full name<input name="customerName" required autoComplete="name" /></label>
                <label>Phone<input name="phone" required inputMode="tel" autoComplete="tel" /></label>
                <label>Email<input name="email" type="email" autoComplete="email" /></label>
                <label>Fulfillment<select name="fulfillment" defaultValue="pickup"><option value="pickup">Pickup request</option><option value="delivery">Delivery request</option><option value="event_pickup">Event pickup</option></select></label>
                <label>Preferred time<input name="requestedTime" placeholder="Example: Friday, 8:30 PM" /></label>
                <label>Delivery address<input name="deliveryAddress" placeholder="Required for delivery" autoComplete="street-address" /></label>
              </div>
              <label>Order notes<textarea name="notes" rows={3} placeholder="Allergies, access instructions, preferred contact method, or other details" /></label>
              <input className="cbc-honeypot" name="website" tabIndex={-1} autoComplete="off" />
              <p className="cbc-disclaimer">Submitting creates an order request, not a charged transaction. The team confirms final price, availability, location, time, and payment.</p>
              {formError && <p className="cbc-form-error">{formError}</p>}
              <button className="cbc-button cbc-button-primary cbc-full" disabled={busy}>{busy ? 'Sending Request…' : 'Submit Order Request'}</button>
            </form>
          )}
        </Modal>
      )}

      {modal === 'service' && (
        <Modal title={brand.serviceHeading} eyebrow={brand.serviceEyebrow} onClose={closeModal}>
          {result ? <ResultPanel result={result} onDone={closeModal} mark={brandMark} /> : (
            <form className="cbc-form" onSubmit={submitService}>
              <div className="cbc-form-grid two">
                <label>Full name<input name="customerName" required autoComplete="name" /></label>
                <label>Organization or event<input name="organization" autoComplete="organization" /></label>
                <label>Email<input name="email" type="email" required autoComplete="email" /></label>
                <label>Phone<input name="phone" required inputMode="tel" autoComplete="tel" /></label>
                <label>Request type<select name="requestType" defaultValue={brand.serviceOptions[0]?.value}>{brand.serviceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                <label>Service style<select name="serviceStyle" defaultValue="drop_off"><option value="drop_off">Drop-off</option><option value="pickup">Pickup</option><option value="staffed_service">Staffed service</option><option value="mobile_service">Mobile service</option><option value="custom">Custom</option></select></label>
                <label>Requested date<input name="eventDate" type="date" min={today} /></label>
                <label>Requested time<input name="eventTime" type="time" /></label>
                <label>Guest count<input name="guestCount" type="number" min="1" max="20000" /></label>
                <label>Budget range<input name="budget" placeholder="$500–$1,500" /></label>
              </div>
              <label>Venue or delivery address<input name="venueAddress" autoComplete="street-address" /></label>
              <label>Menu and service preferences<textarea name="preferences" rows={3} placeholder="Menu mix, dietary needs, service format, packaging, branding, and quantity" /></label>
              <label>Additional details<textarea name="notes" rows={4} placeholder="Access, staffing, power, timing, loading, and decision deadline" /></label>
              <input className="cbc-honeypot" name="website" tabIndex={-1} autoComplete="off" />
              {formError && <p className="cbc-form-error">{formError}</p>}
              <button className="cbc-button cbc-button-primary cbc-full" disabled={busy}>{busy ? 'Sending Request…' : 'Submit Service Request'}</button>
            </form>
          )}
        </Modal>
      )}

      {modal === 'club' && (
        <Modal title={`Join ${brand.clubName}`} eyebrow="Drops · offers · first access" onClose={closeModal}>
          {result ? <ResultPanel result={result} onDone={closeModal} mark={brandMark} /> : (
            <form className="cbc-form" onSubmit={submitClub}>
              <div className="cbc-form-grid two">
                <label>Full name<input name="customerName" required autoComplete="name" /></label>
                <label>Email<input name="email" type="email" required autoComplete="email" /></label>
                <label>Phone<input name="phone" inputMode="tel" autoComplete="tel" /></label>
                <label>Birthday<input name="birthday" placeholder="MM/DD" inputMode="numeric" /></label>
              </div>
              <label>{brand.favoriteLabel}<input name="favorite" placeholder={brand.favoritePlaceholder} /></label>
              <label className="cbc-check"><input type="checkbox" name="emailOptIn" defaultChecked /><span>Email me brand drops, offers, and launch windows.</span></label>
              <label className="cbc-check"><input type="checkbox" name="smsOptIn" /><span>Text me limited drops and order windows. Message and data rates may apply.</span></label>
              <input className="cbc-honeypot" name="website" tabIndex={-1} autoComplete="off" />
              {formError && <p className="cbc-form-error">{formError}</p>}
              <button className="cbc-button cbc-button-primary cbc-full" disabled={busy}>{busy ? 'Joining…' : `Join ${brand.clubName}`}</button>
            </form>
          )}
        </Modal>
      )}

      {toast && <div className="cbc-toast" role="status">{toast}</div>}
    </main>
  );
}
