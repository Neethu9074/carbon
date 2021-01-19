/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/defaultEntity20/metricDefinitions';
import { ms, number, percentage } from 'in-services/formatters/number';

export default metricDefinitions
  .filter(definition => definition.metric !== 'instances')
  .concat([
    {
      metric: 'inbound_count',
      label: 'Inbound Calls/s',
      category: ['Inbound Calls'],
      min: 0,
      formatter: number
    },
    {
      metric: 'inbound_error_count',
      label: 'Inbound Erroneous Calls/s',
      category: ['Inbound Calls'],
      min: 0,
      formatter: number
    },
    {
      metrics: ['inbound_duration.mean', 'inbound_duration.min', 'inbound_duration.max'],
      labels: ['Inbound Calls Avg. Latency', 'Inbound Calls Min Latency', 'Inbound Calls Max Latency'],
      category: ['Inbound Calls Latency'],
      min: 0,
      formatter: ms
    },
    {
      metrics: [
        'inbound_duration.25th',
        'inbound_duration.50th',
        'inbound_duration.75th',
        'inbound_duration.95th',
        'inbound_duration.98th',
        'inbound_duration.99th'
      ],
      labels: [
        'Inbound Calls Latency 25th',
        'Inbound Calls Latency 50th',
        'Inbound Calls Latency 75th',
        'Inbound Calls Latency 95th',
        'Inbound Calls Latency 98th',
        'Inbound Calls Latency 99th'
      ],
      category: ['Inbound Calls Latency'],
      min: 0,
      formatter: ms,
      isPercentile: true
    },
    {
      metric: 'inbound_error_rate',
      label: 'Inbound Erroneous Call Rate',
      category: ['Inbound Calls'],
      min: 0,
      formatter: percentage
    }
  ]);
