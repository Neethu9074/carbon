import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './SecondLevelNavigation.mless';

export function SecondLevelNavigation({ children, darkTheme = false }) {
  let content = (
    <div
      className={evaluateClassNames({
        [locals.tabList]: true,
        [locals.tabListLight]: darkTheme
      })}
    >
      {children}
    </div>
  );
  return (
    <div
      className={evaluateClassNames({
        [locals.nav]: true,
        [locals.navLight]: darkTheme
      })}
    >
      {content}
    </div>
  );
}

export function SecondLevelNavigationItem({ isActive, href$, href, onClick, icon, label, addSeparator }) {
  return (
    <Link
      className={evaluateClassNames({
        [locals.link]: true,
        [locals.addSeparator]: addSeparator
      })}
      href$={href$}
      href={href}
      onClick={onClick}
    >
      <div
        className={evaluateClassNames({
          [locals.tab]: true,
          [locals.tabSelected]: isActive
        })}
      >
        {icon && <SvgIcon className={locals.icon} type={icon} />}
        {label}
      </div>
    </Link>
  );
}
