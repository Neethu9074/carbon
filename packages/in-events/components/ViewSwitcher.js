/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import * as eventTypeLabels from 'in-events/eventTypeLabels';
import { eventsPath } from 'in-events/navigation/paths';
import SearchBar from 'in-components/SearchBar';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher({ selectedEventType }) {
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);

  return (
    <div className={locals.wrapper}>
      <SecondLevelNavigation>
        <AllEventsNavigationItem selectedEventType={selectedEventType} />
        <IncidentEventsNavigationItem selectedEventType={selectedEventType} />
        <IssueEventsNavigationItem selectedEventType={selectedEventType} />
        <ChangeEventsNavigationItem selectedEventType={selectedEventType} />
        {(isInternalVisible || agentMonitoringIssuesEnabled) && (
          <AgentMonitoringIssueEventsNavigationItem selectedEventType={selectedEventType} />
        )}
      </SecondLevelNavigation>

      <SearchBar style={{ maxWidth: 'calc(100% - 30rem)' }} theme="light" />
    </div>
  );
}
//comment
function AllEventsNavigationItem({ selectedEventType }) {
  const { location, createHref } = useNavigation();
  setOrDeleteMatrixKey(location, eventsPath, 'view', null);

  return (
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={t('in-events:labelAll')}
      isActive={!selectedEventType}
      darkTheme
    />
  );
}

function IncidentEventsNavigationItem({ selectedEventType }) {
  const { location, createHref } = useNavigation();
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'incident');

  return (
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={eventTypeLabels.incident}
      isActive={selectedEventType === 'incident'}
      darkTheme
    />
  );
}

function IssueEventsNavigationItem({ selectedEventType }) {
  const { location, createHref } = useNavigation();
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'issue');

  return (
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={eventTypeLabels.issue}
      isActive={selectedEventType === 'issue'}
      darkTheme
    />
  );
}

function ChangeEventsNavigationItem({ selectedEventType }) {
  const { location, createHref } = useNavigation();
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'change');

  return (
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={eventTypeLabels.change}
      isActive={selectedEventType === 'change'}
      darkTheme
    />
  );
}

function AgentMonitoringIssueEventsNavigationItem({ selectedEventType }) {
  const { location, createHref } = useNavigation();
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'agent_monitoring_issue');

  return (
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={eventTypeLabels.agent_monitoring_issue}
      isActive={selectedEventType === 'agent_monitoring_issue'}
      addSeparator
      darkTheme
    />
  );
}
