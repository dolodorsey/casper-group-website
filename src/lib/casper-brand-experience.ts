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
 * 2026 creative certification: requested Casper brands now use the current motion
 * already approved in the repository's media allowlist plus the user's real Drive
 * campaign art. Each brand remains a separate creative world and keeps its live menu.
 */
export const casperBrandExperiences: Record<string, CasperBrandExperience> = {
  'angel-wings': {
    variant: 'halo',
    heroVideo: driveMedia('1V25uOjLKns4L_CsIojnlakPrV8L8sTY6'),
    heroVideoMobile: driveMedia('1MD79M4KjdAe_vr4D2SK5hdd0MVpOlnRD'),
    secondaryVideo: driveMedia('1THO-QL2tgwvKyGgJElTIqObLSME836Fm'),
    gallery: [
      driveMedia('1uVh4F0G56A-Q3n0l9ib2liV7VDXd8xs-'),
      driveMedia('11Af9xIhyFG6aHpg-gPM3FJJtPHy9pD-X'),
      driveMedia('12YANAf_KCXD1dg1lSus40gIYCtJQ0DbC'),
      driveMedia('1bXaVog9fL5wO5gg6c2myI25QQqHStfoS'),
    ],
    mascot: driveMedia('1gJiMLlqRDc_AJKS-PYcvTJ0Fx9d-WR8Y'),
    shortLabel: 'Heaven-sent heat',
  },
  'tha-morning-after': {
    variant: 'sunrise',
    heroVideo: driveMedia('1o7dtk3fpPqsaVYKAqkhZ2Jcbpne_P2YB'),
    gallery: [
      driveMedia('1ICwpewyTAXp7kAeEOkUTedglm81yI9it'),
      driveMedia('15xZ2qw-tIQ2_fjY3vk8HRMcZkltEQAzV'),
      driveMedia('17xqYXkV4M8b4BVqLkyZV7P2e_j244EPe'),
    ],
    mascot: driveMedia('1lFpOiklEfS74Jz_meTEw-1Qb6uhai-bM'),
    shortLabel: 'Breakfast after everything',
  },
  'patty-daddy': {
    variant: 'smash',
    heroVideo: driveMedia('1KiYD9D0I2O6ZLrtYV3xkiF1RvsuXhWmo'),
    gallery: [
      driveMedia('1BwfhCwAjTzQ_Eszg94L3WYfriO8OKVlH'),
      driveMedia('1l4xG1N0lkwKoXKlWeWChFKCBIA6BQro8'),
      driveMedia('1RK6YUSSidyIgON6TR2unEAYgnx_8-Okq'),
      driveMedia('1mFtjN9ByHsqkIOPaovwSgNhbPdIgVkpl'),
    ],
    mascot: driveMedia('1gPgAxM8aO7p3FmLHDZ0QUvQCftG7ofJ1'),
    shortLabel: 'Big smash energy',
  },
  'espresso-co': {
    variant: 'lab',
    heroVideo: driveMedia('1ipuuxn9Oem8EezABsfiSkOhuDQ77y7_E'),
    secondaryVideo: driveMedia('1aBmFWUJ4eFPGFZp5kUU6jsBVpLUUdJPK'),
    gallery: [
      driveMedia('1545tK6BbikyBeafmmAnuKmpa67DsMe76'),
      driveMedia('1T6Na4cX6qrrr07ZS_I2bn9vRcufD96B4'),
      driveMedia('1RwJstvLEtOIEgFvmDAwBZk3JTZNaBZlK'),
      driveMedia('1ziiFgFI7tCBaNuXVejfz9vpnI3dtiC0k'),
    ],
    mascot: driveMedia('1JcskswWYKwgF6JudT6jjA95nVm3CQG22'),
    shortLabel: 'Coffee with precision',
  },
  'mojo-juice': {
    variant: 'fresh',
    heroVideo: driveMedia('10Gaduvuzb8wxuxfUhr_0u638-SHZihmx'),
    gallery: [
      driveMedia('1b5nwhWjXuuLx5eOg67R-meYQV8QceJ1W'),
      driveMedia('1AGsyDnQSHtXIaRACmeoRcke-secy3yGN'),
      driveMedia('1SOzb74TwmcvW8vVjtZ9ouXlgfQpYb2Jb'),
      driveMedia('17bmvrSubOrqxDXe6hhD7GmDkpuN6b6sU'),
    ],
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
    mascot: driveMedia('1g6gL48VTB_ENxjHWqJflfl2JZjanM9OW'),
    shortLabel: 'Raw bar confidence',
  },
  'sweet-tooth': {
    variant: 'candy',
    heroVideo: driveMedia('1KjCPso-XE0KUTzqNCLFJtrbAF5971kDk'),
    gallery: [
      driveMedia('1tBeHx7LT5Kc-wBuF-n3_P6FxUCjWwpWK'),
      driveMedia('1tA1I2tTKmr0bEAzYDkYKUsDxsGJ64gjh'),
      driveMedia('1V451MLUY6WUHY4__Qvfoqk8XBRbhdakz'),
      driveMedia('1vEG2Oc_90Gn--y0YaKJ3kEhVzlfTHxfr'),
    ],
    mascot: driveMedia('1SM62KxJCCUOdt2I5usgX2JMgUNkOcbxq'),
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
    mascot: driveMedia('1m5ZukRzFyjGhHELq6H-sryO4PdRSP8-s'),
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
    mascot: driveMedia('1WGvE6Jl_sMogvbeKKueFu9NrsEmv_bg0'),
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
    mascot: driveMedia('1H3774fi3Z8qoEmAm9S-Vo1alVjNq7r9o'),
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
    mascot: driveMedia('1oOJ6bE_B1tbZaYTPAeCJ8M54iHIUXfmK'),
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
