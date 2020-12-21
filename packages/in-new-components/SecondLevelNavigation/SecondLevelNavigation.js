import React from 'react';

import classNames from 'classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './SecondLevelNavigation.mless';

export function SecondLevelNavigation({ className, children, darkTheme = false, hasGroups = false }) {
  let content = (
    <div
      className={classNames({
        [locals.tabList]: true,
        [locals.tabListLight]: darkTheme,
        [locals.tabListWithGroups]: hasGroups,
        [className]: className
      })}
    >
      {children}
    </div>
  );
  return (
    <div
      className={classNames({
        [locals.nav]: true,
        [locals.navLight]: darkTheme
      })}
    >
      {content}
    </div>
  );
}

export function SecondLevelNavigationItem({
  className,
  isActive,
  href$,
  href,
  onClick,
  isDisabled,
  label,
  icon,
  addSeparator,
  addGroupSeparator
}) {
  return (
    <Link
      className={classNames({
        [locals.link]: true,
        [locals.addSeparator]: addSeparator,
        [locals.addGroupSeparator]: addGroupSeparator,
        [className]: className
      })}
      href$={href$}
      href={href}
      onClick={onClick}
    >
      <div
        className={classNames({
          [locals.tab]: true,
          [locals.tabSelected]: isActive,
          [locals.tabDisabled]: isDisabled
        })}
      >
        <div className={locals.content}>
          {icon && <SvgIcon className={locals.icon} type={icon} />}
          {label}
        </div>
      </div>
    </Link>
  );
}

export function SecondLevelNavigationGroup({ label, children, withSeparator, isActive }) {
  if (!children) {
    return null;
  }

  return (
    <div className={locals.group}>
      <div
        className={classNames({
          [locals.groupLabel]: true,
          [locals.groupSelected]: isActive,
          [locals.groupLabelExtraMargin]: withSeparator
        })}
      >
        {label}
      </div>
      <div className={locals.groupTabsWrapper}>{children}</div>
    </div>
  );
}
