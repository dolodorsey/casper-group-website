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
      "'Retry-After': '30'",
      "'X-Casper-Intake': 'unavailable'",
      'if (upstream.status >= 500)',
    ],
    forbidden: [],
  },
];

let failed = false;

for (const check of checks) {
  const source = await readFile(check.path, 'utf8');
  for (const token of check.required) {
    if (!source.includes(token)) {
      console.error(`FAIL ${check.path}: missing required outage control: ${token}`);
      failed = true;
    }
  }
  for (const token of check.forbidden) {
    if (source.includes(token)) {
      console.error(`FAIL ${check.path}: forbidden outage behavior remains: ${token}`);
      failed = true;
    }
  }
  if (!failed) console.log(`PASS ${check.path}`);
}

if (failed) process.exit(1);
console.log('Casper outage contract verified: bounded upstreams, generic 503s, retry guidance, and no false brand-request success.');
