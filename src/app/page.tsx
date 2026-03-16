"use client";
import { useState, useEffect, useRef } from "react";

// ─── CASPER GROUP BRAND PALETTE ──────────────────────────────────────────────
const C={
  base:"#111111",dark:"#0A0A0A",surface:"#1A1714",surface2:"#1E1B17",
  cream:"#F6F0E7",gold:"#D89A2B",goldDim:"#D89A2B50",
  burgundy:"#5E1F24",burgundyGlow:"rgba(94,31,36,0.15)",
  silver:"#B9BDC7",muted:"#8A857D",dim:"rgba(246,240,231,0.18)",
  border:"rgba(246,240,231,0.08)",orange:"#C85A1A"
};
const F={serif:"'Playfair Display',Georgia,serif",sans:"'DM Sans',system-ui,sans-serif"};

function useInView(t=0.12){const ref=useRef<HTMLDivElement>(null);const[v,setV]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});o.observe(el);return()=>o.disconnect()},[t]);return[ref,v] as const}
function Reveal({children,d=0}:{children:React.ReactNode;d?:number}){const[ref,v]=useInView();return<div ref={ref} style={{transform:v?"translateY(0)":"translateY(36px)",opacity:v?1:0,transition:`all 1s cubic-bezier(0.16,1,0.3,1) ${d}s`}}>{children}</div>}
const Grain=({o=0.03}:{o?:number})=>(<div style={{position:"absolute",inset:0,opacity:o,pointerEvents:"none",zIndex:1,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>);

// ─── NAV with real logo ─────────────────────────────────────────────────────
function Nav(){const[s,setS]=useState(false);useEffect(()=>{const h=()=>setS(window.scrollY>60);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);return(
<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:s?"12px clamp(24px,4vw,56px)":"22px clamp(24px,4vw,56px)",display:"flex",justifyContent:"space-between",alignItems:"center",background:s?`${C.base}f2`:"transparent",backdropFilter:s?"blur(24px)":"none",borderBottom:s?`1px solid ${C.dim}`:"none",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}}>
<img src="/images/casper-logo-white.png" alt="Casper Group" style={{height:"28px",width:"auto"}}/>
<div style={{display:"flex",gap:"clamp(14px,2.5vw,32px)",alignItems:"center"}}>
{["Concepts","Universe","Franchise"].map(n=>(<a key={n} href={`#${n.toLowerCase()}`} style={{fontFamily:F.sans,fontSize:"9px",fontWeight:500,letterSpacing:"0.22em",textTransform:"uppercase",color:C.silver,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={e=>(e.target as HTMLElement).style.color=C.cream} onMouseLeave={e=>(e.target as HTMLElement).style.color=C.silver}>{n}</a>))}
<button style={{fontFamily:F.sans,fontSize:"9px",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:C.base,background:C.gold,border:"none",padding:"9px 22px",cursor:"pointer"}}>Inquire</button></div></nav>)}

// ─── HERO: VIDEO AS HOME SCREEN (not preloader) + INFO PANEL ────────────────
function Hero(){const[loaded,setLoaded]=useState(false);useEffect(()=>{setTimeout(()=>setLoaded(true),300)},[]);return(
<section style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.dark} 0%,${C.base} 40%,${C.surface} 100%)`,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",padding:"120px clamp(32px,6vw,80px) 80px"}}>
<Grain o={0.035}/>
{/* Animated burgundy + gold glow orbs */}
<div style={{position:"absolute",top:"-10%",right:"-5%",width:"60vw",height:"60vw",borderRadius:"50%",background:`radial-gradient(circle,${C.burgundyGlow},transparent 65%)`,animation:"float 8s ease-in-out infinite",pointerEvents:"none"}}/>
<div style={{position:"absolute",bottom:"-15%",left:"-5%",width:"50vw",height:"50vw",borderRadius:"50%",background:`radial-gradient(circle,${C.goldDim},transparent 65%)`,animation:"float 10s ease-in-out infinite reverse",pointerEvents:"none"}}/>
<style>{`@keyframes float{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-20px)}}`}</style>

<div style={{position:"relative",zIndex:2,maxWidth:"1400px",margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(32px,4vw,64px)",alignItems:"center"}}>
{/* LEFT: Brand info */}
<div>
<div style={{fontFamily:F.sans,fontSize:"9px",letterSpacing:"0.5em",textTransform:"uppercase",color:C.gold,opacity:loaded?1:0,transition:"opacity 0.8s ease 0.2s",marginBottom:"20px",display:"flex",alignItems:"center",gap:"12px"}}><span style={{width:"32px",height:"1px",background:C.gold,display:"inline-block"}}/>Restaurant Concepts Worldwide</div>
<h1 style={{fontFamily:F.serif,fontSize:"clamp(48px,8vw,120px)",fontWeight:400,lineHeight:0.88,letterSpacing:"-0.03em",color:C.cream,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(40px)",transition:"all 1.1s cubic-bezier(0.16,1,0.3,1) 0.4s"}}><em>Casper</em><br/><span style={{color:C.burgundy}}>Group</span></h1>
<p style={{fontFamily:F.sans,fontSize:"clamp(13px,1.1vw,16px)",lineHeight:1.8,color:C.muted,maxWidth:"440px",marginTop:"28px",opacity:loaded?1:0,transition:"opacity 0.8s ease 0.8s"}}>Ten distinct restaurant concepts. One powerful infrastructure. A mascot universe that builds culture, loyalty, and franchise velocity.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",marginTop:"40px",opacity:loaded?1:0,transition:"opacity 0.8s ease 1s"}}>
{[{v:"10+",l:"Concepts"},{v:"25+",l:"Markets"},{v:"150+",l:"Locations"},{v:"15",l:"Mascots"}].map(s=>(<div key={s.l} style={{paddingRight:"16px"}}><div style={{fontFamily:F.serif,fontSize:"clamp(24px,2.5vw,36px)",fontWeight:400,fontStyle:"italic",color:C.gold}}>{s.v}</div><div style={{fontFamily:F.sans,fontSize:"8px",fontWeight:500,letterSpacing:"0.3em",textTransform:"uppercase",color:C.muted,marginTop:"4px"}}>{s.l}</div></div>))}</div>
<div style={{display:"flex",gap:"12px",marginTop:"40px",opacity:loaded?1:0,transition:"opacity 0.8s ease 1.2s",flexWrap:"wrap"}}>
<button style={{fontFamily:F.sans,fontSize:"9px",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:C.base,background:C.gold,border:"none",padding:"14px 36px",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Explore Brands</button>
<button style={{fontFamily:F.sans,fontSize:"9px",fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.cream,background:"transparent",border:`1px solid ${C.dim}`,padding:"14px 30px",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.gold}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.dim;e.currentTarget.style.color=C.cream}}>Franchise Inquiry</button></div>
</div>

{/* RIGHT: Video animation — contained, not stretched */}
<div style={{position:"relative",opacity:loaded?1:0,transform:loaded?"scale(1)":"scale(0.95)",transition:"all 1.2s cubic-bezier(0.16,1,0.3,1) 0.6s"}}>
<div style={{border:`1px solid ${C.dim}`,background:C.dark,overflow:"hidden",position:"relative"}}>
<video autoPlay muted loop playsInline style={{width:"100%",height:"auto",display:"block"}}>
<source src="/videos/casper-logo.mp4" type="video/mp4"/></video>
</div>
{/* Caption under video */}
<div style={{marginTop:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{fontFamily:F.sans,fontSize:"8px",letterSpacing:"0.4em",textTransform:"uppercase",color:C.muted}}>Brand Animation</div>
<div style={{fontFamily:F.sans,fontSize:"8px",letterSpacing:"0.3em",textTransform:"uppercase",color:C.gold}}>Est. 2024</div></div>
</div>
</div></section>)}

// ─── BRAND DATA ──────────────────────────────────────────────────────────────
const BRANDS=[
{name:"Angel Wings",type:"Wings",logo:"/images/logo-angel-wings.png",video:"/videos/angel-wings.mp4",mascot:"/images/mascot-loudini.png",mascotName:"LOUDINI",accent:"#C85A1A",bg:"#1A1210",desc:"Atlanta-style lemon pepper wings built for mass demand."},
{name:"Tha Morning After",type:"Breakfast",logo:"/images/logo-morning-after.png",video:null,mascot:"/images/mascot-eggavier.png",mascotName:"EGGAVIER",accent:"#D89A2B",bg:"#1A1710",desc:"Creative breakfast culture for craveability and repeat traffic."},
{name:"Patty Daddy",type:"Burgers",logo:"/images/logo-patty-daddy.png",video:"/videos/patty-daddy.mp4",mascot:"/images/mascot-paddy-daddy.png",mascotName:"PADDY DADDY",accent:"#C85A1A",bg:"#1A1210",desc:"Larger-than-life burger concept with bold personality."},
{name:"Espresso Co.",type:"Coffee",logo:"/images/logo-espresso-co.png",video:"/videos/espresso-co.mp4",mascot:"/images/mascot-beanzo.png",mascotName:"BEANZO",accent:"#8A6A3A",bg:"#171410",desc:"Modern coffee culture driving premium everyday traffic."},
{name:"Mojo Juice",type:"Juice Bar",logo:"/images/logo-mojo-juice.png",video:"/videos/mojo-juice.mp4",mascot:"/images/mascot-mojo.png",mascotName:"MOJO",accent:"#4A8A3A",bg:"#101A10",desc:"Fresh-pressed ritual with bright wellness positioning."},
{name:"Mr. Oyster",type:"Seafood",logo:"/images/logo-mr-oyster.png",video:"/videos/mr-oyster.mp4",mascot:"/images/mascot-mr-miss-oyster.png",mascotName:"MR. OYSTER",accent:"#3A6A8A",bg:"#10141A",desc:"Elevated seafood with visual edge and authority."},
{name:"Sweet Tooth",type:"Desserts",logo:"/images/logo-sweet-tooth.png",video:"/videos/sweet-tooth.mp4",mascot:"/images/mascot-sweet-tooth.png",mascotName:"SWEET TOOTH",accent:"#C83A8A",bg:"#1A101A",desc:"Dessert indulgence designed for impulse and social."},
{name:"Taco Yaki",type:"Fusion",logo:"/images/logo-taco-yaki.png",video:"/videos/taco-yaki.mp4",mascot:"/images/mascot-yaki.png",mascotName:"YAKI",accent:"#C85A1A",bg:"#1A1210",desc:"Fusion tacos with high-visual appeal and urban energy."},
{name:"Toss'd",type:"Healthy",logo:"/images/logo-tossd.png",video:"/videos/tossd.mp4",mascot:"/images/mascot-king-kale.png",mascotName:"KING KALE",accent:"#4A8A3A",bg:"#101A10",desc:"Fresh bowls and salads with speed and simplicity."},
{name:"Pasta Bish",type:"Pasta",logo:"/images/logo-pasta-bish.png",video:"/videos/pasta-bish.mp4",mascot:"/images/mascot-lil-linguine.png",mascotName:"LIL LINGUINE",accent:"#C83A3A",bg:"#1A1010",desc:"Comfort-food pasta with attitude and flexibility."},
];

// ─── BRANDS: each card has its OWN brand color bg + logo + video ─────────────
function BrandWorlds(){const[active,setActive]=useState<number|null>(null);return(
<section id="concepts" style={{background:C.base,padding:"120px clamp(32px,6vw,80px)"}}>
<div style={{maxWidth:"1400px",margin:"0 auto"}}><Reveal><div style={{fontFamily:F.sans,fontSize:"9px",letterSpacing:"0.48em",textTransform:"uppercase",color:C.gold,marginBottom:"16px",display:"flex",alignItems:"center",gap:"12px"}}><span style={{width:"32px",height:"1px",background:C.gold}}/>Brand Portfolio</div><h2 style={{fontFamily:F.serif,fontSize:"clamp(36px,5vw,72px)",fontWeight:400,lineHeight:0.95,letterSpacing:"-0.03em",color:C.cream,fontStyle:"italic"}}>Our Brand<br/>Worlds</h2></Reveal>

{/* 5x2 grid — each card with its own brand-color background */}
<div style={{marginTop:"48px",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"2px"}}>
{BRANDS.map((b,i)=>(<div key={b.name} onClick={()=>setActive(active===i?null:i)} style={{background:b.bg,padding:"20px 16px",cursor:"pointer",transition:"all 0.4s",position:"relative",overflow:"hidden",borderTop:`2px solid ${active===i?b.accent:"transparent"}`}}>
{/* Brand-colored accent glow */}
<div style={{position:"absolute",top:0,right:0,width:"60%",height:"60%",background:`radial-gradient(circle at 100% 0%,${b.accent}12,transparent 70%)`,pointerEvents:"none"}}/>
<div style={{position:"relative",zIndex:1}}>
{/* Logo */}
<div style={{width:"100%",aspectRatio:"1",marginBottom:"12px",display:"flex",alignItems:"center",justifyContent:"center",background:`${b.accent}08`,borderRadius:"6px",overflow:"hidden"}}><img src={b.logo} alt={b.name} style={{width:"65%",height:"65%",objectFit:"contain"}}/></div>
<div style={{fontFamily:F.sans,fontSize:"7px",fontWeight:600,letterSpacing:"0.38em",textTransform:"uppercase",color:b.accent,marginBottom:"4px"}}>{b.type}</div>
<div style={{fontFamily:F.serif,fontSize:"16px",fontWeight:400,fontStyle:"italic",color:C.cream,marginBottom:"6px"}}>{b.name}</div>
<p style={{fontFamily:F.sans,fontSize:"10px",lineHeight:1.6,color:C.muted}}>{b.desc}</p>
{/* Mascot mini-avatar */}
<div style={{marginTop:"12px",display:"flex",alignItems:"center",gap:"8px"}}>
<div style={{width:"28px",height:"28px",borderRadius:"50%",overflow:"hidden",background:`${b.accent}15`,border:`1px solid ${b.accent}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><img src={b.mascot} alt={b.mascotName} style={{width:"22px",height:"22px",objectFit:"contain"}}/></div>
<span style={{fontFamily:F.sans,fontSize:"8px",fontWeight:700,letterSpacing:"0.1em",color:b.accent}}>{b.mascotName}</span></div>
</div></div>))}</div>

