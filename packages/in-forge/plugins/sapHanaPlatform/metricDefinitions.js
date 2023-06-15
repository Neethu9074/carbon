/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.Availability.DATABASE_AVAILABILITY.HDB_DBA_CONNECT_STATUS.value',
      'metrics.Exceptions.Disabled_Metrics.HDB_DISABLED_METRICS.value'
    ],
    labels: [
      t('in-forge:plugins.sapHanaPlatform.dbAvailability'),
      t('in-forge:plugins.sapHanaPlatform.disabaledMetrics')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'metrics.Configuration.Trace_Settings',
        'value',
        t('in-forge:plugins.sapHanaPlatform.traceSettings')
      )
    ],
    labels: [t('in-forge:plugins.sapHanaPlatform.traceSettings')],
    min: 0,
    formatter: number.compact
  }
];
