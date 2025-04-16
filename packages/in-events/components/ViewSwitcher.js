/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isNull } from 'lodash';
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

const generateEventTypes = isInternalVisible => [
  {
    id: 'all',
    label: t('in-events:labelAll')
  },
  {
    id: 'incident',
    label: eventTypeLabels.incident
  },
  {
    id: 'issue',
    label: eventTypeLabels.issue
  },
  {
    id: 'change',
    label: eventTypeLabels.change
  },
  ...((isInternalVisible || agentMonitoringIssuesEnabled) && !playwithEnabled
    ? [
        {
          id: 'agent_monitoring_issue',
          label: eventTypeLabels.agent_monitoring_issue
        }
      ]
    : []),
  ...(cveIssueEnabled && !playwithEnabled
    ? [
        {
          id: 'cve_issue',
          label: eventTypeLabels.cve_issue
        }
      ]
    : []),
  ...(prcIssueEnabled && !playwithEnabled
    ? [
        {
          id: 'prc_issue',
          label: eventTypeLabels.prc_issue
        }
      ]
    : [])
];

export default function ViewSwitcher({ selectedEventType = null, onChange }) {
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);
  const { location, navigate } = useNavigation();

  const tabs = generateEventTypes(isInternalVisible);

  return (
    <div className={locals.wrapper}>
      <SecondLevelNavigation>
        {tabs.map(({ label, id }) => (
          <SecondLevelNavigationItem
            label={label}
            isActive={id === 'all' ? isNull(selectedEventType) : selectedEventType === id}
            href="#"
            onClick={e => {
              e.preventDefault();
              // to remove filters when changing from one tab to another
              onChange({
                filter: ''
              });
              setOrDeleteMatrixKey(location, eventsPath, eventId, null);
              if (id === 'all') {
                setOrDeleteMatrixKey(location, eventsPath, 'view', null);
              } else {
                setOrDeleteMatrixKey(location, eventsPath, 'view', id);
              }
              navigate(location);
              return;
            }}
            key={id}
          />
        ))}
      </SecondLevelNavigation>
      <SearchBar style={{ maxWidth: 'calc(100% - 30rem)', padding: '0.5rem 0' }} theme="light" />
    </div>
  );
}
