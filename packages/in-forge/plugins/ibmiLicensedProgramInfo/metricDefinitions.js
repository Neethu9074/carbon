/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch(
        'licenseInformationMetrics',
        'daysToExpire',
        t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.daysToExpire')
      )
    ],
    labels: [t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.daysToExpire')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.licenseInfo.daysToExpire')]
  }
];
