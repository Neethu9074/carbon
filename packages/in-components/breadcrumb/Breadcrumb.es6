import React from 'react';

import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({ children, href, href$, label }) {
  return (
    <Link href={href} href$={href$} className={locals.breadcrumb}>
      {label && <span className={locals.label}>{label}</span>}
      {children}
    </Link>
  );
}
