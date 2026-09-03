'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { casperSiteProfiles } from '@/lib/casper-site-registry';
import './casper-corporate.css';

export type CorporatePageKind = 'brands' | 'about' | 'locations' | 'franchise' | 'careers' | 'press' | 'contact' | 'privacy' | 'terms';

type Location = {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  kitchen_hours?: string | null;
  delivery_platforms?: string[] | null;
};

type FormState = {
  ok: boolean;
  message: string;
  submissionId?: string;
  crmStatus?: string;
};

const NAV: Array<{ kind: CorporatePageKind; label: string }> = [
  { kind: 'brands', label: 'Brands' },
  { kind: 'about', label: 'About' },
  { kind: 'locations', label: 'Locations' },
  { kind: 'franchise', label: 'Franchise' },
  { kind: 'careers', label: 'Careers' },
  { kind: 'press', label: 'Press' },
  { kind: 'contact', label: 'Contact' },
];

const COPY: Record<CorporatePageKind, { kicker: string; title: string; accent: string; lead: string; head: string; intro: string }> = {
  brands: {
    kicker: 'The Portfolio',
    title: 'Twelve concepts.',
    accent: 'Zero generic brands.',
    lead: 'Casper Group is a multi-concept restaurant platform built to scale distinct consumer brands through shared operating infrastructure without flattening their identities.',
    head: 'Every concept has its own lane.',
    intro: 'Explore each brand as an independent customer experience with its own menu, ordering, catering, locations, rewards, and support system.',
  },
  about: {
    kicker: 'About Casper Group',
    title: 'A restaurant platform',
    accent: 'built for movement.',
    lead: 'We build culture-forward food concepts designed for delivery, nightlife, hospitality venues, events, pop-ups, and scalable kitchen networks.',
    head: 'Shared infrastructure. Independent brands.',
    intro: 'Casper Group creates leverage in operations, data, technology, sourcing, and expansion while keeping every consumer concept visually and commercially distinct.',
  },
  locations: {
    kicker: 'Kitchen Network',
    title: 'More places to serve.',
    accent: 'Less dead space.',
    lead: 'Our location model activates kitchens inside hospitality, entertainment, nightlife, and standalone environments—then maps the right brands to the right demand.',
    head: 'Active Casper kitchens.',
    intro: 'This page reads directly from the operating location database. Only locations marked open are displayed.',
  },
  franchise: {
    kicker: 'Growth & Partnerships',
    title: 'Bring the platform',
    accent: 'into your market.',
    lead: 'Venue operators, kitchen owners, strategic partners, and qualified operators can explore market, licensing, kitchen, or future franchise structures with Casper Group.',
    head: 'Choose the right expansion lane.',
    intro: 'We do not force one model everywhere. The structure should match the market, kitchen footprint, operating partner, and brand mix.',
  },
  careers: {
    kicker: 'Build With Us',
    title: 'Hospitality needs',
    accent: 'operators and creators.',
    lead: 'Casper Group sits at the intersection of food, nightlife, logistics, brand, technology, and customer experience. We hire for execution across all of it.',
    head: 'Find your lane inside the system.',
    intro: 'Submit interest once for the Casper Group corporate team. Restaurant-specific customer teams remain separate from this corporate talent pipeline.',
  },
  press: {
    kicker: 'Media & Press',
    title: 'The story is bigger',
    accent: 'than one kitchen.',
    lead: 'Casper Group is building a modern restaurant portfolio around multi-brand operations, hospitality partnerships, digital commerce, and culture-forward consumer concepts.',
    head: 'Press, interviews, and media requests.',
    intro: 'Use the media request form for interviews, company background, founder requests, photography coordination, or concept-specific press access.',
  },
  contact: {
    kicker: 'Corporate Contact',
    title: 'Get to the',
    accent: 'right conversation.',
    lead: 'Corporate partnerships, vendors, venues, investors, operators, media, and general Casper Group inquiries belong here. Customer issues for a restaurant should go through that restaurant’s own Contact page.',
    head: 'Casper Group corporate intake.',
    intro: 'Every accepted submission is stored durably before any external CRM delivery is attempted.',
  },
  privacy: {
    kicker: 'Privacy',
    title: 'Clear data handling.',
    accent: 'No mystery.',
    lead: 'This policy explains the baseline information practices for Casper Group Worldwide and the restaurant experiences hosted on this website.',
    head: 'Privacy Policy',
    intro: 'Effective September 3, 2026. This policy is a website operating baseline and should be reviewed alongside applicable state, federal, platform, and program-specific requirements.',
  },
  terms: {
    kicker: 'Website Terms',
    title: 'Use the platform',
    accent: 'with clarity.',
    lead: 'These terms establish baseline rules for website use, order requests, service inquiries, intellectual property, and customer communications.',
    head: 'Terms of Use',
    intro: 'Effective September 3, 2026. Final purchase, catering, licensing, franchise, employment, and partnership arrangements may require separate written agreements.',
  },
};

