'use client';

import { useParams } from 'next/navigation';
import FormClient from './FormClient';

// Next.js 16 supplies page params asynchronously. Read the current route through
// the client hook before passing a plain object to the existing form renderer.
// The renderer, intake endpoint, styling and marketing-consent default are unchanged.
export default function FormPage() {
  const params = useParams();
  return <FormClient params={params} />;
}
