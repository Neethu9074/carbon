import React from 'react';

import Link from 'in-components/Link';

import './Breadcrumb.less';

const block = 'in-breadcrumb';

export default function Breadcrumb({ children, href, href$ }) {
  return (
    <Link href={href} href$={href$} className={block}>
      {children}
    </Link>
  );
}
