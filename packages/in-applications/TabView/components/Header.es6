import React from 'react';

import ProgressLine from 'in-applications/TabView/components/ProgressLine';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { isView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ tabs, result, baseDashboardUrl }) {
  return (
    <div className={locals.header}>
      <div style={{ height: 59 }} />
      <ul className={locals.tabList}>
        {tabs.map(tab => <Tab key={tab.label} baseDashboardUrl={baseDashboardUrl} tab={tab} />)}
      </ul>
      <ProgressLine result={result} />
    </div>
  );
}

const Tab = connectTo(
  props => ({
    isActive: isView(`${props.baseDashboardUrl}${props.tab.path}`)
  }),
  function Tab({ baseDashboardUrl, tab, isActive }) {
    return (
      <li
        key={tab.label}
        className={evaluateClassNames({
          [locals.tab]: true,
          [locals.selected]: isActive
        })}
      >
        <Link
          className={locals.link}
          href$={getModifiedUrlStream(params => {
            params.pathname = `${baseDashboardUrl}${tab.path}`;
          })}
        >
          {tab.label}
        </Link>
      </li>
    );
  }
);
