import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';

import locals from './ViewSwitcher.mless';

// TODO: move to a proper file
const allEventsPath = '/events';
const incidentsPath = '/events/incidents';
const issuesPath = '/events/issues';
const changesPath = '/events/changes';

export default connectTo(
  {
    isIncidentsActive: isView(incidentsPath),
    isIssuesActive: isView(issuesPath),
    isChangesActive: isView(changesPath)
  },
  function InfrastructureViewSwitcher({ isIncidentsActive, isIssuesActive, isChangesActive }) {
    return (
      <div className={locals.wrapper}>
        <SecondLevelNavigation darkTheme>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = allEventsPath))}
            label="All"
            isActive={!isIncidentsActive && !isIssuesActive && !isChangesActive}
            darkTheme
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = incidentsPath))}
            label="Incidents"
            isActive={isIncidentsActive}
            darkTheme
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = issuesPath))}
            label="Issues"
            isActive={isIssuesActive}
            darkTheme
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = changesPath))}
            label="Changes"
            isActive={isChangesActive}
            darkTheme
          />
        </SecondLevelNavigation>
      </div>
    );
  }
);
