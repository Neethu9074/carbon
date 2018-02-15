import React from 'react';

import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator/HorizontalIndicator';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ tabs, result, HeaderComponent, location }) {
  return (
    <div className={locals.header}>
      <HeaderComponent result={result} />
      <ul className={locals.tabList}>{tabs.map(tab => <Tab key={tab.label} tab={tab} location={location} />)}</ul>
      <HorizontalIndicator progress={result.progress} />
    </div>
  );
}

function Tab({ tab, location }) {
  const isActive = location.pathname === tab.path;
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
        {tab.label}
      </Link>
    </li>
  );
}
