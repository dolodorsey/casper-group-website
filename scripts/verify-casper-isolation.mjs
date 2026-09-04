import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const ROOTS = ['src/app/api', 'src/lib'];
const ALLOWED_SUPABASE_PROJECTS = new Set(['qhgmukwoennurwuvmbhy']);
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx']);
const SUPABASE_URL_PATTERN = /https:\/\/([a-z]{20})\.supabase\.co/g;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(path));
    } else if (SOURCE_EXTENSIONS.has(extname(entry.name))) {
      files.push(path);
    }
  }

  return files;
}

const violations = [];
const refs = new Set();

for (const root of ROOTS) {
  for (const file of await collectFiles(root)) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(SUPABASE_URL_PATTERN)) {
      const projectRef = match[1];
      refs.add(projectRef);
      if (!ALLOWED_SUPABASE_PROJECTS.has(projectRef)) {
        violations.push(`${relative('.', file)} -> ${projectRef}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Casper backend isolation violation(s):');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

if (!refs.has('qhgmukwoennurwuvmbhy')) {
  console.error('Casper backend isolation check could not find the canonical Casper Group project reference.');
  process.exit(1);
}

console.log(`Casper backend isolation verified. Allowed Supabase project refs: ${[...refs].join(', ')}`);
