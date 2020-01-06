import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Link from 'in-components/Link';

import locals from './SecondLevelNavigation.mless';

export function SecondLevelNavigation({ children, darkTheme = false, hasGroups = false }) {
  let content = (
    <div
      className={evaluateClassNames({
        [locals.tabList]: true,
        [locals.tabListLight]: darkTheme,
        [locals.tabListWithGroups]: hasGroups
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
  isActive,
  href$,
  href,
  onClick,
  isDisabled,
  label,
  addSeparator,
  addGroupSeparator
}) {
  return (
    <Link
      className={evaluateClassNames({
        [locals.link]: true,
        [locals.addSeparator]: addSeparator,
        [locals.addGroupSeparator]: addGroupSeparator
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
        {label}
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
