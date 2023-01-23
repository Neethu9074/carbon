/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useLocation } from 'react-router';
import React from 'react';

import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
// eslint-disable-next-line
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import AlertBaseList from 'in-alerting/smart-alerts/AlertsBaseList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { SyntheticAlertConfigWithMetadata } from 'in-types';

export default function AlertsWithUrlBasedInfo() {
  // LATER: replace with injection from outside, via appropriate route props
  const location = useLocation();

  // FIXME: replace with mechanism, like used in websites-dashboard for the id
  const testId: string = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';

  return <Alerts testId={testId} />;
}

interface AlertsProps {
  testId?: string;
}

function Alerts({ testId }: AlertsProps) {
  return (
    <AlertBaseList<SyntheticAlertConfigWithMetadata>
      extraColumnDefinitions={getColumnDefinitions()}
      loadEntities={() => getAllAlertConfigs(testId)}
    />
  );
}

function getColumnDefinitions() {
  const additionalColumn = [
    {
      id: 'testApplied',
      label: 'Tests applied',
      getContent: (item: SyntheticAlertConfigWithMetadata) => <span>{item.name}</span>
    },
    {
      id: 'locations',
      label: 'Locations',
      getContent: (item: SyntheticAlertConfigWithMetadata) => {
        return <span>{item.rule.alertType}</span>;
      }
    },
    {
      id: 'timeThreshold',
      label: 'Time Threshold',
      getContent: (item: SyntheticAlertConfigWithMetadata) => {
        return <span>{item.rule.alertType}</span>;
      }
    },
    {
      id: 'filterApplied',
      label: 'Filter applied',
      getContent: (item: SyntheticAlertConfigWithMetadata) => {
        return <span>{item.rule.alertType}</span>;
      }
    },
    {
      id: 'actions',
      label: 'Actions',
      getContent: (item: SyntheticAlertConfigWithMetadata) => {
        return <span>{item.rule.alertType}</span>;
      }
    }
  ];

  return additionalColumn;
}
