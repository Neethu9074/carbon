import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './SecondLevelNavigation.mless';

export function SecondLevelNavigation({ children, useFullAvailableWidth = false, darkTheme = false }) {
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
  if (!useFullAvailableWidth) {
    content = <MaxWidthFullscreenContainer>{content}</MaxWidthFullscreenContainer>;
  } else {
    content = <div className={locals.fullWithWraper}>{content}</div>;
  }
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
        {icon && <SvgIcon className={locals.icon} type={icon} width={24} height={24} />}
        {label}
      </div>
    </Link>
  );
}
