/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import metricDefinitions from 'in-forge/plugins/defaultEntity20/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default metricDefinitions
  .filter(definition => definition.metric !== 'instances')
  .concat([
    {
      metric: 'synthetic_count',
      label: t('in-forge:plugins.endpoint.syntheticCallsS'),
      category: [],
      min: 0,
      formatter: number
    },
    {
      metric: 'synthetic_error_rate',
      label: t('in-forge:plugins.endpoint.syntheticErrorRate'),
      category: [],
      min: 0,
      formatter: percentage
    }
  ]);
