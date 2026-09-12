const base = process.env.CASPER_SMOKE_BASE || 'http://127.0.0.1:3100';

const brands = [
  'angel-wings',
  'tha-morning-after',
  'patty-daddy',
  'espresso-co',
  'mojo-juice',
  'mr-oyster',
  'sweet-tooth',
  'taco-yaki',
  'tossd',
  'pasta-bish',
  'peace-pizza',
  'american-dragon',
];

const sections = ['', '/menu', '/order', '/catering', '/locations', '/about', '/rewards', '/contact'];
const corporate = ['/', '/corporate', '/about', '/brands', '/locations', '/franchise', '/careers', '/press', '/contact', '/operator'];
const routes = [...corporate, ...brands.flatMap((brand) => sections.map((section) => `/${brand}${section}`))];

const failures = [];
for (const route of routes) {
  try {
    const response = await fetch(`${base}${route}`, { redirect: 'follow', signal: AbortSignal.timeout(12000) });
    if (!response.ok) failures.push(`${route} -> ${response.status}`);
    else console.log(`PASS ${response.status} ${route}`);
  } catch (error) {
    failures.push(`${route} -> ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failures.length) {
  console.error('\nCustomer route smoke test failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nVerified ${routes.length} customer-facing Casper routes.`);
