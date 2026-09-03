'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { CasperSection, CasperSiteProfile } from '@/lib/casper-site-registry';
import './casper-multipage.css';

type MenuOption = {
  key?: string;
  label?: string;
  choices?: Array<{ name?: string; price?: number }>;
};

type MenuItem = {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  image_path?: string | null;
  featured?: boolean;
  heat?: number | string | null;
  tags?: string[] | null;
  options?: MenuOption[] | null;
};

type Location = {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  kitchen_hours?: string | null;
  delivery_platforms?: string[] | null;
  status?: string;
};

type CartItem = MenuItem & {
  quantity: number;
  selections: Record<string, string>;
};

type SubmissionResult = {
  ok?: boolean;
  message?: string;
  error?: string;
  confirmationCode?: string;
  estimatedSubtotal?: number;
};

const NAV: Array<{ section: CasperSection; label: string }> = [
  { section: 'menu', label: 'Menu' },
  { section: 'order', label: 'Order' },
  { section: 'catering', label: 'Catering' },
  { section: 'locations', label: 'Locations' },
  { section: 'about', label: 'About' },
  { section: 'rewards', label: 'Rewards' },
  { section: 'contact', label: 'Contact' },
];

const SECTION_COPY: Record<CasperSection, { eyebrow: string; title: string; lead: string }> = {
  menu: {
    eyebrow: 'The Menu',
    title: 'Built to crave. Built to move.',
    lead: 'Live menu data from the brand kitchen system. Availability and final preparation can vary by active location.',
  },
  order: {
    eyebrow: 'Order Request',
    title: 'Build the move.',
    lead: 'Create an order request from the live menu. The brand team confirms availability, timing, final total, and payment instructions.',
  },
  catering: {
    eyebrow: 'Groups & Events',
    title: 'Bring the brand to the room.',
    lead: 'Plan office orders, private events, drops, staffed service, and custom programs directly with this brand.',
  },
  locations: {
    eyebrow: 'Where To Find Us',
    title: 'Real kitchens. Verified availability.',
    lead: 'Only active Casper locations mapped to this exact concept are shown here. No placeholder addresses.',
  },
  about: {
    eyebrow: 'The Brand',
    title: 'A concept with its own point of view.',
    lead: 'Every Casper concept is operated as its own consumer brand with distinct food, identity, audience, standards, and growth lane.',
  },
  rewards: {
    eyebrow: 'First Access',
    title: 'Get closer to the drops.',
    lead: 'Join this brand’s own list for launches, openings, limited items, member offers, and first access.',
  },
  contact: {
    eyebrow: 'Brand Support',
    title: 'Talk to the right team.',
    lead: 'Customer support and general inquiries are recorded directly inside this brand’s own dataset—not a shared portfolio inbox.',
  },
};

function money(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Market';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function safeImage(src?: string | null) {
  if (!src) return null;
  if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) return src;
  return `/${src.replace(/^\/+/, '')}`;
}

function defaultSelections(item: MenuItem) {
  const selections: Record<string, string> = {};
  for (const option of item.options || []) {
    if (option.key && option.choices?.[0]?.name) selections[option.key] = option.choices[0].name;
  }
  return selections;
}

function ResultBox({ result }: { result: SubmissionResult | null }) {
  if (!result) return null;
  const failed = result.ok === false || Boolean(result.error);
  return (
    <div className={`cmp-result${failed ? ' cmp-error' : ''}`} role={failed ? 'alert' : 'status'}>
      <strong>{failed ? 'Request not completed' : 'Request recorded'}</strong>
      <p>{result.error || result.message || 'The brand team has the request.'}</p>
      {result.confirmationCode ? <p>Confirmation: {result.confirmationCode}</p> : null}
    </div>
  );
}

function Loading() {
  return (
    <div className="cmp-loading" aria-live="polite">
      <div className="cmp-spinner" aria-label="Loading" />
    </div>
  );
}