function CorporateForm({ formType, title, description, fields }: { formType: string; title: string; description: string; fields: Array<{ name: string; label: string; type?: string; placeholder?: string; options?: string[]; full?: boolean; required?: boolean }> }) {
  const [sending, setSending] = useState(false);
  const [state, setState] = useState<FormState | null>(null);
  const keyRef = useRef('');

  useEffect(() => {
    keyRef.current = crypto.randomUUID();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') || '');
    const email = String(fd.get('email') || '');
    const phone = String(fd.get('phone') || '');
    const extra: Record<string, string> = {};
    for (const field of fields) extra[field.name] = String(fd.get(field.name) || '');

    const url = new URL(window.location.href);
    const utm = {
      source: url.searchParams.get('utm_source') || '',
      medium: url.searchParams.get('utm_medium') || '',
      campaign: url.searchParams.get('utm_campaign') || '',
      term: url.searchParams.get('utm_term') || '',
      content: url.searchParams.get('utm_content') || '',
    };

    setSending(true);
    setState(null);
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-idempotency-key': keyRef.current || crypto.randomUUID() },
        body: JSON.stringify({
          entityKey: 'casper_group',
          idempotencyKey: keyRef.current,
          formType,
          name,
          email,
          phone,
          source: `Casper Group ${formType}`,
          sourceUrl: window.location.href,
          referrer: document.referrer,
          utm,
          consent: { websiteInquiry: true },
          fields: extra,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.error || 'Submission could not be safely recorded.');
      setState({ ok: true, message: data.message || 'Your inquiry is recorded.', submissionId: data.submissionId, crmStatus: data.crmStatus });
      form.reset();
      keyRef.current = crypto.randomUUID();
    } catch (error) {
      setState({ ok: false, message: error instanceof Error ? error.message : 'Submission failed.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="cgc-form-layout">
      <div className="cgc-form-info">
        <div className="cgc-kicker">Corporate Intake</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="cgc-form-card">
        <form className="cgc-form" onSubmit={submit}>
          <div className="cgc-form-grid">
            <div className="cgc-field"><label>Name *</label><input name="name" required autoComplete="name" /></div>
            <div className="cgc-field"><label>Email *</label><input name="email" type="email" required autoComplete="email" /></div>
            <div className="cgc-field cgc-field-full"><label>Phone</label><input name="phone" type="tel" autoComplete="tel" /></div>
            {fields.map((field) => (
              <div className={`cgc-field${field.full ? ' cgc-field-full' : ''}`} key={field.name}>
                <label>{field.label}{field.required ? ' *' : ''}</label>
                {field.type === 'textarea' ? <textarea name={field.name} required={field.required} placeholder={field.placeholder} /> : field.options ? <select name={field.name} required={field.required} defaultValue=""><option value="" disabled>Select</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input name={field.name} type={field.type || 'text'} required={field.required} placeholder={field.placeholder} />}
              </div>
            ))}
          </div>
          <p className="cgc-form-note">Casper Group corporate inquiries are stored internally first. External CRM delivery is attempted only to a verified corporate destination; otherwise the record remains queued internally.</p>
          {state ? <div className="cgc-result" data-error={!state.ok} role={state.ok ? 'status' : 'alert'}><strong>{state.ok ? 'Recorded' : 'Not submitted'}</strong><p>{state.message}</p>{state.submissionId ? <p>Submission: {state.submissionId}</p> : null}{state.crmStatus ? <p>CRM: {state.crmStatus}</p> : null}</div> : null}
          <button className="cgc-button cgc-button-primary" disabled={sending} type="submit">{sending ? 'Recording…' : 'Submit inquiry'}</button>
        </form>
      </div>
    </div>
  );
}

function Brands() {
  const brands = Object.values(casperSiteProfiles);
  return (
    <div className="cgc-brand-grid">
      {brands.map((brand) => (
        <Link className="cgc-brand-card" href={`/${brand.slug}/menu`} key={brand.slug} style={{ '--brand-accent': brand.accent } as React.CSSProperties}>
          <div className="cgc-brand-logo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={brand.logo} alt={`${brand.name} logo`} /></div>
          <div className="cgc-brand-body"><div className="cgc-brand-format">{brand.format}</div><h3>{brand.name}</h3><p>{brand.description}</p><div className="cgc-brand-links"><span>Menu</span><span>Order</span><span>{brand.serviceLabel}</span><span>Locations</span><span>{brand.clubLabel}</span></div></div>
        </Link>
      ))}
    </div>
  );
}

function About() {
  return (
    <>
      <div className="cgc-stat-grid"><div className="cgc-stat"><strong>12</strong><span>Consumer restaurant concepts in the current Casper portfolio.</span></div><div className="cgc-stat"><strong>1</strong><span>Shared operating platform for technology, data, expansion, and kitchen leverage.</span></div><div className="cgc-stat"><strong>0</strong><span>Reason to make the consumer brands look or sound the same.</span></div><div className="cgc-stat"><strong>∞</strong><span>Expansion lanes across venues, markets, events, kitchens, and partnerships.</span></div></div>
      <div className="cgc-section"><div className="cgc-two"><div className="cgc-panel cgc-panel-accent"><div className="cgc-section-label">Operating Thesis</div><h3>Own the demand, not just the dining room.</h3><p>Casper concepts are designed to meet customers wherever food demand already exists: hospitality venues, nightlife, delivery zones, daytime kitchens, events, entertainment centers, and future standalone locations.</p></div><div className="cgc-panel"><div className="cgc-section-label">Brand Thesis</div><h3>Infrastructure should disappear behind the experience.</h3><p>The customer should feel Angel Wings, Pasta Bish, Espresso Co., Taco Yaki, or another concept—not a generic multi-brand backend. Shared systems create efficiency; separate identities create love.</p></div></div></div>
      <div className="cgc-section"><div className="cgc-section-label">The System</div><h3 className="cgc-section-title">What Casper Group centralizes—and what it refuses to flatten.</h3><div className="cgc-two"><div className="cgc-panel"><div className="cgc-list"><div className="cgc-list-item"><b>01</b><div><strong>Centralize</strong><p>Kitchen infrastructure, core technology, data governance, operating standards, location intelligence, and expansion systems.</p></div></div><div className="cgc-list-item"><b>02</b><div><strong>Standardize</strong><p>QA, food safety, uptime, performance reporting, submission durability, security, and release integrity.</p></div></div></div></div><div className="cgc-panel"><div className="cgc-list"><div className="cgc-list-item"><b>03</b><div><strong>Separate</strong><p>Brand identity, menu story, marketing, customer lists, order data, service requests, support records, and conversion experiences.</p></div></div><div className="cgc-list-item"><b>04</b><div><strong>Scale</strong><p>Only when the concept can move into the next environment without losing what made it worth choosing.</p></div></div></div></div></div></div>
    </>
  );
}

function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let live = true;
    fetch('/api/corporate/locations', { cache: 'no-store' }).then(async (res) => { const data = await res.json(); if (!res.ok || !data.ok) throw new Error(data.error || 'Locations unavailable.'); if (live) setLocations(Array.isArray(data.locations) ? data.locations : []); }).catch((err) => live && setError(err instanceof Error ? err.message : 'Locations unavailable.')).finally(() => live && setLoading(false));
    return () => { live = false; };
  }, []);
  if (loading) return <div className="cgc-loading">Loading active kitchens…</div>;
  if (error) return <div className="cgc-empty">{error}</div>;
  if (!locations.length) return <div className="cgc-empty">No public active kitchens are currently published.</div>;
  return <div className="cgc-location-grid">{locations.map((location) => <article className="cgc-location" key={location.id}><div className="cgc-location-top"><h3>{location.name}</h3><span className="cgc-open">Open</span></div><p>{location.address || [location.city, location.state].filter(Boolean).join(', ')}</p>{location.kitchen_hours ? <p><strong>Kitchen:</strong> {location.kitchen_hours}</p> : null}{location.delivery_platforms?.length ? <div className="cgc-tags">{location.delivery_platforms.map((platform) => <span className="cgc-tag" key={platform}>{platform}</span>)}</div> : null}</article>)}</div>;
}

function Franchise() {
  return (
    <>
      <div className="cgc-stat-grid"><div className="cgc-stat"><strong>01</strong><span>Venue kitchen partnerships for existing hospitality and entertainment footprints.</span></div><div className="cgc-stat"><strong>02</strong><span>Operator / market development structures for qualified local partners.</span></div><div className="cgc-stat"><strong>03</strong><span>Multi-brand kitchen configurations matched to daypart and local demand.</span></div><div className="cgc-stat"><strong>04</strong><span>Future licensing or franchise structures where legally and operationally appropriate.</span></div></div>
      <div className="cgc-section"><CorporateForm formType="franchise_partner_interest" title="Tell us what you control." description="The strongest starting point is the asset or market you already have: kitchen, venue, territory, operating team, real estate, distribution, or strategic access." fields={[{ name: 'company', label: 'Company / organization' }, { name: 'market', label: 'Market / city', required: true }, { name: 'partner_type', label: 'Partnership lane', required: true, options: ['Venue / kitchen partner','Operating partner','Market developer','Real estate / landlord','Strategic partner','Franchise interest','Other'] }, { name: 'existing_assets', label: 'Existing assets / footprint', full: true, type: 'textarea' }, { name: 'capital_range', label: 'Capital / investment range' }, { name: 'timeline', label: 'Target timeline' }, { name: 'notes', label: 'What are you trying to build?', full: true, type: 'textarea', required: true }]} /></div>
    </>
  );
}

function Careers() {
  return (
    <>
      <div className="cgc-two"><div className="cgc-panel"><h3>Operations</h3><p>Kitchen leadership, multi-unit operations, training, food safety, supply, logistics, activation, and location execution.</p></div><div className="cgc-panel"><h3>Growth + Brand</h3><p>Marketing, creative, social, partnerships, business development, location sourcing, community, and customer acquisition.</p></div><div className="cgc-panel"><h3>Technology + Data</h3><p>Product, engineering, automation, analytics, CRM, commerce, integrations, and internal operating systems.</p></div><div className="cgc-panel"><h3>Corporate + Field</h3><p>Project management, finance, legal coordination, HR, executive support, field teams, and market launches.</p></div></div>
      <div className="cgc-section"><CorporateForm formType="careers_interest" title="Show us where you create leverage." description="We care about ownership, speed, judgment, standards, and the ability to move work from idea to execution." fields={[{ name: 'city', label: 'City / market' }, { name: 'department', label: 'Department', required: true, options: ['Operations','Growth + Brand','Technology + Data','Corporate','Field / Activations','Other'] }, { name: 'role_interest', label: 'Role / type of work', required: true }, { name: 'linkedin_or_portfolio', label: 'LinkedIn / portfolio URL', full: true, type: 'url' }, { name: 'experience', label: 'What have you built or operated?', full: true, type: 'textarea', required: true }, { name: 'availability', label: 'Availability / start window' }]} /></div>
    </>
  );
}

function Press() {
  return (
    <>
      <div className="cgc-two"><div className="cgc-panel cgc-panel-accent"><h3>Company</h3><p>Casper Group is a restaurant platform operating distinct food concepts through shared kitchen, data, technology, and expansion infrastructure.</p></div><div className="cgc-panel"><h3>Coverage lanes</h3><p>Restaurant innovation, hospitality, nightlife kitchens, multi-brand operations, food technology, delivery, culture, entrepreneurship, and market expansion.</p></div></div>
      <div className="cgc-section"><CorporateForm formType="press_media" title="Media request." description="Give the communications team enough detail to route the request, understand the deadline, and prepare the right people or assets." fields={[{ name: 'outlet', label: 'Outlet / publication', required: true }, { name: 'role', label: 'Your role' }, { name: 'deadline', label: 'Deadline', type: 'date' }, { name: 'request_type', label: 'Request type', required: true, options: ['Interview','Founder request','Company background','Brand feature','Photo / video','Podcast / broadcast','Data / comment','Other'] }, { name: 'topic', label: 'Story / topic', full: true, type: 'textarea', required: true }, { name: 'brand', label: 'Specific Casper brand, if any' }]} /></div>
    </>
  );
}

function Contact() {
  return <CorporateForm formType="corporate_contact" title="Route the opportunity correctly." description="Use a restaurant’s own Contact page for customer support. Use this form for Casper Group corporate business." fields={[{ name: 'organization', label: 'Company / organization' }, { name: 'inquiry_type', label: 'Inquiry type', required: true, options: ['Venue / location opportunity','Vendor / supplier','Strategic partnership','Investor / capital','Technology','Marketing / sponsorship','General corporate','Other'] }, { name: 'market', label: 'Market / city' }, { name: 'message', label: 'Message', full: true, type: 'textarea', required: true }]} />;
}

function Privacy() {
  return <div className="cgc-policy"><p>Casper Group Worldwide uses information you provide to operate this website, respond to inquiries, process restaurant order and service requests, administer brand membership programs, maintain security, and improve operations.</p><h3>Information we collect</h3><p>Depending on the interaction, information may include contact details, order-request details, event/service details, brand preferences, consent choices, source/referrer and campaign attribution, support messages, device/request metadata used for security, and other information you choose to submit.</p><h3>Brand separation</h3><p>Restaurant concepts on this website are treated as distinct customer experiences. Brand-specific orders, service requests, list signups, and support records are routed to that brand’s own data structures. Casper Group corporate inquiries are stored separately.</p><h3>How information is used</h3><ul><li>Respond to customer, partner, media, career, venue, and business inquiries.</li><li>Confirm restaurant order requests, availability, timing, fulfillment, and payment instructions.</li><li>Coordinate catering, events, office programs, and other brand services.</li><li>Send brand communications when you opt in.</li><li>Maintain security, abuse prevention, rate limits, operational records, and auditability.</li><li>Measure source attribution and improve customer experiences.</li></ul><h3>Service providers</h3><p>We may use infrastructure, CRM, hosting, analytics, communications, payment, delivery, and other service providers to operate the business. Access should be limited to the purpose for which the provider is used and governed by applicable agreements and law.</p><h3>Your choices</h3><p>You may opt out of promotional communications using the unsubscribe methods provided in those communications. Certain operational messages related to a request or transaction may still be necessary. Privacy rights vary by jurisdiction.</p><h3>Security and retention</h3><p>We use technical and organizational controls intended to reduce unauthorized access, including brand-isolated data structures, server-side validation, rate limiting, controlled credentials, and access policies. Information is retained as reasonably necessary for operations, legal obligations, dispute handling, security, and recordkeeping.</p><h3>Contact</h3><p>Questions about this policy can be submitted through the Casper Group corporate Contact page.</p></div>;
}

function Terms() {
  return <div className="cgc-policy"><p>By using this website, you agree to use it lawfully and not interfere with its security, operation, content, or other users.</p><h3>Restaurant requests are not final purchases</h3><p>Unless a page explicitly states otherwise, an order submitted through a Casper restaurant page is an order request. The applicable brand confirms availability, final total, timing, fulfillment, and payment instructions. Displayed estimated subtotals may not include every applicable tax, fee, delivery cost, substitution, or approved customization.</p><h3>Service, catering, and partnership inquiries</h3><p>Submitting an inquiry does not create a binding catering, employment, franchise, license, investment, venue, partnership, or other business agreement. Those relationships may require separate written documentation, diligence, approvals, disclosures, or legal requirements.</p><h3>Menu and location information</h3><p>Menu items, prices, ingredients, availability, hours, delivery platforms, and locations can change. Customers should rely on the confirmation provided for the specific request.</p><h3>Intellectual property</h3><p>Casper Group, its restaurant brand names, logos, visual identities, website content, photography, videos, copy, software, and related materials may be protected by intellectual property laws. No ownership rights are transferred by website use.</p><h3>User submissions</h3><p>You represent that information you submit is accurate to the best of your knowledge and that you have the right to provide it. Do not submit confidential third-party information you are not authorized to share.</p><h3>Availability and liability</h3><p>We work to keep the site and its submission systems available and accurate, but uninterrupted operation cannot be guaranteed. To the extent permitted by law, use of the website is at your own risk and remedies may be limited by applicable agreements and law.</p><h3>Changes</h3><p>These terms may be updated as the website, restaurant services, and legal requirements evolve. Continued website use after an update constitutes acceptance to the extent permitted by law.</p></div>;
}

function Body({ kind }: { kind: CorporatePageKind }) {
  if (kind === 'brands') return <Brands />;
  if (kind === 'about') return <About />;
  if (kind === 'locations') return <Locations />;
  if (kind === 'franchise') return <Franchise />;
  if (kind === 'careers') return <Careers />;
  if (kind === 'press') return <Press />;
  if (kind === 'contact') return <Contact />;
  if (kind === 'privacy') return <Privacy />;
  return <Terms />;
}

export default function CorporatePage({ kind }: { kind: CorporatePageKind }) {
  const copy = COPY[kind];
  const active = useMemo(() => kind, [kind]);
  return (
    <div className="cgc-root">
      <nav className="cgc-nav" aria-label="Casper Group navigation">
        <Link className="cgc-logo" href="/">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/casper-logo-white.png" alt="Casper Group" /></Link>
        <div className="cgc-nav-links">{NAV.map((item) => <Link className="cgc-nav-link" data-active={active === item.kind} href={`/${item.kind}`} key={item.kind}>{item.label}</Link>)}</div>
        <Link className="cgc-nav-cta" href="/franchise">Partner With Casper</Link>
      </nav>
      <header className="cgc-hero"><div className="cgc-hero-image"><Image src="/images/casper-kitchen.png" alt="" fill priority sizes="100vw" /></div><div className="cgc-shell cgc-hero-content"><div className="cgc-kicker">{copy.kicker}</div><h1>{copy.title} <em>{copy.accent}</em></h1><p>{copy.lead}</p><div className="cgc-hero-actions"><Link className="cgc-button cgc-button-primary" href="/brands">Explore the brands</Link><Link className="cgc-button" href="/contact">Corporate contact</Link></div></div></header>
      <main className="cgc-main"><div className="cgc-shell"><div className="cgc-head"><h2>{copy.head}</h2><p>{copy.intro}</p></div><Body kind={kind} /></div></main>
      <footer className="cgc-footer"><div className="cgc-shell cgc-footer-row"><p>© 2026 Casper Group Worldwide. Built as a multi-brand restaurant platform.</p><div className="cgc-footer-links"><Link href="/brands">Brands</Link><Link href="/locations">Locations</Link><Link href="/careers">Careers</Link><Link href="/press">Press</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></div></footer>
    </div>
  );
}
