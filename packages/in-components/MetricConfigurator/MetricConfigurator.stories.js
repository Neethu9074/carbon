/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import MetricConfigurator from 'in-components/MetricConfigurator/MetricConfigurator';

const options = [
  {
    metric: 'beaconCount',
    label: 'This is intentionally a very very long name',
    description: 'How many beacons matching a filter were recorded.',
    aggregations: ['SUM']
  },
  {
    metric: 'beaconDuration',
    label: 'Beacon duration',
    description: 'The recorded duration for a beacon.',
    aggregations: ['P99', 'MEAN', 'P25']
  },
  {
    metric: 'pageLoads',
    label: 'Page loads',
    description:
      'How often a full page load occurred. This typically requires retrieval of an HTML document from a server (unless cached) and then the full onLoad cycle.',
    aggregations: ['SUM']
  }
];

function generateOptions() {
  let result = [];
  for (let index = 0; index < 15000; index++) {
    result.push({
      metric: 'beaconDuration' + index,
      label: 'Beacon duration ' + index,
      description: 'The recorded duration for a beacon.',
      aggregations: ['P99', 'MEAN', 'P25', 'MIN', 'MAX', 'P90', 'SUM', 'P50', 'P95', 'P98', 'P75']
    });
  }
  return result;
}

const aLotOfOptions = generateOptions();

export default {
  component: MetricConfigurator
};

export const Default = {
  render: () => <MetricConfigurator options={options} values={[]} onChange={storybookAction('onChange')} />,
  name: 'default'
};

export const ExampleWith15KMetrics = {
  render: () => <MetricConfigurator options={aLotOfOptions} values={[]} onChange={storybookAction('onChange')} />,

  name: 'Example with 15k metrics'
};
