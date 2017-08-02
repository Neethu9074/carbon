import React from 'react';

import { getFullNavigationPath } from 'in-stores/navigation';
import Link from 'in-components/Link';

import './Breadcrumb.less';

const block = 'in-breadcrumb';
const iconElement = `${block}__icon`;

export default function Breadcrumb({ context, navigationParams }) {
  const { label, icon, path } = context;

  return (
    <Link href={getFullNavigationPath(path, navigationParams)} className={block}>
      {icon ? <span className={iconElement}>{icon}</span> : null}   {label}
    </Link>
  );
}
