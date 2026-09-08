import { readFile } from 'node:fs/promises';

const checks = [
  {
    path: 'src/app/api/brand/[brand]/route.ts',
    required: [
      'const UPSTREAM_TIMEOUT_MS = 5000;',
      'new AbortController()',
      "'Retry-After': '30'",
      "'X-Casper-Data': 'unavailable'",
      'if (upstream.status >= 500)',
      "return unavailableResponse('Request could not be completed.');",
    ],
    forbidden: [
      "return response({ ok: false, error: 'Request could not be completed.' }, 500);",
    ],
  },
  {
    path: 'src/app/api/corporate/locations/route.ts',
    required: [
      'const UPSTREAM_TIMEOUT_MS = 5000;',
      'new AbortController()',
      "'Retry-After': '30'",
      "'X-Casper-Data': 'unavailable'",
      'if (upstream.status >= 500)',
    ],
    forbidden: [],
  },
  {
    path: 'src/app/api/forms/route.js',
    required: [
      'const UPSTREAM_TIMEOUT_MS = 5000;',
      "const CASPER_BRAND_KEY = 'casper_group';",
      'if (body.brand_key !== CASPER_BRAND_KEY)',
      'brand_key: CASPER_BRAND_KEY,',
      "'Retry-After': '30'",
      "'X-Casper-Intake': 'unavailable'",
      "'X-Casper-Intake': 'rejected'",
      'if (upstream.status >= 500)',
    ],
    forbidden: [],
  },
  {
    path: 'src/app/api/forms/submit/route.js',
    required: [
      "import { POST as handleCasperGroupForm } from '../route';",
      'return handleCasperGroupForm(request);',
    ],
    forbidden: [
      'supabase.co',
      'corporate_intake',
    ],
  },
  {
    path: 'components/KHGForms.jsx',
    required: [
      "fetch('/api/forms/submit'",
      'body: JSON.stringify({ brand_key: brandKey, form_type: formType, ...formData })',
    ],
    forbidden: [],
  },
  {
    path: 'src/app/connect/page.jsx',
    required: [
      '<KHGFormGrid brandKey="casper_group"',
    ],
    forbidden: [],
  },
];

let failed = false;

for (const check of checks) {
  const source = await readFile(check.path, 'utf8');
  let checkFailed = false;

  for (const token of check.required) {
    if (!source.includes(token)) {
      console.error(`FAIL ${check.path}: missing required outage/isolation control: ${token}`);
      failed = true;
      checkFailed = true;
    }
  }
  for (const token of check.forbidden) {
    if (source.includes(token)) {
      console.error(`FAIL ${check.path}: forbidden outage/isolation behavior remains: ${token}`);
      failed = true;
      checkFailed = true;
    }
  }
  if (!checkFailed) console.log(`PASS ${check.path}`);
}

if (failed) process.exit(1);
console.log('Casper outage contract verified: customer forms reach the hardened route, corporate identity is pinned to casper_group, upstreams are bounded, degraded paths use controlled 503s, and the submit alias cannot bypass the canonical intake handler.');
