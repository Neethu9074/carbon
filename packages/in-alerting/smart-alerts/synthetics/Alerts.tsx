/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { getAllAlertConfigs } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import AlertBaseList from 'in-alerting/smart-alerts/AlertsBaseList';
import { SyntheticAlertConfigWithMetadata } from 'in-types';

interface AlertsProps {
  testId?: string;
}

export default function Alerts({ testId }: AlertsProps) {
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
