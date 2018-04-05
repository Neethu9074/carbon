import React, { Fragment } from 'react';
import { withState } from 'recompose';

import tabs from 'in-analyze/TraceDetail/components/CallDetails/tabs/index';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './TabView.mless';

export default withState('selectedTab', 'setSelectedTab', tabs[0])(TabView);

function TabView({ selectedTab, setSelectedTab, call, traceId }) {
  return (
    <Fragment>
      <ul className={locals.tabView}>
        {tabs.map(tab => <Tab key={tab.label} tab={tab} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />)}
        <li className={locals.emptyEnddingTab} />
      </ul>
      <div className={locals.content}>{selectedTab && <selectedTab.component call={call} traceId={traceId} />}</div>
    </Fragment>
  );
}

function Tab({ tab, selectedTab, setSelectedTab }) {
  return (
    <li
      className={evaluateClassNames({
        [locals.tab]: true,
        [locals.selectedTab]: selectedTab === tab
      })}
      onClick={() => setSelectedTab(tab)}
    >
      {tab.label}
    </li>
  );
}
