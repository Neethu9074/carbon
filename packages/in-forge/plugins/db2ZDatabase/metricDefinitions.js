/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'DB2ZLocationStats.threadCount',
      'DB2ZLocationStats.availableMemory',
      'DB2ZLocationStats.cpuUsageDist',
      'DB2ZLocationStats.cpuUsageMstr',
      'DB2ZLocationStats.cpuUsageDbt',
      'DB2ZLocationStats.cpuUsageIrlm',
      'DB2ZLocationStats.commits',
      'DB2ZLocationStats.selectCount',
      'DB2ZLocationStats.insertCount',
      'DB2ZLocationStats.selectCount',
      'DB2ZLocationStats.updateCount',
      'DB2ZLocationStats.deleteCount',
      'DB2ZLocationStats.logWrite',
      'DB2ZLocationStats.lockSuspension'
    ],
    labels: [
      t('in-forge:plugins.db2ZDatabase.dashboard.activeThreads'),
      t('in-forge:plugins.db2ZDatabase.dashboard.availableMemory'),
      t('in-forge:plugins.db2ZDatabase.cpuUsageDist'),
      t('in-forge:plugins.db2ZDatabase.cpuUsageMstr'),
      t('in-forge:plugins.db2ZDatabase.cpuUsageDbt'),
      t('in-forge:plugins.db2ZDatabase.cpuUsageIrlm'),
      t('in-forge:plugins.db2ZDatabase.commits'),
      t('in-forge:plugins.db2ZDatabase.selectCount'),
      t('in-forge:plugins.db2ZDatabase.insertCount'),
      t('in-forge:plugins.db2ZDatabase.updateCount'),
      t('in-forge:plugins.db2ZDatabase.deleteCount'),
      t('in-forge:plugins.db2ZDatabase.dashboard.logWrites'),
      t('in-forge:plugins.db2ZDatabase.dashboard.lockSuspensions')
    ],
    min: 0,
    formatter: number
  }
];
