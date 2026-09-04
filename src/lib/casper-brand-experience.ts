export type CasperHomeVariant = 'halo' | 'sunrise' | 'smash' | 'lab' | 'fresh' | 'ocean' | 'candy' | 'fire' | 'garden' | 'sauce' | 'peace' | 'dragon';

export type CasperBrandExperience = {
  variant: CasperHomeVariant;
  heroVideo?: string;
  heroVideoMobile?: string;
  secondaryVideo?: string;
  gallery: string[];
  mascot?: string;
  shortLabel: string;
};

const driveMedia = (id: string) => `/api/media/drive/${id}`;

/*
 * Motion rule: all legacy Casper animations are intentionally excluded from the live
 * experience registry. Brand homepages use their approved static hero/gallery assets
 * until brand-specific 2026+ motion is produced and explicitly approved.
 */
export const casperBrandExperiences: Record<string, CasperBrandExperience> = {
  'angel-wings': {
    variant: 'halo',
    gallery: [
      driveMedia('1yICMDAcyzC9Er5o1B99kmG0OqwGkvh7Z'),
      driveMedia('1HwanqSmzyDXBxdvYSnngIpQJNDa_C-lc'),
      driveMedia('1_1oz3EyYJ01qzIgQLvVBcDq__IsF0HJ7'),
    ],
    mascot: driveMedia('1gJiMLlqRDc_AJKS-PYcvTJ0Fx9d-WR8Y'),
    shortLabel: 'Heaven-sent heat',
  },
  'tha-morning-after': {
    variant: 'sunrise',
    gallery: ['/images/morning-after-hero.jpg', '/images/morning-french-toast.jpg', '/images/morning-sandwiches.jpg'],
    mascot: driveMedia('1lFpOiklEfS74Jz_meTEw-1Qb6uhai-bM'),
    shortLabel: 'Breakfast after everything',
  },
  'patty-daddy': {
    variant: 'smash',
    gallery: ['/images/patty-daddy-hero.jpg', '/images/patty-smashburger.jpg', '/images/patty-sliders.jpg'],
    mascot: driveMedia('1gPgAxM8aO7p3FmLHDZ0QUvQCftG7ofJ1'),
    shortLabel: 'Big smash energy',
  },
  'espresso-co': {
    variant: 'lab',
    gallery: [
      driveMedia('1_qafmRb8HnjycpCYZ8owwNOZ9dB4AoDg'),
      driveMedia('1TVeu5og1YDWrz9yDxsnzHWncfwqQJKVW'),
      driveMedia('1sUqswa5ZiE6xLdNCJR9c7FI-h7c3E7HP'),
    ],
    mascot: driveMedia('1JcskswWYKwgF6JudT6jjA95nVm3CQG22'),
    shortLabel: 'Coffee with precision',
  },
  'mojo-juice': {
    variant: 'fresh',
    gallery: [
      driveMedia('1wMBHI5-xnZ41SxA7a4vLOiVfhG9Ncybv'),
      driveMedia('1QNG8F6U0O6pFYhiTrOGpxpebhQqdBiqd'),
      driveMedia('1bqntIh0GW3xpud0-llds6VW1dm_Y8ZTm'),
    ],
    shortLabel: 'Fresh energy daily',
  },
  'mr-oyster': {
    variant: 'ocean',
    gallery: [
      driveMedia('1BdPSH3UUW139zBfcVYohBVXsPQRr4o_x'),
      driveMedia('1QY8JL4kR4io6Joaww4ttPhbx6sKmDYHl'),
      driveMedia('1-LJw0dOiP5g1SMP0F3XuRsCM2SuM-V19'),
    ],
    mascot: driveMedia('1g6gL48VTB_ENxjHWqJflfl2JZjanM9OW'),
    shortLabel: 'Raw bar confidence',
  },
  'sweet-tooth': {
    variant: 'candy',
    gallery: [
      driveMedia('1csLrgQIVpbxyeLSC11rSuPfAfdUiAewR'),
      driveMedia('1hh3Z9ww4USs72vjslax6KEUEyKrkR6Hu'),
      driveMedia('1ZI2XC2YtmNF8sQWYYxQ06wMlxW2gmvaT'),
    ],
    mascot: driveMedia('1SM62KxJCCUOdt2I5usgX2JMgUNkOcbxq'),
    shortLabel: 'Dessert is the event',
  },
  'taco-yaki': {
    variant: 'fire',
    gallery: [
      driveMedia('1VujWrnb5M0RxKjFFBpcbE_RVlvjbw-T2'),
      driveMedia('1zJdTniHvV079VO4Z4VgSMpatIKe-LFLk'),
      driveMedia('1TU9NtsKp2X8kzi5AVcXrFOfIHXZXEVSW'),
    ],
    mascot: driveMedia('1m5ZukRzFyjGhHELq6H-sryO4PdRSP8-s'),
    shortLabel: 'Hibachi meets taco fire',
  },
  tossd: {
    variant: 'garden',
    gallery: [
      driveMedia('1cTKrc-cMqZ-IJHXAllAWL5YCC538aUwv'),
      driveMedia('1xdMvL2hoUnpYpXQ_2dD6NIGO4zwu8DTV'),
      driveMedia('1K7JyX3dOI2eVlHjGk9AWm64mKSGIJ5Im'),
    ],
    mascot: driveMedia('1WGvE6Jl_sMogvbeKKueFu9NrsEmv_bg0'),
    shortLabel: 'Fresh without compromise',
  },
  'pasta-bish': {
    variant: 'sauce',
    gallery: [
      driveMedia('1z1DyOlro8Zg5foX2FDVKzq3Z26Bzx-Cy'),
      driveMedia('1M4SsHXK3uDJgIU2t66Y5_9sOBKAboVjh'),
      driveMedia('1FXAzToY1VG46D9O3hDN2CRKtWED0nfpt'),
    ],
    mascot: driveMedia('1H3774fi3Z8qoEmAm9S-Vo1alVjNq7r9o'),
    shortLabel: 'Comfort with attitude',
  },
  'peace-pizza': {
    variant: 'peace',
    gallery: [
      driveMedia('1wk28ZOfO-43WK7EQX2ZvyqvbclK4jg8N'),
      driveMedia('1rDNq7uPVc7iQqKpaPgky4WCI8h6EWlWZ'),
      driveMedia('1FtEkoffLwxgPz87wBvoOFzzyg-UxU2ux'),
    ],
    mascot: driveMedia('1oOJ6bE_B1tbZaYTPAeCJ8M54iHIUXfmK'),
    shortLabel: 'Good slices. Good energy.',
  },
  'american-dragon': {
    variant: 'dragon',
    gallery: [
      driveMedia('1gwefS0XW6EkYfMARut8zxWg-ZjXgCLHc'),
      driveMedia('1xd7dcc-Tdw__vqNoGvrRM7wT-t1PUcL6'),
      driveMedia('1oPQHK_G2OHm-vDFH3ZWsJc-Hyhbr6dOs'),
    ],
    shortLabel: 'Luxury takeout after dark',
  },
};

export function getCasperBrandExperience(slug: string) {
  return casperBrandExperiences[slug] || null;
}
