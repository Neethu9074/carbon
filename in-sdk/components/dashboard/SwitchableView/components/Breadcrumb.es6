import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { getPartialNavigationPath } from 'in-stores/navigation';
import Link from 'in-components/Link';

import './Breadcrumb.less';

const block = 'in-breadcrumb';
const iconElement = `${block}__icon`;

export default function Breadcrumb({ config, isActive, navigationParams }) {
  const { label, icon, path } = config;

  return (
    <Link
      href={getPartialNavigationPath(path, navigationParams)}
      className={evaluateClassNames({
        [block]: true,
        [`${block}__active`]: isActive
      })}
    >
      {icon ? <span className={iconElement}>{icon}</span> : null}   {label}
    </Link>
  );
}
