import Image from 'next/image';
import type { ReactNode, CSSProperties } from 'react';
import type { CasperSection, CasperSiteProfile } from '@/lib/casper-site-registry';
import { getCasperBrandExperience } from '@/lib/casper-brand-experience';
import './casper-section-visual-shell.css';

const GALLERY_INDEX: Partial<Record<CasperSection, number>> = {
  order: 0,
  catering: 1,
  locations: 2,
  about: 0,
  rewards: 1,
  contact: 2,
};

export default function CasperSectionVisualShell({
  profile,
  section,
  children,
}: {
  profile: CasperSiteProfile;
  section: CasperSection;
  children: ReactNode;
}) {
  const experience = getCasperBrandExperience(profile.slug);
  if (!experience) return children;

  const galleryIndex = GALLERY_INDEX[section] ?? 0;
  const image = experience.gallery[galleryIndex] || experience.gallery[0] || profile.heroImage;
  const showMascot = Boolean(experience.mascot && ['about', 'rewards', 'contact'].includes(section));

  return (
    <div
      className="csv-shell"
      data-variant={experience.variant}
      data-section={section}
      style={{
        '--csv-accent': profile.accent,
        '--csv-bright': profile.accentBright,
      } as CSSProperties}
    >
      <div className="csv-hero-layer" aria-hidden="true">
        <Image src={image} alt="" fill priority sizes="100vw" />
        <div className="csv-hero-texture" />
        {showMascot ? (
          <div className="csv-mascot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={experience.mascot} alt="" />
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
