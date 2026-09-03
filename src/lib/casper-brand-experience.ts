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

export const casperBrandExperiences: Record<string, CasperBrandExperience> = {
  'angel-wings': {
    variant: 'halo',
    heroVideo: driveMedia('1V25uOjLKns4L_CsIojnlakPrV8L8sTY6'),
    heroVideoMobile: driveMedia('1MD79M4KjdAe_vr4D2SK5hdd0MVpOlnRD'),
    secondaryVideo: driveMedia('1THO-QL2tgwvKyGgJElTIqObLSME836Fm'),
    gallery: [
      driveMedia('1yICMDAcyzC9Er5o1B99kmG0OqwGkvh7Z'),
      driveMedia('1HwanqSmzyDXBxdvYSnngIpQJNDa_C-lc'),
      driveMedia('1_1oz3EyYJ01qzIgQLvVBcDq__IsF0HJ7'),
    ],
    mascot: '/images/mascot-loudini.png',
    shortLabel: 'Heaven-sent heat',
  },
  'tha-morning-after': {
    variant: 'sunrise',
    heroVideo: driveMedia('1o7dtk3fpPqsaVYKAqkhZ2Jcbpne_P2YB'),
    gallery: ['/images/morning-after-hero.jpg', '/images/morning-french-toast.jpg', '/images/morning-sandwiches.jpg'],
    mascot: '/images/mascot-eggavier.png',
    shortLabel: 'Breakfast after everything',
  },
  'patty-daddy': {
    variant: 'smash',
    heroVideo: driveMedia('1KiYD9D0I2O6ZLrtYV3xkiF1RvsuXhWmo'),
    gallery: ['/images/patty-daddy-hero.jpg', '/images/patty-smashburger.jpg', '/images/patty-sliders.jpg'],
    mascot: '/images/mascot-paddy-daddy.png',
    shortLabel: 'Big smash energy',
  },
  'espresso-co': {
    variant: 'lab',
    heroVideo: driveMedia('1ipuuxn9Oem8EezABsfiSkOhuDQ77y7_E'),
    secondaryVideo: driveMedia('1aBmFWUJ4eFPGFZp5kUU6jsBVpLUUdJPK'),
    gallery: [
      driveMedia('1_qafmRb8HnjycpCYZ8owwNOZ9dB4AoDg'),
      driveMedia('1TVeu5og1YDWrz9yDxsnzHWncfwqQJKVW'),
      driveMedia('1sUqswa5ZiE6xLdNCJR9c7FI-h7c3E7HP'),
    ],
    mascot: '/images/mascot-beanzo.png',
    shortLabel: 'Coffee with precision',
  },
  'mojo-juice': {
    variant: 'fresh',
    heroVideo: driveMedia('10Gaduvuzb8wxuxfUhr_0u638-SHZihmx'),
    gallery: [
      driveMedia('1wMBHI5-xnZ41SxA7a4vLOiVfhG9Ncybv'),
      driveMedia('1QNG8F6U0O6pFYhiTrOGpxpebhQqdBiqd'),
      driveMedia('1bqntIh0GW3xpud0-llds6VW1dm_Y8ZTm'),
    ],
    mascot: '/images/mascot-mojo.png',
    shortLabel: 'Fresh energy daily',
  },
  'mr-oyster': {
    variant: 'ocean',
    heroVideo: driveMedia('1mg0svDReyPM0mpcxnrF7-opxKMftygvL'),
    gallery: [
      driveMedia('1BdPSH3UUW139zBfcVYohBVXsPQRr4o_x'),
      driveMedia('1QY8JL4kR4io6Joaww4ttPhbx6sKmDYHl'),
      driveMedia('1-LJw0dOiP5g1SMP0F3XuRsCM2SuM-V19'),
    ],
    mascot: '/images/mascot-mr-miss-oyster.png',
    shortLabel: 'Raw bar confidence',
  },
  'sweet-tooth': {
    variant: 'candy',
    heroVideo: driveMedia('1KjCPso-XE0KUTzqNCLFJtrbAF5971kDk'),
    gallery: [
      driveMedia('1csLrgQIVpbxyeLSC11rSuPfAfdUiAewR'),
      driveMedia('1hh3Z9ww4USs72vjslax6KEUEyKrkR6Hu'),
      driveMedia('1ZI2XC2YtmNF8sQWYYxQ06wMlxW2gmvaT'),
    ],
    mascot: '/images/mascot-sweet-tooth.png',
    shortLabel: 'Dessert is the event',
  },
  'taco-yaki': {
    variant: 'fire',
    heroVideo: driveMedia('1FOz7i7bMHl2WRECMxVretfGaYPF657AG'),
    gallery: [
      driveMedia('1VujWrnb5M0RxKjFFBpcbE_RVlvjbw-T2'),
      driveMedia('1zJdTniHvV079VO4Z4VgSMpatIKe-LFLk'),
      driveMedia('1TU9NtsKp2X8kzi5AVcXrFOfIHXZXEVSW'),
    ],
    mascot: '/images/mascot-yaki.png',
    shortLabel: 'Hibachi meets taco fire',
  },
  tossd: {
    variant: 'garden',
    heroVideo: driveMedia('18SDp95ZVyAftd55R4zG2gwxd-EC4J4O8'),
    gallery: [
      driveMedia('1cTKrc-cMqZ-IJHXAllAWL5YCC538aUwv'),
      driveMedia('1xdMvL2hoUnpYpXQ_2dD6NIGO4zwu8DTV'),
      driveMedia('1K7JyX3dOI2eVlHjGk9AWm64mKSGIJ5Im'),
    ],
    mascot: '/images/mascot-lenny-lettuce.png',
    shortLabel: 'Fresh without compromise',
  },
  'pasta-bish': {
    variant: 'sauce',
    heroVideo: driveMedia('1th39hcfT-smuvF4GCeju70tFuGpBfZxK'),
    secondaryVideo: driveMedia('1SxjkEl25QUsUYy8msWiU1MbhzV3uNcWu'),
    gallery: [
      driveMedia('1z1DyOlro8Zg5foX2FDVKzq3Z26Bzx-Cy'),
      driveMedia('1M4SsHXK3uDJgIU2t66Y5_9sOBKAboVjh'),
      driveMedia('1FXAzToY1VG46D9O3hDN2CRKtWED0nfpt'),
    ],
    mascot: '/images/mascot-lil-linguine.png',
    shortLabel: 'Comfort with attitude',
  },
  'peace-pizza': {
    variant: 'peace',
    heroVideo: driveMedia('1_PhppyhAo7ezAwHISk26u8F_juhdBQDr'),
    gallery: [
      driveMedia('1wk28ZOfO-43WK7EQX2ZvyqvbclK4jg8N'),
      driveMedia('1rDNq7uPVc7iQqKpaPgky4WCI8h6EWlWZ'),
      driveMedia('1FtEkoffLwxgPz87wBvoOFzzyg-UxU2ux'),
    ],
    shortLabel: 'Good slices. Good energy.',
  },
  'american-dragon': {
    variant: 'dragon',
    heroVideo: driveMedia('1BtFGByA-rYxZCcb1SUz1L701lEEIBOml'),
    secondaryVideo: driveMedia('15q_Ofxf_Khl3lErxVbbCNcn9NMxBbjaI'),
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
