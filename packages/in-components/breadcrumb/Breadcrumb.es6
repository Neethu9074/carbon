import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import Link from 'in-components/Link';

import locals from './Breadcrumb.mless';

export default function Breadcrumb({ className, children, href, href$, label, refSetter }) {
  return (
    <div className={joinClassNames(locals.twoRowWrapper, className)} ref={refSetter}>
      {label && <div className={locals.label}>{label}</div>}

      <Link href={href} href$={href$} className={locals.breadcrumb}>
        {children}
      </Link>
    </div>
  );
}