function MenuCards({ items, onAdd, compact = false }: { items: MenuItem[]; onAdd?: (item: MenuItem) => void; compact?: boolean }) {
  return (
    <div className="cmp-grid">
      {items.map((item) => {
        const image = safeImage(item.image_path);
        return (
          <article className="cmp-card" key={item.slug}>
            {image && !compact ? (
              <div className="cmp-card-media">
                {/* Menu imagery can originate from brand-managed paths, so a plain image keeps this data-driven. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={item.name} loading="lazy" />
              </div>
            ) : null}
            <div className="cmp-card-body">
              <div className="cmp-card-kicker">{item.category || 'Signature'}</div>
              <h3>{item.name}</h3>
              <p>{item.description || 'A current brand menu item.'}</p>
              <div className="cmp-card-footer">
                <span className="cmp-price">{money(item.price)}</span>
                {onAdd ? <button className="cmp-mini-button" type="button" onClick={() => onAdd(item)}>Add +</button> : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MenuPage({ profile }: { profile: CasperSiteProfile }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    let live = true;
    fetch(`/api/brand/${profile.slug}?resource=menu`, { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Menu unavailable.');
        if (live) setItems(Array.isArray(data.menu) ? data.menu : []);
      })
      .catch((err) => live && setError(err instanceof Error ? err.message : 'Menu unavailable.'))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [profile.slug]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((item) => item.category).filter(Boolean) as string[]))], [items]);
  const filtered = category === 'All' ? items : items.filter((item) => item.category === category);

  if (loading) return <Loading />;
  if (error) return <div className="cmp-empty-state"><h3>Menu temporarily unavailable.</h3><p>{error}</p></div>;
  if (!items.length) return <div className="cmp-empty-state"><h3>Menu update in progress.</h3><p>The kitchen system is live, but no active items are published for this concept right now.</p></div>;

  return (
    <>
      <div className="cmp-chip-row" aria-label="Menu categories">
        {categories.map((name) => (
          <button key={name} className="cmp-chip" data-active={category === name} onClick={() => setCategory(name)} type="button">{name}</button>
        ))}
      </div>
      <MenuCards items={filtered} />
    </>
  );
}

function OrderPage({ profile }: { profile: CasperSiteProfile }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`/api/brand/${profile.slug}?resource=menu`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => { if (live) setItems(Array.isArray(data.menu) ? data.menu : []); })
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [profile.slug]);

  const add = (item: MenuItem) => {
    setCart((current) => {
      const existing = current.find((line) => line.slug === item.slug);
      if (existing) return current.map((line) => line.slug === item.slug ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { ...item, quantity: 1, selections: defaultSelections(item) }];
    });
  };

  const changeQty = (slug: string, delta: number) => {
    setCart((current) => current.map((line) => line.slug === slug ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line).filter((line) => line.quantity > 0));
  };

  const subtotal = cart.reduce((sum, line) => sum + Number(line.price || 0) * line.quantity, 0);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) {
      setResult({ ok: false, error: 'Add at least one menu item before submitting.' });
      return;
    }
    const fd = new FormData(event.currentTarget);
    const fulfillment = String(fd.get('fulfillment') || 'pickup');
    const payload = {
      customerName: String(fd.get('customerName') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      fulfillment,
      requestedTime: String(fd.get('requestedTime') || ''),
      deliveryAddress: fulfillment === 'delivery' ? String(fd.get('deliveryAddress') || '') : '',
      notes: String(fd.get('notes') || ''),
      items: cart.map((line) => ({ slug: line.slug, quantity: line.quantity, selections: line.selections })),
      website: '',
    };

    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/brand/${profile.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'order', payload }),
      });
      const data = await res.json();
      setResult({ ...data, ok: res.ok && data.ok !== false });
      if (res.ok && data.ok !== false) setCart([]);
    } catch {
      setResult({ ok: false, error: 'Network error. Your request was not submitted.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="cmp-order-layout">
      <div className="cmp-order-menu">
        {items.length ? <MenuCards items={items} onAdd={add} compact /> : <div className="cmp-empty-state"><h3>No active menu items.</h3><p>The order request will open once this brand publishes an active menu.</p></div>}
      </div>
      <aside className="cmp-cart">
        <div className="cmp-cart-head"><h3>Your request</h3><span>{cart.reduce((sum, line) => sum + line.quantity, 0)} items</span></div>
        <div className="cmp-cart-list">
          {!cart.length ? <div className="cmp-cart-empty">Add items from the live menu. This is an order request—not a misleading fake checkout.</div> : cart.map((line) => (
            <div className="cmp-cart-item" key={line.slug}>
              <div><strong>{line.name}</strong><small>{money(line.price)} each</small></div>
              <div className="cmp-qty"><button type="button" onClick={() => changeQty(line.slug, -1)} aria-label={`Remove one ${line.name}`}>−</button><span>{line.quantity}</span><button type="button" onClick={() => changeQty(line.slug, 1)} aria-label={`Add one ${line.name}`}>+</button></div>
            </div>
          ))}
        </div>
        <div className="cmp-cart-total"><span>Estimated subtotal</span><span>{money(subtotal)}</span></div>
        <form className="cmp-form" onSubmit={submit}>
          <div className="cmp-form-grid">
            <div className="cmp-field cmp-field-full"><label>Name *</label><input name="customerName" required autoComplete="name" /></div>
            <div className="cmp-field"><label>Email</label><input name="email" type="email" autoComplete="email" /></div>
            <div className="cmp-field"><label>Phone *</label><input name="phone" type="tel" required autoComplete="tel" /></div>
            <div className="cmp-field"><label>Fulfillment *</label><select name="fulfillment" defaultValue="pickup"><option value="pickup">Pickup</option><option value="delivery">Delivery</option><option value="event_pickup">Event pickup</option></select></div>
            <div className="cmp-field"><label>Requested time</label><input name="requestedTime" placeholder="ASAP / 8:30 PM" /></div>
            <div className="cmp-field cmp-field-full"><label>Delivery address</label><input name="deliveryAddress" autoComplete="street-address" placeholder="Required only for delivery" /></div>
            <div className="cmp-field cmp-field-full"><label>Notes</label><textarea name="notes" placeholder="Allergies, special instructions, group details…" /></div>
          </div>
          <p className="cmp-form-note">Submitting sends a real request into {profile.name}’s own order system. The kitchen confirms availability, final pricing, timing, and payment instructions.</p>
          <ResultBox result={result} />
          <button className="cmp-button cmp-button-primary" disabled={submitting || !cart.length} type="submit">{submitting ? 'Submitting…' : 'Submit order request'}</button>
        </form>
      </aside>
    </div>
  );
}

function serviceStyles(profile: CasperSiteProfile) {
  if (profile.slug === 'taco-yaki') return [['drop_off', 'Drop-off'], ['pickup', 'Pickup'], ['live_grill', 'Live grill'], ['food_truck', 'Food truck'], ['custom', 'Custom']];
  if (profile.slug === 'pasta-bish') return [['drop_off', 'Drop-off'], ['pickup', 'Pickup'], ['staffed_buffet', 'Staffed buffet'], ['food_truck', 'Food truck'], ['custom', 'Custom']];
  if (profile.slug === 'angel-wings') return [['drop_off', 'Drop-off'], ['pickup', 'Pickup'], ['staffed_service', 'Staffed service'], ['food_truck', 'Food truck'], ['custom', 'Custom']];
  return [['drop_off', 'Drop-off'], ['pickup', 'Pickup'], ['staffed_service', 'Staffed service'], ['food_truck', 'Food truck'], ['custom', 'Custom']];
}

function ServicePage({ profile }: { profile: CasperSiteProfile }) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const requestType = profile.slug === 'espresso-co' ? String(fd.get('requestType') || 'event_catering') : String(fd.get('requestType') || 'catering');
    const payload = {
      customerName: String(fd.get('customerName') || ''),
      organization: String(fd.get('organization') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      eventDate: String(fd.get('eventDate') || ''),
      eventTime: String(fd.get('eventTime') || ''),
      guestCount: Number(fd.get('guestCount') || 0),
      requestType,
      serviceStyle: String(fd.get('serviceStyle') || 'drop_off'),
      venueAddress: String(fd.get('venueAddress') || ''),
      budget: String(fd.get('budget') || ''),
      preferences: String(fd.get('preferences') || ''),
      menuPreferences: String(fd.get('preferences') || ''),
      notes: String(fd.get('notes') || ''),
      website: '',
    };
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/brand/${profile.slug}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'service', payload }) });
      const data = await res.json();
      setResult({ ...data, ok: res.ok && data.ok !== false });
      if (res.ok && data.ok !== false) event.currentTarget.reset();
    } catch {
      setResult({ ok: false, error: 'Network error. Your service request was not submitted.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cmp-service-layout">
      <div className="cmp-info-panel">
        <div className="cmp-eyebrow">{profile.serviceLabel}</div>
        <h3>Make {profile.name} part of the occasion.</h3>
        <p>Built for group demand without losing the brand standard. The request goes directly into this concept’s own service pipeline.</p>
        <div className="cmp-info-list">
          <div className="cmp-info-row"><span>01</span><div><strong>Tell us the room.</strong><br /><small>Guests, timing, venue, budget.</small></div></div>
          <div className="cmp-info-row"><span>02</span><div><strong>Choose the service lane.</strong><br /><small>Drop-off, pickup, staffed, truck, or custom.</small></div></div>
          <div className="cmp-info-row"><span>03</span><div><strong>Get a scoped response.</strong><br /><small>The team confirms menu, logistics, and pricing.</small></div></div>
        </div>
      </div>
      <div className="cmp-form-panel">
        <form className="cmp-form" onSubmit={submit}>
          <div className="cmp-form-grid">
            <div className="cmp-field"><label>Name *</label><input name="customerName" required /></div>
            <div className="cmp-field"><label>Organization</label><input name="organization" /></div>
            <div className="cmp-field"><label>Email *</label><input name="email" type="email" required /></div>
            <div className="cmp-field"><label>Phone *</label><input name="phone" type="tel" required /></div>
            <div className="cmp-field"><label>Date *</label><input name="eventDate" type="date" required /></div>
            <div className="cmp-field"><label>Time</label><input name="eventTime" type="time" /></div>
            <div className="cmp-field"><label>Guest count *</label><input name="guestCount" type="number" min="10" max="20000" required /></div>
            <div className="cmp-field"><label>Request type</label>{profile.slug === 'espresso-co' ? <select name="requestType" defaultValue="event_catering"><option value="event_catering">Event catering</option><option value="office_subscription">Office subscription</option><option value="mobile_bar">Mobile coffee bar</option><option value="wholesale">Wholesale</option><option value="custom">Custom</option></select> : <select name="requestType" defaultValue="catering"><option value="catering">Catering</option><option value="group_order">Group order</option><option value="office_lunch">Office / team</option><option value="custom">Custom</option></select>}</div>
            <div className="cmp-field"><label>Service style</label><select name="serviceStyle" defaultValue="drop_off">{serviceStyles(profile).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
            <div className="cmp-field"><label>Budget</label><input name="budget" placeholder="$1,500 / flexible" /></div>
            <div className="cmp-field cmp-field-full"><label>Venue address</label><input name="venueAddress" /></div>
            <div className="cmp-field cmp-field-full"><label>Menu preferences</label><textarea name="preferences" placeholder="What should the food or beverage program feel like?" /></div>
            <div className="cmp-field cmp-field-full"><label>Notes</label><textarea name="notes" /></div>
          </div>
          <ResultBox result={result} />
          <button className="cmp-button cmp-button-primary" disabled={submitting} type="submit">{submitting ? 'Submitting…' : `Request ${profile.serviceLabel}`}</button>
        </form>
      </div>
    </div>
  );
}

function LocationsPage({ profile }: { profile: CasperSiteProfile }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    fetch(`/api/brand/${profile.slug}?resource=locations`, { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Locations unavailable.');
        if (live) setLocations(Array.isArray(data.locations) ? data.locations : []);
      })
      .catch((err) => live && setError(err instanceof Error ? err.message : 'Locations unavailable.'))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [profile.slug]);

  if (loading) return <Loading />;
  if (error) return <div className="cmp-empty-state"><h3>Location feed unavailable.</h3><p>{error}</p></div>;
  if (!locations.length) return <div className="cmp-empty-state"><h3>Opening alerts are the move.</h3><p>No active public kitchen is currently mapped to {profile.name}. We are not publishing placeholder addresses.</p><Link className="cmp-button cmp-button-primary" href={`/${profile.slug}/rewards`}>Join opening alerts</Link></div>;

  return (
    <div className="cmp-locations">
      {locations.map((location) => (
        <article className="cmp-location" key={location.id}>
          <div className="cmp-location-top"><h3>{location.name}</h3><span className="cmp-status">Open</span></div>
          <p>{location.address || [location.city, location.state].filter(Boolean).join(', ')}</p>
          {location.kitchen_hours ? <p><strong>Kitchen:</strong> {location.kitchen_hours}</p> : null}
          {location.delivery_platforms?.length ? <div className="cmp-platforms">{location.delivery_platforms.map((platform) => <span className="cmp-platform" key={platform}>{platform}</span>)}</div> : null}
        </article>
      ))}
    </div>
  );
}

function AboutPage({ profile }: { profile: CasperSiteProfile }) {
  return (
    <div className="cmp-about-grid">
      <div className="cmp-manifesto">
        <blockquote>{profile.tagline} <span>Not a template. A real brand.</span></blockquote>
        <p>{profile.description} The operating philosophy is simple: protect the product, preserve the visual identity, make ordering obvious, and engineer the concept to travel across kitchens, cities, events, and customer occasions without becoming generic.</p>
      </div>
      <div className="cmp-principles">
        <div className="cmp-principle"><strong>Standard 01</strong><h3>Brand first.</h3><p>{profile.name} keeps its own voice, menu lane, customer relationship, and visual language inside the Casper portfolio.</p></div>
        <div className="cmp-principle"><strong>Standard 02</strong><h3>Built for movement.</h3><p>Food, packaging, service, and digital ordering are designed around pickup, delivery, events, and multi-kitchen operations.</p></div>
        <div className="cmp-principle"><strong>Standard 03</strong><h3>Data stays isolated.</h3><p>Orders, service requests, rewards signups, and support requests route to this concept’s own backend records.</p></div>
        <div className="cmp-principle"><strong>Standard 04</strong><h3>Scale without dilution.</h3><p>Shared infrastructure creates leverage; the customer-facing brand still feels intentional and independent.</p></div>
      </div>
    </div>
  );
}

function RewardsPage({ profile }: { profile: CasperSiteProfile }) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const payload = {
      customerName: String(fd.get('customerName') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      birthday: String(fd.get('birthday') || ''),
      favorite: String(fd.get('favorite') || ''),
      smsOptIn: fd.get('smsOptIn') === 'on',
      emailOptIn: fd.get('emailOptIn') === 'on',
      website: '',
    };
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/brand/${profile.slug}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'club', payload }) });
      const data = await res.json();
      setResult({ ...data, ok: res.ok && data.ok !== false });
      if (res.ok && data.ok !== false) event.currentTarget.reset();
    } catch {
      setResult({ ok: false, error: 'Network error. Your signup was not submitted.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cmp-service-layout">
      <div className="cmp-info-panel">
        <div className="cmp-eyebrow">{profile.clubLabel}</div>
        <h3>First access belongs to the people paying attention.</h3>
        <p>Opening alerts, limited drops, birthday moments, new menu releases, event windows, and brand-specific offers.</p>
      </div>
      <div className="cmp-form-panel">
        <form className="cmp-form" onSubmit={submit}>
          <div className="cmp-form-grid">
            <div className="cmp-field cmp-field-full"><label>Name *</label><input name="customerName" required /></div>
            <div className="cmp-field"><label>Email *</label><input name="email" type="email" required /></div>
            <div className="cmp-field"><label>Phone</label><input name="phone" type="tel" /></div>
            <div className="cmp-field"><label>Birthday</label><input name="birthday" type="date" /></div>
            <div className="cmp-field"><label>Favorite {profile.itemNoun}</label><input name="favorite" /></div>
            <div className="cmp-field cmp-field-full"><label><input name="emailOptIn" type="checkbox" defaultChecked /> Email updates from {profile.name}</label></div>
            <div className="cmp-field cmp-field-full"><label><input name="smsOptIn" type="checkbox" /> SMS updates from {profile.name}</label></div>
          </div>
          <p className="cmp-form-note">Consent applies to this brand’s list. SMS signup requires a valid phone number.</p>
          <ResultBox result={result} />
          <button className="cmp-button cmp-button-primary" disabled={submitting} type="submit">{submitting ? 'Joining…' : `Join ${profile.clubLabel}`}</button>
        </form>
      </div>
    </div>
  );
}

function ContactPage({ profile }: { profile: CasperSiteProfile }) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const payload = {
      customerName: String(fd.get('customerName') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      subject: String(fd.get('subject') || ''),
      orderConfirmation: String(fd.get('orderConfirmation') || ''),
      message: String(fd.get('message') || ''),
    };
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`/api/brand/${profile.slug}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'contact', payload }) });
      const data = await res.json();
      setResult({ ...data, ok: res.ok && data.ok !== false });
      if (res.ok && data.ok !== false) event.currentTarget.reset();
    } catch {
      setResult({ ok: false, error: 'Network error. Your message was not submitted.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cmp-contact-layout">
      <div className="cmp-info-panel">
        <div className="cmp-eyebrow">{profile.name} Support</div>
        <h3>One brand. One record. No cross-routing.</h3>
        <p>Use this for order questions, product feedback, partnerships that belong specifically to {profile.name}, or general customer support.</p>
        <div className="cmp-info-list"><div className="cmp-info-row"><span>01</span><div>Include an order confirmation when the message is about an existing request.</div></div><div className="cmp-info-row"><span>02</span><div>The message is stored in {profile.name}’s isolated contact dataset.</div></div></div>
      </div>
      <div className="cmp-form-panel">
        <form className="cmp-form" onSubmit={submit}>
          <div className="cmp-form-grid">
            <div className="cmp-field"><label>Name *</label><input name="customerName" required /></div>
            <div className="cmp-field"><label>Email *</label><input name="email" type="email" required /></div>
            <div className="cmp-field"><label>Phone</label><input name="phone" type="tel" /></div>
            <div className="cmp-field"><label>Order confirmation</label><input name="orderConfirmation" /></div>
            <div className="cmp-field cmp-field-full"><label>Subject *</label><input name="subject" required /></div>
            <div className="cmp-field cmp-field-full"><label>Message *</label><textarea name="message" required /></div>
          </div>
          <ResultBox result={result} />
          <button className="cmp-button cmp-button-primary" disabled={submitting} type="submit">{submitting ? 'Sending…' : 'Send to brand team'}</button>
        </form>
      </div>
    </div>
  );
}

function SectionBody({ profile, section }: { profile: CasperSiteProfile; section: CasperSection }) {
  if (section === 'menu') return <MenuPage profile={profile} />;
  if (section === 'order') return <OrderPage profile={profile} />;
  if (section === 'catering') return <ServicePage profile={profile} />;
  if (section === 'locations') return <LocationsPage profile={profile} />;
  if (section === 'about') return <AboutPage profile={profile} />;
  if (section === 'rewards') return <RewardsPage profile={profile} />;
  return <ContactPage profile={profile} />;
}

export default function CasperBrandSectionPage({ profile, section }: { profile: CasperSiteProfile; section: CasperSection }) {
  const copy = SECTION_COPY[section];
  return (
    <div className="cmp-root" style={{ '--cmp-accent': profile.accent, '--cmp-accent-bright': profile.accentBright, '--cmp-secondary': profile.secondary } as React.CSSProperties}>
      <nav className="cmp-nav" aria-label={`${profile.name} navigation`}>
        <Link className="cmp-brand-link" href={`/${profile.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cmp-brand-mark" src={profile.logo} alt="" />
          <span className="cmp-brand-copy"><span className="cmp-brand-name">{profile.name}</span><span className="cmp-brand-format">{profile.format}</span></span>
        </Link>
        <div className="cmp-nav-links">{NAV.map((item) => <Link key={item.section} className="cmp-nav-link" data-active={section === item.section} href={`/${profile.slug}/${item.section}`}>{item.label}</Link>)}</div>
        <Link className="cmp-casper-link" href="/">Casper Group ↗</Link>
      </nav>

      <header className="cmp-hero">
        <div className="cmp-hero-media"><Image src={profile.heroImage} alt="" fill priority sizes="100vw" /></div>
        <div className="cmp-shell cmp-hero-content">
          <div className="cmp-eyebrow">{copy.eyebrow} · {profile.name}</div>
          <h1>{copy.title.split(' ').slice(0, -2).join(' ')} <em>{copy.title.split(' ').slice(-2).join(' ')}</em></h1>
          <p className="cmp-hero-lead">{copy.lead}</p>
          <div className="cmp-hero-actions"><Link className="cmp-button cmp-button-primary" href={`/${profile.slug}/order`}>Order {profile.name}</Link><Link className="cmp-button" href={`/${profile.slug}/locations`}>Find locations</Link></div>
        </div>
      </header>

      <main className="cmp-main">
        <div className="cmp-shell">
          <div className="cmp-page-head"><h2>{profile.tagline}</h2><p>{profile.description}</p></div>
          <SectionBody profile={profile} section={section} />
        </div>
      </main>

      <footer className="cmp-footer">
        <div className="cmp-shell cmp-footer-row"><p>© 2026 {profile.name}. A Casper Group brand.</p><div className="cmp-footer-links"><Link href={`/${profile.slug}/contact`}>Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/">Casper Group</Link></div></div>
      </footer>
    </div>
  );
}
