'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { CasperSiteProfile } from '@/lib/casper-site-registry';
import { getCasperBrandExperience } from '@/lib/casper-brand-experience';
import ResilientMenuImage from './ResilientMenuImage';
import './casper-menu-browser.css';

type MenuItem = { slug:string; name:string; description?:string; category?:string; price?:number; image_path?:string|null; featured?:boolean };

function categorySlug(value:string){return value.toLowerCase().trim().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function labelize(value:string){return value.replace(/[_-]+/g,' ').replace(/\b\w/g,(letter)=>letter.toUpperCase())}
function money(value?:number){if(typeof value!=='number'||Number.isNaN(value)) return 'Market'; return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value)}

export default function CasperMenuDeepPage({profile,category,item}:{profile:CasperSiteProfile;category:string;item?:string}){
  const experience=getCasperBrandExperience(profile.slug);
  const [items,setItems]=useState<MenuItem[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  useEffect(()=>{let active=true;fetch(`/api/brand/${profile.slug}?resource=menu`,{cache:'no-store'}).then(async res=>{const data=await res.json();if(!res.ok||!data.ok)throw new Error(data.error||'Menu unavailable.');if(active)setItems(Array.isArray(data.menu)?data.menu:[])}).catch(err=>active&&setError(err instanceof Error?err.message:'Menu unavailable.')).finally(()=>active&&setLoading(false));return()=>{active=false}},[profile.slug]);
  const categoryItems=useMemo(()=>items.filter(entry=>categorySlug(entry.category||'Signature')===category),[category,items]);
  const selected=useMemo(()=>item?categoryItems.find(entry=>entry.slug===item):undefined,[categoryItems,item]);
  const categoryName=categoryItems[0]?.category||labelize(category);
  const fallback=experience?.gallery?.[0]||profile.heroImage;

  return <main className="cmb-site" data-variant={experience?.variant||'halo'} style={{'--cmb-accent':profile.accent,'--cmb-bright':profile.accentBright} as React.CSSProperties}>
    <nav className="cmb-nav"><Link href={`/${profile.slug}`} className="cmb-brand"><img src={profile.logo} alt={profile.name}/></Link><div className="cmb-nav-links"><Link href={`/${profile.slug}/menu`}>Menu</Link><Link href={`/${profile.slug}/order`}>Order</Link><Link href={`/${profile.slug}/catering`}>{profile.serviceLabel}</Link><Link href={`/${profile.slug}/locations`}>Locations</Link><Link href={`/${profile.slug}/about`}>About</Link></div><Link className="cmb-order" href={`/${profile.slug}/order`}>Order</Link></nav>

    {item ? <section className="cmb-deep">
      <div className="cmb-breadcrumbs"><Link href={`/${profile.slug}`}>{profile.name}</Link><span>/</span><Link href={`/${profile.slug}/menu`}>Menu</Link><span>/</span><Link href={`/${profile.slug}/menu/${category}`}>{labelize(categoryName)}</Link></div>
      {loading?<div className="cmb-state">Loading item…</div>:null}{error?<div className="cmb-state">{error}</div>:null}
      {!loading&&!error&&selected?<div className="cmb-item-detail"><div className="cmb-item-visual"><ResilientMenuImage src={selected.image_path} fallback={fallback} alt={selected.name}/></div><div className="cmb-item-copy"><span>{labelize(selected.category||'Signature')}</span><h1>{selected.name}</h1><p>{selected.description||`A current ${profile.name} menu item.`}</p><strong className="cmb-item-price">{money(selected.price)}</strong><div className="cmb-item-actions"><Link href={`/${profile.slug}/order`}>Order this</Link><Link href={`/${profile.slug}/menu/${category}`}>Back to {labelize(categoryName)}</Link></div></div></div>:null}
      {!loading&&!error&&!selected?<div className="cmb-state">That menu item is not currently published.</div>:null}
    </section>:<section className="cmb-deep">
      <div className="cmb-breadcrumbs"><Link href={`/${profile.slug}`}>{profile.name}</Link><span>/</span><Link href={`/${profile.slug}/menu`}>Menu</Link><span>/</span><span>{labelize(categoryName)}</span></div>
      <div className="cmb-deep-head"><div><span className="cmb-section-label">{profile.name} menu</span><h1>{labelize(categoryName)}</h1></div><p>Browse this category, open any item for full details, or jump directly into ordering.</p></div>
      {loading?<div className="cmb-state">Loading live menu…</div>:null}{error?<div className="cmb-state">{error}</div>:null}
      <div className="cmb-grid">{categoryItems.map(entry=><article className="cmb-card" key={entry.slug}><div className="cmb-card-media"><ResilientMenuImage src={entry.image_path} fallback={fallback} alt={entry.name}/></div><div className="cmb-card-body"><span>{labelize(entry.category||'Signature')}</span><h3>{entry.name}</h3><p>{entry.description||'A current brand menu item.'}</p><div className="cmb-card-bottom"><strong>{money(entry.price)}</strong><Link href={`/${profile.slug}/menu/${category}/${entry.slug}`}>View item ↗</Link></div></div></article>)}</div>
      {!loading&&!error&&!categoryItems.length?<div className="cmb-state">This category is not currently published.</div>:null}
    </section>}
    <footer className="cmb-footer"><Link href={`/${profile.slug}/menu`}>← All menu categories</Link><Link href={`/${profile.slug}/order`}>Build an order →</Link></footer>
  </main>
}
