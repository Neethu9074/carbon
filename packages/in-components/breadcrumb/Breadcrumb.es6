import React from 'react';

import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({ children, href, href$, label, refSetter }) {
  return (
    <div className={locals.twoRowWrapper} ref={refSetter}>
      {label && <div className={locals.label}>{label}</div>}

      <Link href={href} href$={href$} className={locals.breadcrumb}>
        {children}
      </Link>
    </div>
  );
}
