/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { agentMonitoringIssuesEnabled, playwithEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import * as eventTypeLabels from 'in-events/eventTypeLabels';
import { eventsPath } from 'in-events/navigation/paths';
import SearchBar from 'in-components/SearchBar';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher({ selectedEventType }) {
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);
  const { location, createHref } = useNavigation();

  const tabs = [];

  setOrDeleteMatrixKey(location, eventsPath, 'view', null);
  tabs.push(
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={t('in-events:labelAll')}
      isActive={!selectedEventType}
      darkTheme
    />
  );
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'incident');
  tabs.push(
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={eventTypeLabels.incident}
      isActive={selectedEventType === 'incident'}
      darkTheme
    />
  );
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'issue');
  tabs.push(
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={eventTypeLabels.issue}
      isActive={selectedEventType === 'issue'}
      darkTheme
    />
  );
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'change');
  tabs.push(
    <SecondLevelNavigationItem
      href={createHref(location)}
      label={eventTypeLabels.change}
      isActive={selectedEventType === 'change'}
      darkTheme
    />
  );
  if ((isInternalVisible || agentMonitoringIssuesEnabled) && !playwithEnabled) {
    setOrDeleteMatrixKey(location, eventsPath, 'view', 'agent_monitoring_issue');
    tabs.push(
      <SecondLevelNavigationItem
        href={createHref(location)}
        label={eventTypeLabels.agent_monitoring_issue}
        isActive={selectedEventType === 'agent_monitoring_issue'}
        addSeparator
        darkTheme
      />
    );
  }

  return (
    <div className={locals.wrapper}>
      <SecondLevelNavigation>{tabs}</SecondLevelNavigation>
      <SearchBar style={{ maxWidth: 'calc(100% - 30rem)' }} theme="light" />
    </div>
  );
}
