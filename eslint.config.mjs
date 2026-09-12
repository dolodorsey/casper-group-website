import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    files: ['components/KHGForms.jsx', 'src/components/KHGForms.jsx', 'src/app/connect/page.jsx'],
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: ['components/forms/KHGFormModal.jsx', 'src/components/forms/KHGFormModal.jsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
