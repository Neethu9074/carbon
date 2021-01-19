/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './SideNavigation.mless';

export { default as SideNavigationWrapper } from 'in-new-components/SideNavigation/SideNavigationWrapper';

export function SideNavigation({ title, children }) {
  return (
    <div className={locals.nav}>
      <SideNavigationSection title={title} />
      <div className={locals.tabList}>{children}</div>
    </div>
  );
}

export function SideNavigationItem({ isActive, href$, href, onClick, icon, omitEmptyIcon = false, label }) {
  return (
    <Link className={locals.link} href$={href$} href={href} onClick={onClick}>
      <div
        className={classNames({
          [locals.tab]: true,
          [locals.tabSelected]: isActive
        })}
      >
        {(icon || !omitEmptyIcon) && <SvgIcon className={locals.icon} type={icon} />}
        {label}
      </div>
    </Link>
  );
}

export function SideNavigationSection({ title }) {
  if (!title) {
    return null;
  }
  return <div className={locals.title}>{title}</div>;
}
