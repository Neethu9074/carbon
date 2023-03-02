/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { just, create } from '@instana/observables';

import AlertBaseList, { AlertConfigType, ColumnDefinition } from 'in-alerting/smart-alerts/components/AlertsBaseList';

export default { component: AlertBaseList };

export const Empty = {
  args: {
    extraColumnDefinitions: [],
    loadEntities: () => just([]),
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
    loadEntities: () => just(entries)
  }
};

export const WithSubtitle = {
  args: {
    extraColumnDefinitions: [],
    loadEntities: () => just(entries),
    getSubtitle: (config: AlertConfigType) => 'Some Subtile for ' + config.name
  }
};
export const WithMultiColumn = {
  args: {
    extraColumnDefinitions: [extraColumn],
    loadEntities: () => just(entries)
  }
};

export const WithError = {
  args: {
    extraColumnDefinitions: [],
    loadEntities: () =>
      create()
        .emitError('This fails.')
        .freeze()
  }
};
