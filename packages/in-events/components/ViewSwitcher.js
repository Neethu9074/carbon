/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import * as eventTypeLabels from 'in-events/eventTypeLabels';
import { eventsPath } from 'in-events/navigation/paths';
import SearchBar from 'in-components/SearchBar';

import locals from './ViewSwitcher.mless';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function ViewSwitcher({ selectedEventType, isInternalVisible }) {
    return (
      <div className={locals.wrapper}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, 'view', null))}
            label="All"
            isActive={!selectedEventType}
            darkTheme
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, 'view', 'incident'))}
            label={eventTypeLabels.incident}
            isActive={selectedEventType === 'incident'}
            darkTheme
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, 'view', 'issue'))}
            label={eventTypeLabels.issue}
            isActive={selectedEventType === 'issue'}
            darkTheme
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, 'view', 'change'))}
            label={eventTypeLabels.change}
            isActive={selectedEventType === 'change'}
            darkTheme
          />
          {(isInternalVisible || agentMonitoringIssuesEnabled) && (
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(location =>
                setOrDeleteMatrixKey(location, eventsPath, 'view', 'agent_monitoring_issue')
              )}
              label={eventTypeLabels.agent_monitoring_issue}
              isActive={selectedEventType === 'agent_monitoring_issue'}
              addSeparator
              darkTheme
            />
          )}
        </SecondLevelNavigation>

        <SearchBar style={{ maxWidth: 'calc(100% - 30rem)' }} theme="light" />
      </div>
    );
  }
);
