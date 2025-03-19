/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { just, create } from '@instana/observables';
import { Button } from '@instana/components';

import AlertBaseList, {
  AlertConfigType,
  ColumnDefinition
} from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import TableSettings from 'in-alerting/smart-alerts/components/list/TableSettings';
import { success } from 'in-services/util/result';

export default { component: AlertBaseList };

export const Empty = {
  args: {
    extraColumnDefinitions: [],
    getAlertConfigs: () => just(success([])),
    getSubtitle: () => 'Test',
    noDataMessage: 'No Data'
  }
};

const entries = [
  {
    name: 'Entry - 1',
    severity: 1,
    description: 'Some Description'
  },
  {
    name: 'Entry - 2',
    severity: 2,
    description: 'Some Description 2'
  }
];

const extraColumn: ColumnDefinition<AlertConfigType> = {
  id: 'filters',
  label: 'Some Label',
  getContent: () => 'some content'
};

export const WithEntries = {
  args: {
    extraColumnDefinitions: [],
    getAlertConfigs: () => just(success(entries))
  }
};

export const WithSubtitle = {
  args: {
    extraColumnDefinitions: [],
    getAlertConfigs: () => just(success(entries)),
    getSubtitle: (config: AlertConfigType) => `Some Subtitle for ${config.name}`
  }
};
export const WithMultiColumn = {
  args: {
    extraColumnDefinitions: [extraColumn],
    getAlertConfigs: () => just(success(entries))
  }
};

export const WithError = {
  args: {
    extraColumnDefinitions: [],
    getAlertConfigs: () => create().emitError('This fails.').freeze()
  }
};

export const CarbonWithEntries = {
  args: {
    extraColumnDefinitions: [],
    getAlertConfigs: () => just(success(entries)),
    displayCarbonTable: true
  }
};

export const CarbonWithSubtitle = {
  args: {
    extraColumnDefinitions: [],
    getAlertConfigs: () => just(success(entries)),
    getNameSubtitle: (config: AlertConfigType) => `Some Subtitle for ${config.name}`,
    displayCarbonTable: true
  }
};

export const CarbonWithHeader = {
  args: {
    extraColumnDefinitions: [],
    getAlertConfigs: () => just(success(entries)),
    getNameSubtitle: (config: AlertConfigType) => `Some Subtitle for ${config.name}`,
    displayCarbonTable: true,
    isSelectable: true,
    toolBarContent: (
      <>
        <TableSettings handleSettings={() => {}} handleFilter={() => {}} />
        <Button kind="primary" size="xl">
          Create Smart alert
        </Button>
      </>
    )
  }
};

export const CarbonEmpty = {
  args: {
    extraColumnDefinitions: [],
    getAlertConfigs: () => just(success([])),
    getSubtitle: () => 'Test',
    noDataHeader: 'No Data',
    noDataDescription: 'No Data Description',
    displayCarbonTable: true
  }
};
