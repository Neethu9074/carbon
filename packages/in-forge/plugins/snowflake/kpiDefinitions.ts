/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.snowflake.dashboard.creditUsagePerHour'),
    metric: 'credit.hourly_usage',
    formatter: number.detailed
  },
  {
    label: t('in-forge:plugins.snowflake.dashboard.totalStorageBytes'),
    metric: 'storage.storage_bytes',
    formatter: bytes.compact
  }
];
