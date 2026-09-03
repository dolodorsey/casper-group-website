'use client';

import { useState } from 'react';

type Props = {
  src?: string | null;
  fallback: string;
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export default function ResilientMenuImage({ src, fallback, alt = '', className, loading = 'lazy' }: Props) {
  const [current, setCurrent] = useState(src || fallback);
  const [failedFallback, setFailedFallback] = useState(false);

  if (failedFallback) {
    return <div className={`cmb-image-fallback${className ? ` ${className}` : ''}`} aria-hidden="true" />;
  }

  return (
    // Menu imagery can originate from live brand data, so a plain img allows graceful runtime fallback.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
        else setFailedFallback(true);
      }}
    />
  );
}
