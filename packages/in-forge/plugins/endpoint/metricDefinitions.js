/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import metricDefinitions from 'in-forge/plugins/defaultEntity20/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';
export default metricDefinitions
  .filter(definition => definition.metric !== 'instances')
  .concat([
    {
      metric: 'synthetic_count',
      label: 'Synthetic calls/s',
      category: [],
      min: 0,
      formatter: number
    },
    {
      metric: 'synthetic_error_rate',
      label: 'Synthetic error rate',
      category: [],
      min: 0,
      formatter: percentage
    }
  ]);
