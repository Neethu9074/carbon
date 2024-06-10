/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['completedOpsCount', 'failedOpsCount'],
    labels: [
      t('in-forge:plugins.tibcoASDataGrid.totalCompletedOpsCount'),
      t('in-forge:plugins.tibcoASDataGrid.totalFailedOpsCount')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['concurrentActiveQueries', 'concurrentGlobalQueries'],
    labels: [
      t('in-forge:plugins.tibcoASDataGrid.concurrentActiveQueries'),
      t('in-forge:plugins.tibcoASDataGrid.concurrentGlobalQueries')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['putOpsCount', 'getOpsCount', 'deleteOpsCount', 'updateOpsCount'],
    labels: [
      t('in-forge:plugins.tibcoASDataGrid.put'),
      t('in-forge:plugins.tibcoASDataGrid.get'),
      t('in-forge:plugins.tibcoASDataGrid.delete'),
      t('in-forge:plugins.tibcoASDataGrid.update')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['txnBeginCount', 'txnCommitCount', 'txnRollbackCount'],
    labels: [
      t('in-forge:plugins.tibcoASDataGrid.transactionBegin'),
      t('in-forge:plugins.tibcoASDataGrid.transactionCommit'),
      t('in-forge:plugins.tibcoASDataGrid.transactionRollback')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['numberOfRowsScanned', 'numberOfRowsDeleted'],
    labels: [
      t('in-forge:plugins.tibcoASDataGrid.numberOfRowsScanned'),
      t('in-forge:plugins.tibcoASDataGrid.numberOfRowsDeleted')
    ],
    min: 0,
    formatter: number.compact
  }
];
