import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './SecondLevelNavigation.mless';

export function SecondLevelNavigation({ className, children, darkTheme = false, hasGroups = false }) {
  let content = (
    <div
      className={evaluateClassNames({
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
      className={evaluateClassNames({
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
      className={evaluateClassNames({
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
        className={evaluateClassNames({
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
        className={evaluateClassNames({
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
