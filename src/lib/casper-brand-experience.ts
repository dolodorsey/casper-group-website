export type CasperHomeVariant = 'halo' | 'sunrise' | 'smash' | 'lab' | 'fresh' | 'ocean' | 'candy' | 'fire' | 'garden' | 'sauce' | 'peace' | 'dragon';

export type CasperBrandExperience = {
  variant: CasperHomeVariant;
  heroVideo?: string;
  secondaryVideo?: string;
  gallery: string[];
  mascot?: string;
  shortLabel: string;
};

export const casperBrandExperiences: Record<string, CasperBrandExperience> = {
  'angel-wings': {
    variant: 'halo',
    heroVideo: '/videos/angel.mp4',
    secondaryVideo: '/videos/angel-wings.mp4',
    gallery: ['/images/angel-wings-plate.jpg', '/images/angel-wings-mural.jpg', '/images/food/lemon-pepper-wings.png'],
    mascot: '/images/mascot-loudini.png',
    shortLabel: 'Heaven-sent heat',
  },
  'tha-morning-after': {
    variant: 'sunrise',
    gallery: ['/images/morning-after-hero.jpg', '/images/morning-french-toast.jpg', '/images/morning-sandwiches.jpg'],
    mascot: '/images/mascot-eggavier.png',
    shortLabel: 'Breakfast after everything',
  },
  'patty-daddy': {
    variant: 'smash',
    heroVideo: '/videos/patty-daddy.mp4',
    gallery: ['/images/patty-daddy-hero.jpg', '/images/patty-smashburger.jpg', '/images/patty-sliders.jpg'],
    mascot: '/images/mascot-paddy-daddy.png',
    shortLabel: 'Big smash energy',
  },
  'espresso-co': {
    variant: 'lab',
    heroVideo: '/videos/espresso-brand-ani.mp4',
    secondaryVideo: '/videos/espresso-logo-ani.mp4',
    gallery: ['/images/espresso-machine.jpg', '/images/espresso-lab.png', '/images/espresso-latte.png'],
    mascot: '/images/mascot-beanzo.png',
    shortLabel: 'Coffee with precision',
  },
  'mojo-juice': {
    variant: 'fresh',
    heroVideo: '/videos/mojo-juice.mp4',
    gallery: ['/images/mojo-juice.png', '/images/mojo-smoothie.png', '/images/food/green-juice-splash.png'],
    mascot: '/images/mascot-mojo.png',
    shortLabel: 'Fresh energy daily',
  },
  'mr-oyster': {
    variant: 'ocean',
    heroVideo: '/videos/mr-oyster.mp4',
    gallery: ['/images/mr-oyster.png', '/images/oyster-scallops.jpg', '/images/portal-mr-oyster.jpeg'],
    mascot: '/images/mascot-mr-miss-oyster.png',
    shortLabel: 'Raw bar confidence',
  },
  'sweet-tooth': {
    variant: 'candy',
    heroVideo: '/videos/sweet-tooth.mp4',
    gallery: ['/images/sweet-tooth.png', '/images/portal-sweet-tooth.jpeg', '/images/mascot-sweet-tooth.png'],
    mascot: '/images/mascot-sweet-tooth.png',
    shortLabel: 'Dessert is the event',
  },
  'taco-yaki': {
    variant: 'fire',
    heroVideo: '/videos/taco-yaki.mp4',
    gallery: ['/images/taco-hibachi.jpg', '/images/taco-platter.jpg', '/images/taco-yaki-ninja.jpg'],
    mascot: '/images/mascot-yaki.png',
    shortLabel: 'Hibachi meets taco fire',
  },
  tossd: {
    variant: 'garden',
    heroVideo: '/videos/tossd.mp4',
    gallery: ['/images/tossd.png', '/images/food/green-juice-splash.png', '/images/portal-tossd.jpeg'],
    mascot: '/images/mascot-lenny-lettuce.png',
    shortLabel: 'Fresh without compromise',
  },
  'pasta-bish': {
    variant: 'sauce',
    heroVideo: '/videos/pasta-bish.mp4',
    secondaryVideo: '/videos/pasta-bish-logo.mp4',
    gallery: ['/images/pasta-fettuccine.jpg', '/images/pasta-marinara.jpg', '/images/pasta-bish.jpg'],
    mascot: '/images/mascot-lil-linguine.png',
    shortLabel: 'Comfort with attitude',
  },
  'peace-pizza': {
    variant: 'peace',
    gallery: ['/images/portal-peace-pizza.png', '/images/logo-peace-pizza.png', '/images/casper-background.png'],
    shortLabel: 'Good slices. Good energy.',
  },
  'american-dragon': {
    variant: 'dragon',
    gallery: ['/images/portal-american-dragon.png', '/images/food/fried-rice-shrimp.png', '/images/logo-american-dragon.png'],
    shortLabel: 'Luxury takeout after dark',
  },
};

export function getCasperBrandExperience(slug: string) {
  return casperBrandExperiences[slug] || null;
}
