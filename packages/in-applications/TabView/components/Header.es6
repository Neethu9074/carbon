import React from 'react';

import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator/HorizontalIndicator';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { isView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ tabs, result, dashboardBasedUrl, HeaderComponent }) {
  return (
    <div className={locals.header}>
      <HeaderComponent result={result} />
      <ul className={locals.tabList}>
        {tabs.map(tab => <Tab key={tab.label} dashboardBasedUrl={dashboardBasedUrl} tab={tab} />)}
      </ul>
      <HorizontalIndicator progress={result.progress} />
    </div>
  );
}

const Tab = connectTo(
  props => ({
    isActive: isView(`${props.dashboardBasedUrl}${props.tab.path}`)
  }),
  function Tab({ dashboardBasedUrl, tab, isActive }) {
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
            params.pathname = `${dashboardBasedUrl}${tab.path}`;
          })}
        >
          {tab.label}
        </Link>
      </li>
    );
  }
);
