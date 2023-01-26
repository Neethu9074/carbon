/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAllAlertConfigs
} from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import AlertBaseList, { TableActions } from 'in-alerting/smart-alerts/components/AlertsBaseList';
import { SyntheticAlertConfigWithMetadata } from 'in-types';

interface AlertsProps {
  testId?: string;
}

export const tableActions: TableActions<SyntheticAlertConfigWithMetadata> = {
  delete: {
    deleteEntity: (config: SyntheticAlertConfigWithMetadata) => deleteAlertConfig(config.id)
  },
  toggleEnabled: {
    get: (config: SyntheticAlertConfigWithMetadata) => config.enabled,
    toggle: (config: SyntheticAlertConfigWithMetadata) =>
      config.enabled ? disableAlertConfig(config.id) : enableAlertConfig(config.id)
  }
};

export default function Alerts({ testId }: AlertsProps) {
  return (
    <AlertBaseList<SyntheticAlertConfigWithMetadata>
      extraColumnDefinitions={getColumnDefinitions()}
      loadEntities={() => getAllAlertConfigs(testId)}
      tableActions={tableActions}
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
    }
  ];

  return additionalColumn;
}
