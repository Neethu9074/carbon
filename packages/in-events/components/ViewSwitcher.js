/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  agentMonitoringIssuesEnabled,
  cveIssueEnabled,
  playwithEnabled,
  prcIssueEnabled
} from 'in-services/featureFlags';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import * as eventTypeLabels from 'in-events/eventTypeLabels';
import { eventsPath } from 'in-events/navigation/paths';
import { eventId } from 'in-events/navigation/matrix';
import SearchBar from 'in-components/SearchBar';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher({ selectedEventType }) {
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);
  const { location, createHref } = useNavigation();

  const tabs = [];

  // Before the tabs are created, make sure to remove the eventId when clicking through the tabs.
  setOrDeleteMatrixKey(location, eventsPath, eventId, null);

  // All
  setOrDeleteMatrixKey(location, eventsPath, 'view', null);
  tabs.push({
    href: createHref(location),
    label: t('in-events:labelAll'),
    isActive: !selectedEventType
  });

  // Incidents
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'incident');
  tabs.push({
    href: createHref(location),
    label: eventTypeLabels.incident,
    isActive: selectedEventType === 'incident'
  });

  // Issues
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'issue');
  tabs.push({
    href: createHref(location),
    label: eventTypeLabels.issue,
    isActive: selectedEventType === 'issue'
  });

  // Change
  setOrDeleteMatrixKey(location, eventsPath, 'view', 'change');
  tabs.push({
    href: createHref(location),
    label: eventTypeLabels.change,
    isActive: selectedEventType === 'change'
  });

  if ((isInternalVisible || agentMonitoringIssuesEnabled) && !playwithEnabled) {
    // Monitoring issues
    setOrDeleteMatrixKey(location, eventsPath, 'view', 'agent_monitoring_issue');
    tabs.push({
      href: createHref(location),
      label: eventTypeLabels.agent_monitoring_issue,
      isActive: selectedEventType === 'agent_monitoring_issue'
    });
  }
  if (cveIssueEnabled && !playwithEnabled) {
    // Vunerabilities
    setOrDeleteMatrixKey(location, eventsPath, 'view', 'cve_issue');
    tabs.push({
      href: createHref(location),
      label: eventTypeLabels.cve_issue,
      isActive: selectedEventType === 'cve_issue'
    });
  }
  if (prcIssueEnabled && !playwithEnabled) {
    // PRC issues
    setOrDeleteMatrixKey(location, eventsPath, 'view', 'prc_issue');
    tabs.push({
      href: createHref(location),
      label: eventTypeLabels.prc_issue,
      isActive: selectedEventType === 'prc_issue'
    });
  }

  return (
    <div className={locals.wrapper}>
      <SecondLevelNavigation>
        {tabs.map(({ href, label, isActive }, i) => (
          <SecondLevelNavigationItem href={href} label={label} isActive={isActive} key={i} />
        ))}
      </SecondLevelNavigation>
      <SearchBar style={{ maxWidth: 'calc(100% - 30rem)', padding: '0.5rem 0' }} theme="light" />
    </div>
  );
}
