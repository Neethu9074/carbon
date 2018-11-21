import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './SideNavigation.mless';

export function SideNavigation({ title, children }) {
  return (
    <div className={locals.nav}>
      <div className={locals.title}>{title}</div>
      <div className={locals.tabList}>{children}</div>
    </div>
  );
}

export function SideNavigationItem({ isActive, href$, href, onClick, icon, label }) {
  return (
    <Link className={locals.link} href$={href$} href={href} onClick={onClick}>
      <div
        className={evaluateClassNames({
          [locals.tab]: true,
          [locals.tabSelected]: isActive
        })}
      >
        <SvgIcon className={locals.icon} type={icon} width={24} height={24} />
        {label}
      </div>
    </Link>
  );
}