{/* Active brand video player */}
{active!==null&&BRANDS[active].video&&(<Reveal><div style={{marginTop:"32px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"32px",background:BRANDS[active].bg,padding:"32px",alignItems:"center"}}>
<video autoPlay muted loop playsInline key={BRANDS[active].video} style={{width:"100%",height:"auto",display:"block",border:`1px solid ${BRANDS[active].accent}20`}}>
<source src={BRANDS[active].video} type="video/mp4"/></video>
<div><div style={{fontFamily:F.sans,fontSize:"8px",letterSpacing:"0.4em",textTransform:"uppercase",color:BRANDS[active].accent,marginBottom:"12px"}}>Brand Animation</div>
<div style={{fontFamily:F.serif,fontSize:"clamp(28px,3vw,48px)",fontWeight:400,fontStyle:"italic",color:C.cream,marginBottom:"12px"}}>{BRANDS[active].name}</div>
<p style={{fontFamily:F.sans,fontSize:"14px",lineHeight:1.75,color:C.muted}}>{BRANDS[active].desc}</p></div>
</div></Reveal>)}</div></section>)}

// ─── FOOD GALLERY ────────────────────────────────────────────────────────────
function FoodGallery(){const images=[{src:"/images/food/lemon-pepper-wings.png",label:"Angel Wings",color:"#C85A1A"},{src:"/images/food/premium-burger.png",label:"Patty Daddy",color:"#C85A1A"},{src:"/images/food/green-juice-splash.png",label:"Mojo Juice",color:"#4A8A3A"},{src:"/images/food/fusion-tacos.png",label:"Taco Yaki",color:"#C85A1A"},{src:"/images/food/breakfast-sandwich.png",label:"Morning After",color:"#D89A2B"},{src:"/images/food/fried-rice-shrimp.png",label:"Casper Kitchen",color:C.gold}];return(
<section style={{background:`linear-gradient(180deg,${C.surface} 0%,${C.base} 100%)`,padding:"120px 0",position:"relative",overflow:"hidden"}}><Grain o={0.025}/>
<div style={{padding:"0 clamp(32px,6vw,80px)",maxWidth:"1400px",margin:"0 auto 48px"}}><Reveal><div style={{fontFamily:F.sans,fontSize:"9px",letterSpacing:"0.48em",textTransform:"uppercase",color:C.gold,marginBottom:"16px",display:"flex",alignItems:"center",gap:"12px"}}><span style={{width:"32px",height:"1px",background:C.gold}}/>The Food</div><h2 style={{fontFamily:F.serif,fontSize:"clamp(32px,4.5vw,64px)",fontWeight:400,fontStyle:"italic",lineHeight:0.95,color:C.cream}}>Flavor In<br/><span style={{color:C.burgundy}}>Every Frame.</span></h2></Reveal></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"3px",padding:"0 3px"}}>
{images.map((img,i)=>(<div key={i} style={{position:"relative",overflow:"hidden",aspectRatio:i===0||i===3?"16/10":"3/4"}}><img src={img.src} alt={img.label} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.8s cubic-bezier(0.16,1,0.3,1)"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"40px 20px 16px",background:"linear-gradient(transparent,rgba(0,0,0,0.75))"}}><div style={{fontFamily:F.sans,fontSize:"8px",fontWeight:600,letterSpacing:"0.4em",textTransform:"uppercase",color:img.color}}>{img.label}</div></div></div>))}</div></section>)}

// ─── GHOST KITCHEN ───────────────────────────────────────────────────────────
function GhostKitchen(){return(
<section style={{background:C.dark,padding:"120px clamp(32px,6vw,80px)",position:"relative",overflow:"hidden"}}><Grain o={0.02}/>
<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 70% 50%,rgba(94,31,36,0.1),transparent 60%)`}}/>
<div style={{maxWidth:"1400px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"48px",alignItems:"center",position:"relative",zIndex:2}}>
<Reveal><div>
<div style={{fontFamily:F.sans,fontSize:"9px",letterSpacing:"0.48em",textTransform:"uppercase",color:C.gold,marginBottom:"16px",display:"flex",alignItems:"center",gap:"12px"}}><span style={{width:"32px",height:"1px",background:C.gold}}/>Ghost Kitchen</div>
<h2 style={{fontFamily:F.serif,fontSize:"clamp(32px,4.5vw,56px)",fontWeight:400,fontStyle:"italic",lineHeight:0.95,color:C.cream,marginBottom:"24px"}}>Delivered<br/><span style={{color:C.burgundy}}>With A Smile.</span></h2>
<p style={{fontFamily:F.sans,fontSize:"14px",lineHeight:1.8,color:C.muted,marginBottom:"36px"}}>Multi-brand delivery from a single kitchen. Ten concepts, one infrastructure, nationwide reach.</p>
<div style={{display:"flex",gap:"28px"}}>{[{v:"10",l:"Virtual Brands"},{v:"150+",l:"Zones"},{v:"30min",l:"Avg Delivery"}].map(s=>(<div key={s.l} style={{borderLeft:`1px solid ${C.dim}`,paddingLeft:"14px"}}><div style={{fontFamily:F.serif,fontSize:"24px",fontWeight:400,fontStyle:"italic",color:C.gold}}>{s.v}</div><div style={{fontFamily:F.sans,fontSize:"8px",letterSpacing:"0.3em",textTransform:"uppercase",color:C.muted,marginTop:"4px"}}>{s.l}</div></div>))}</div></div></Reveal>
<Reveal d={0.2}><img src="/images/casper-ghost-scooter.png" alt="Casper Ghost Kitchen" style={{width:"100%",height:"auto"}}/></Reveal>
</div></section>)}

// ─── TEAM ────────────────────────────────────────────────────────────────────
function TeamSection(){return(
<section style={{background:C.base,padding:"0 clamp(32px,6vw,80px)",position:"relative"}}><div style={{maxWidth:"1400px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px"}}>
{[{src:"/images/lifestyle/casper-kitchen-crew.png",label:"The Kitchen"},{src:"/images/lifestyle/casper-staff-uniforms.png",label:"The Team"}].map(img=>(<div key={img.label} style={{position:"relative",overflow:"hidden",aspectRatio:"4/3"}}><img src={img.src} alt={img.label} style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"48px 24px 20px",background:"linear-gradient(transparent,rgba(0,0,0,0.75))"}}><div style={{fontFamily:F.sans,fontSize:"8px",fontWeight:600,letterSpacing:"0.4em",textTransform:"uppercase",color:C.gold}}>{img.label}</div></div></div>))}</div></section>)}

// ─── WHY CASPER ──────────────────────────────────────────────────────────────
function WhyCasper(){return(
<section id="franchise" style={{background:`linear-gradient(180deg,${C.base} 0%,${C.surface} 100%)`,padding:"120px clamp(32px,6vw,80px)"}}><div style={{maxWidth:"1400px",margin:"0 auto"}}><Reveal><div style={{fontFamily:F.sans,fontSize:"9px",letterSpacing:"0.48em",textTransform:"uppercase",color:C.gold,marginBottom:"16px",display:"flex",alignItems:"center",gap:"12px"}}><span style={{width:"32px",height:"1px",background:C.gold}}/>The Power Platform</div><h2 style={{fontFamily:F.serif,fontSize:"clamp(36px,5vw,68px)",fontWeight:400,fontStyle:"italic",color:C.cream,lineHeight:1.0,marginBottom:"48px"}}>Why Casper Group</h2></Reveal>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"2px"}}>{[{title:"Our Brands",items:["Operators seeking proven concepts","Landlords looking for quality tenants","Vendors building supply partnerships","Media and press collaborations"],color:C.burgundy},{title:"Our Markets",items:["Atlanta — Flagship market","Houston — Strong expansion","Charlotte — Growing demand","Nationwide ghost kitchens"],color:C.gold},{title:"Our Company",items:["Franchise-ready infrastructure","Dual-kitchen operating model","Mascot universe IP advantage","Central support system"],color:C.orange}].map(col=>(<div key={col.title} style={{background:C.dark,padding:"40px 28px",borderTop:`2px solid ${col.color}`}}><div style={{fontFamily:F.sans,fontSize:"9px",fontWeight:600,letterSpacing:"0.4em",textTransform:"uppercase",color:col.color,marginBottom:"24px"}}>{col.title}</div><ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"12px"}}>{col.items.map(item=>(<li key={item} style={{display:"flex",alignItems:"flex-start",gap:"10px",fontFamily:F.sans,fontSize:"13px",lineHeight:1.6,color:C.muted}}><div style={{width:"4px",height:"4px",borderRadius:"50%",background:col.color,flexShrink:0,marginTop:"8px"}}/>{item}</li>))}</ul></div>))}</div></div></section>)}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function PartnerCTA(){return(
<section style={{background:C.dark,padding:"140px clamp(32px,6vw,80px)",position:"relative",overflow:"hidden"}}><Grain o={0.03}/>
<div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 40% 50%,${C.burgundyGlow},transparent 55%),radial-gradient(ellipse at 60% 50%,${C.goldDim},transparent 55%)`}}/>
<div style={{maxWidth:"860px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:2}}><Reveal>
<img src="/images/casper-logo-white.png" alt="Casper Group" style={{height:"48px",margin:"0 auto 32px",display:"block",opacity:0.6}}/>
<h2 style={{fontFamily:F.serif,fontSize:"clamp(36px,5vw,72px)",fontWeight:400,fontStyle:"italic",color:C.cream,lineHeight:1.0,marginBottom:"20px"}}>The Modern Fast-Food<br/>Empire Starts Here.</h2>
<p style={{fontFamily:F.sans,fontSize:"15px",lineHeight:1.8,color:C.muted,maxWidth:"500px",margin:"0 auto 40px"}}>Whether you are an operator, landlord, or strategic partner — Casper Group has a path for results at scale.</p>
<div style={{display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap"}}>
<button style={{fontFamily:F.sans,fontSize:"9px",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:C.base,background:C.gold,border:"none",padding:"14px 44px",cursor:"pointer"}}>Explore Partnership</button>
<button style={{fontFamily:F.sans,fontSize:"9px",fontWeight:500,letterSpacing:"0.15em",textTransform:"uppercase",color:C.cream,background:"transparent",border:`1px solid ${C.dim}`,padding:"14px 36px",cursor:"pointer"}}>Franchise Inquiry</button></div></Reveal></div></section>)}

// ─── FOOTER with logo ────────────────────────────────────────────────────────
function Footer(){return(<footer style={{background:C.dark,borderTop:`1px solid ${C.dim}`,padding:"56px clamp(32px,6vw,80px) 36px"}}><div style={{maxWidth:"1400px",margin:"0 auto"}}><div style={{display:"grid",gridTemplateColumns:"1.5fr repeat(3,1fr)",gap:"40px",marginBottom:"48px"}}><div><img src="/images/casper-logo-white.png" alt="Casper Group" style={{height:"36px",marginBottom:"14px"}}/><p style={{fontFamily:F.sans,fontSize:"12px",lineHeight:1.7,color:C.muted}}>10+ concepts. Multi-city infrastructure. Built to scale.</p></div>{[{h:"Brands",l:["Angel Wings","Morning After","Espresso Co.","Mr. Oyster","Toss'd","Taco Yaki","Pasta Bish"]},{h:"Company",l:["About Us","Locations","Franchise","Vendors","Press"]},{h:"Contact",l:["info@caspergroupworldwide.com","Operator Inquiry","Landlord Inquiry"]}].map(col=>(<div key={col.h}><div style={{fontFamily:F.sans,fontSize:"8px",fontWeight:600,letterSpacing:"0.4em",textTransform:"uppercase",color:C.gold,marginBottom:"16px"}}>{col.h}</div><ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"8px"}}>{col.l.map(i=><li key={i} style={{fontFamily:F.sans,fontSize:"12px",color:C.muted}}>{i}</li>)}</ul></div>))}</div><div style={{borderTop:`1px solid ${C.dim}`,paddingTop:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}><div style={{fontFamily:F.sans,fontSize:"10px",color:"rgba(246,240,231,0.2)"}}>© 2026 Casper Group. A KHG Enterprise.</div><div style={{display:"flex",gap:"20px"}}>{["Privacy","Terms","Contact"].map(i=><span key={i} style={{fontFamily:F.sans,fontSize:"10px",color:"rgba(246,240,231,0.2)",cursor:"pointer"}}>{i}</span>)}</div></div></div></footer>)}

export default function CasperGroupV4(){return(<div style={{background:C.base}}><Nav/><Hero/><BrandWorlds/><FoodGallery/><GhostKitchen/><TeamSection/><WhyCasper/><PartnerCTA/><Footer/></div>)}
