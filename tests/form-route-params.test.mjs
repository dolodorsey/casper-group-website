import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../src/app/forms/[type]/page.jsx', import.meta.url), 'utf8');
const client = readFileSync(new URL('../src/app/forms/[type]/FormClient.jsx', import.meta.url), 'utf8');

test('form route passes resolved client route parameters to the renderer', () => {
  assert.match(page, /import\s*\{\s*useParams\s*\}\s*from\s*['"]next\/navigation['"]/);
  assert.match(page, /const params = useParams\(\)/);
  assert.match(page, /<FormClient params=\{params\}\s*\/>/);
  assert.doesNotMatch(page, /function FormPage\(\{params\}\)/);
});

test('Casper intake identity and non-marketing default remain intact', () => {
  assert.match(client, /const BRAND_KEY = 'casper_group'/);
  assert.match(client, /const INTAKE_ENDPOINT = '\/api\/forms'/);
  assert.match(client, /consent:\{marketing:false\}/);
  assert.match(client, /consultation:\{title:'Consultation'/);
  assert.match(client, /inquiry:\{title:'General Inquiry'/);
});
