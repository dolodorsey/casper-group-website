"use client";
import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";

const C = {
  base:"#0B0B0B", surface:"#141414", panel:"rgba(255,255,255,0.03)", border:"rgba(255,255,255,0.07)",
  gold:"#D89A2B", goldDeep:"#8a5e14", cream:"#F6F0E7", muted:"#7A7E85", orange:"#C85A1A", burgundy:"#5E1F24",
};
function useInView(t=0.1){const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});o.observe(el);return()=>o.disconnect();},[]);return[ref,v];}
function Reveal({children, d = 0, y = 32}: {children: ReactNode; d?: number; y?: number}){const[ref,v]=useInView();return<div ref={ref} style={{transform:v?"translateY(0)":"translateY(32px)",opacity:v?1:0,transition:`all 0.9s cubic-bezier(0.16,1,0.3,1) ${d}s`}}>{children}</div>;}
const Grain=()=>(<div style={{position:"absolute",inset:0,opacity:0.03,pointerEvents:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>);

function Nav(){const[s,setS]=useState(false);useEffect(()=>{const h=()=>setS(window.scrollY>60);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h);},[]);return(<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:s?"14px clamp(24px,4vw,56px)":"24px clamp(24px,4vw,56px)",display:"flex",justifyContent:"space-between",alignItems:"center",background:s?"rgba(11,11,11,0.94)":"transparent",backdropFilter:s?"blur(24px)":"none",borderBottom:s?`1px solid ${C.border}`:"none",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}}><div><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"8px",letterSpacing:"0.45em",textTransform:"uppercase",color:C.gold,marginBottom:"3px"}}>Restaurant Concepts</div><span style={{fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:400,fontStyle:"italic",color:C.cream}}>Casper Group</span></div><div style={{display:"flex",gap:"clamp(16px,2.5vw,36px)",alignItems:"center"}}>{["Concepts","Locations","Franchise","About"].map(n=>(<a key={n} href={`#${n.toLowerCase()}`} style={{fontFamily:"'DM Sans',sans-serif",fontSize:"10px",fontWeight:500,letterSpacing:"0.22em",textTransform:"uppercase",color:C.muted,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={e=>e.target.style.color=C.cream} onMouseLeave={e=>e.target.style.color=C.muted}>{n}</a>))}<button style={{fontFamily:"'DM Sans',sans-serif",fontSize:"10px",fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"#0B0B0B",background:C.gold,border:"none",padding:"10px 26px",cursor:"pointer"}}>Inquire</button></div></nav>);}

const BRANDS=[{name:"Angel Wings",type:"Wings Concept",desc:"Atlanta-style lemon pepper wings and Southern comfort energy built for mass demand.",emoji:"🍗"},{name:"Tha Morning After",type:"Breakfast Concept",desc:"Creative breakfast culture engineered for craveability and repeat traffic.",emoji:"🍳"},{name:"Patty Daddy",type:"Burger Concept",desc:"A larger-than-life burger concept with bold personality and high-volume appeal.",emoji:"🍔"},{name:"Mojo Juice",type:"Juice Bar",desc:"Fresh-pressed ritual with bright wellness positioning and easy expansion logic.",emoji:"🥤"},{name:"Espresso Co.",type:"Coffee Concept",desc:"Modern coffee culture driving premium everyday traffic and brand loyalty.",emoji:"☕"},{name:"Mr. Oyster",type:"Seafood Concept",desc:"Elevated seafood with visual edge and premium category positioning.",emoji:"🦪"},{name:"Sweet Tooth",type:"Dessert Concept",desc:"Dessert-driven indulgence designed for impulse and social documentation.",emoji:"🍰"},{name:"Taco Yaki",type:"Fusion Concept",desc:"A fusion-forward taco concept with high-visual menu appeal.",emoji:"🌮"},{name:"Toss'd",type:"Healthy Fast Casual",desc:"Fresh bowls and salads with speed, simplicity, and scalable reach.",emoji:"🥗"},{name:"Pasta Bish",type:"Pasta Concept",desc:"Comfort-food pasta with attitude and broad-market menu flexibility.",emoji:"🍝"}];

