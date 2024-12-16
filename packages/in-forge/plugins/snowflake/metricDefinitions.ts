/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//@ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch(
        'credit.warehouse_usage',
        'compute',
        t('in-forge:plugins.snowflake.dashboard.warehouseName')
      ),
      getDynamicMetricMatch(
        'credit.warehouse_usage',
        'cloud_services',
        t('in-forge:plugins.snowflake.dashboard.warehouseName')
      ),
      getDynamicMetricMatch('credit.warehouse_usage', 'total', t('in-forge:plugins.snowflake.dashboard.warehouseName'))
    ],
    labels: [
      t('in-forge:plugins.snowflake.dashboard.compute'),
      t('in-forge:plugins.snowflake.dashboard.cloudServices'),
      t('in-forge:plugins.snowflake.dashboard.total')
    ],
    min: 0,
    formatter: number.compact
  }
];
