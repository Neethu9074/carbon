import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Link from 'in-components/Link';

import locals from './ViewSwitcher.mless';

export function ViewSwitcher({ children }) {
  return <ul className={locals.switcher}>{children}</ul>;
}

export function Item({ href, href$, children, active }) {
  return (
    <li className={locals.item}>
      <Link
        href={href}
        href$={href$}
        className={evaluateClassNames({
          [locals.link]: true,
          [locals.active]: active
        })}
      >
        {children}
      </Link>
    </li>
  );
}
