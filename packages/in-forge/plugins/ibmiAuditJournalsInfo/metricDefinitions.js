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
        'auditJournalMetrics',
        'entryCount',
        t('in-forge:plugins.ibmiAuditJournalsInfo.dashboard.tables.auditJournals.entryType')
      )
    ],
    labels: [t('in-forge:plugins.ibmiAuditJournalsInfo.dashboard.tables.auditJournals.entryCount')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiAuditJournalsInfo.dashboard.tables.auditJournals.entryType')]
  }
];
