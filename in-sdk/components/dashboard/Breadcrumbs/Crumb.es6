import React from 'react';

import { getPartialNavigationPath } from 'in-stores/navigation';
import Link from 'in-components/Link';

import './Crumb.less';

const block = 'in-breadcrumb';
const iconElement = `${block}__icon`;

export default function Crumb({ label, icon, path }) {
  return (
    <Link href={getPartialNavigationPath(path)} className={block}>
      {icon ? <span className={iconElement}>{icon}</span> : null}   {label}
    </Link>
  );
}
