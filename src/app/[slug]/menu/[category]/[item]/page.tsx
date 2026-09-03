import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CasperMenuDeepPage from '@/components/casper-multipage/CasperMenuDeepPage';
import { getCasperSiteProfile } from '@/lib/casper-site-registry';

export const dynamic = 'force-dynamic';

function titleize(value:string){return decodeURIComponent(value).replace(/[-_]+/g,' ').replace(/\b\w/g,(letter)=>letter.toUpperCase())}

export function generateMetadata({params}:{params:{slug:string;category:string;item:string}}):Metadata{
  const profile=getCasperSiteProfile(params.slug); if(!profile) return {};
  const item=titleize(params.item); const title=`${item} | ${profile.name}`; const canonical=`https://caspergroupworldwide.com/${profile.slug}/menu/${params.category}/${params.item}`;
  return {title,description:`View ${item} from the ${profile.name} menu.`,alternates:{canonical},openGraph:{title,description:profile.description,url:canonical,siteName:profile.name,type:'website',images:[profile.heroImage]}};
}

export default function MenuItemRoute({params}:{params:{slug:string;category:string;item:string}}){const profile=getCasperSiteProfile(params.slug);if(!profile)notFound();return <CasperMenuDeepPage profile={profile} category={params.category} item={params.item}/>}
