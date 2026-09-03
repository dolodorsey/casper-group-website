import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CasperMenuDeepPage from '@/components/casper-multipage/CasperMenuDeepPage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

export const dynamic = 'force-dynamic';

function titleize(value:string){return decodeURIComponent(value).replace(/[-_]+/g,' ').replace(/\b\w/g,(letter)=>letter.toUpperCase())}

export function generateMetadata({params}:{params:{slug:string;category:string}}):Metadata{
  const profile=getCasperSiteProfile(params.slug); if(!profile) return {};
  const category=titleize(params.category); const title=`${category} Menu | ${profile.name}`; const canonical=`https://caspergroupworldwide.com/${profile.slug}/menu/${params.category}`;
  return {title,description:`Browse the ${category.toLowerCase()} menu for ${profile.name}.`,alternates:{canonical},openGraph:{title,description:profile.description,url:canonical,siteName:profile.name,type:'website',images:[profile.heroImage]}};
}

export default function MenuCategoryRoute({params}:{params:{slug:string;category:string}}){const profile=getCasperSiteProfile(params.slug);if(!profile)notFound();return <CasperMenuDeepPage profile={profile} category={params.category}/>}
