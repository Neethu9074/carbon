import React from 'react';

import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator/HorizontalIndicator';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ tabs, result, HeaderComponent, location, props }) {
  return (
    <div className={locals.header}>
      <MaxWidthFullscreenContainer>
        <HeaderComponent result={result} />
        <ul className={locals.tabList}>
          {tabs.map(tab => <Tab key={tab.label} tab={tab} location={location} props={props} />)}
        </ul>
      </MaxWidthFullscreenContainer>
      <HorizontalIndicator progress={result.progress} />
    </div>
  );
}

function Tab({ tab, location, props }) {
  const isActive = location.pathname === tab.path;
  const Header = tab.header || DefaultHeader;
  return (
    <li
      key={tab.label}
      className={evaluateClassNames({
        [locals.tab]: true,
        [locals.selected]: isActive
      })}
    >
      <Link
        className={evaluateClassNames({
          [locals.link]: true,
          [locals.selectedLink]: isActive
        })}
        href$={getModifiedUrlStream(params => {
          params.pathname = tab.path;
        })}
      >
        <Header tab={tab} {...props} />
      </Link>
    </li>
  );
}

function DefaultHeader({ tab }) {
  return tab.label;
}
