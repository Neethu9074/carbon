/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.db2ZDatabase.dashboard.availableMemory'),
    metric: 'DB2ZLocationStats.availableMemory',
    formatter: bytes.compact
  },
  {
    label: t('in-forge:plugins.db2ZDatabase.dashboard.activeThreads'),
    metric: 'DB2ZLocationStats.threadCount',
    formatter: number.compact
  }
];
