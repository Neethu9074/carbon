import React from 'react';

import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({ children, href, href$, label }) {
  return (
    <div className={locals.twoRowWrapper}>
      {label && <div className={locals.label}>{label}</div>}

      <Link href={href} href$={href$} className={locals.breadcrumb}>
        {children}
      </Link>
    </div>
  );
}