export default function CasperGroupV3(){const[loaded,setLoaded]=useState(false);const[hover,setHover]=useState(null);useEffect(()=>{setTimeout(()=>setLoaded(true),80);},[]);
return(<div style={{background:C.base,minHeight:"100vh"}}>
<Nav/>
<section style={{minHeight:"100vh",position:"relative",overflow:"hidden",background:`radial-gradient(ellipse at 20% 80%, rgba(94,31,36,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(216,154,43,0.08) 0%, transparent 55%), ${C.base}`,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 clamp(32px,6vw,96px) 80px"}}>
<Grain/><div style={{position:"relative",zIndex:2,maxWidth:"1400px",margin:"0 auto",width:"100%"}}>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"0.5em",textTransform:"uppercase",color:C.gold,opacity:loaded?1:0,transition:"opacity 0.8s ease 0.3s"}}>An Enterprise of Flavor-Driven Brands</div>
<h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(56px,10vw,148px)",fontWeight:400,lineHeight:0.88,letterSpacing:"-0.03em",color:C.cream,marginTop:"20px",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(40px)",transition:"all 1.1s cubic-bezier(0.16,1,0.3,1) 0.5s"}}><em>Casper</em><br/><span style={{color:"rgba(246,240,231,0.28)"}}>Group</span></h1>
<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(14px,1.2vw,17px)",lineHeight:1.8,color:C.muted,maxWidth:"520px",marginTop:"32px",opacity:loaded?1:0,transition:"all 0.9s ease 0.9s"}}>Distinct concepts. Shared power. Casper Group builds iconic QSR brands with production, operations, and training infrastructure to expand and scale.</p>
<div style={{display:"flex",gap:"14px",marginTop:"44px",opacity:loaded?1:0,transition:"opacity 0.9s ease 1.2s",flexWrap:"wrap"}}>
<button style={{fontFamily:"'DM Sans',sans-serif",fontSize:"10px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:"#0B0B0B",background:C.gold,border:"none",padding:"15px 42px",cursor:"pointer"}} onMouseEnter={e=>{e.target.style.background=C.cream;e.target.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.target.style.background=C.gold;e.target.style.transform="translateY(0)";}}>Explore Brands</button>
<button style={{fontFamily:"'DM Sans',sans-serif",fontSize:"10px",fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.cream,background:"transparent",border:`1px solid rgba(246,240,231,0.18)`,padding:"15px 36px",cursor:"pointer"}} onMouseEnter={e=>{e.target.style.borderColor=C.gold;e.target.style.color=C.gold;}} onMouseLeave={e=>{e.target.style.borderColor="rgba(246,240,231,0.18)";e.target.style.color=C.cream;}}>Partner With Us</button>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",marginTop:"64px",background:C.border,opacity:loaded?1:0,transition:"opacity 1s ease 1.4s"}}>
{[["10+","Distinct Concepts"],["25+","Markets"],["150+","Locations"],["1","Mascot Universe"]].map(([v,l])=>(<div key={l} style={{padding:"24px 0 0",background:C.base}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,3.5vw,48px)",fontWeight:400,fontStyle:"italic",color:C.gold}}>{v}</div><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"9px",fontWeight:500,letterSpacing:"0.32em",textTransform:"uppercase",color:C.muted,marginTop:"8px"}}>{l}</div></div>))}
</div>
</div></section>

<section id="concepts" style={{background:C.base,padding:"120px clamp(32px,6vw,96px)"}}>
<div style={{maxWidth:"1400px",margin:"0 auto"}}>
<Reveal><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"0.48em",textTransform:"uppercase",color:C.gold,marginBottom:"16px"}}>Brand Portfolio</div>
<h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5vw,72px)",fontWeight:400,fontStyle:"italic",color:C.cream,marginBottom:"64px"}}>Our Brand Worlds</h2></Reveal>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"2px",background:C.border}}>
{BRANDS.map((b,i)=>(<div key={b.name} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)} style={{background:hover===i?C.surface:C.base,padding:"32px 28px",cursor:"pointer",transition:"background 0.3s"}}>
<div style={{fontSize:"28px",marginBottom:"14px"}}>{b.emoji}</div>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"8px",fontWeight:600,letterSpacing:"0.38em",textTransform:"uppercase",color:C.orange,marginBottom:"8px"}}>{b.type}</div>
<div style={{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:400,fontStyle:"italic",color:C.cream,marginBottom:"12px"}}>{b.name}</div>
<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"13px",lineHeight:1.7,color:C.muted}}>{b.desc}</p>
</div>))}
</div></div></section>

<section style={{background:C.surface,padding:"120px clamp(32px,6vw,96px)",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 100%, ${C.gold}10, transparent 60%)`}}/>
<div style={{maxWidth:"900px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:2}}>
<Reveal>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"0.48em",textTransform:"uppercase",color:C.gold,marginBottom:"24px"}}>Build With Us</div>
<h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5vw,72px)",fontWeight:400,fontStyle:"italic",color:C.cream,lineHeight:1.0,letterSpacing:"-0.02em",marginBottom:"24px"}}>The Modern Fast-Food<br/>Empire Starts Here.</h2>
<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"16px",lineHeight:1.8,color:C.muted,maxWidth:"560px",margin:"0 auto 48px"}}>Whether you are an operator, a landlord, or a strategic partner — Casper Group has a path designed for results at scale.</p>
<div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
<button style={{fontFamily:"'DM Sans',sans-serif",fontSize:"10px",fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",color:"#0B0B0B",background:C.gold,border:"none",padding:"16px 48px",cursor:"pointer"}} onMouseEnter={e=>{e.target.style.background=C.cream;e.target.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.target.style.background=C.gold;e.target.style.transform="translateY(0)";}}>Explore Partnership</button>
<button style={{fontFamily:"'DM Sans',sans-serif",fontSize:"10px",fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.cream,background:"transparent",border:`1px solid rgba(246,240,231,0.18)`,padding:"16px 40px",cursor:"pointer"}} onMouseEnter={e=>{e.target.style.borderColor=C.gold;e.target.style.color=C.gold;}} onMouseLeave={e=>{e.target.style.borderColor="rgba(246,240,231,0.18)";e.target.style.color=C.cream;}}>Franchise Inquiry</button>
</div>
</Reveal></div></section>

<footer style={{background:"#080808",borderTop:`1px solid ${C.border}`,padding:"64px clamp(32px,6vw,96px) 40px"}}>
<div style={{maxWidth:"1400px",margin:"0 auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"16px"}}>
<div><div style={{fontFamily:"'Playfair Display',serif",fontSize:"24px",fontWeight:400,fontStyle:"italic",color:C.cream}}>Casper Group</div><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"13px",color:C.muted,marginTop:"8px"}}>10+ distinct concepts. Multi-city infrastructure.</p></div>
<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"11px",color:"rgba(255,255,255,0.22)"}}>© 2026 Casper Group. A KHG Enterprise.</div>
</div></div></footer>
</div>);}
