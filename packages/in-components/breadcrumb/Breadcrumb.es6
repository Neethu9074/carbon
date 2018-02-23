import React from 'react';

import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({ children, href, href$, label }) {
  const link = (
    <Link href={href} href$={href$} className={locals.breadcrumb}>
      {children}
    </Link>
  );

  if (label) {
    return (
      <div className={locals.twoRowWrapper}>
        <div className={locals.label}>{label}</div>
        {link}
      </div>
    );
  }

  return link;
}
