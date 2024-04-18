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
    labels: [t('in-forge:plugins.tibcoASNode.completedOpsCount'), t('in-forge:plugins.tibcoASNode.failedOpsCount')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['concurrentActiveQueries', 'concurrentGlobalQueries'],
    labels: [
      t('in-forge:plugins.tibcoASNode.concurrentActiveQueries'),
      t('in-forge:plugins.tibcoASNode.concurrentGlobalQueries')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['putOpsCount', 'getOpsCount', 'deleteOpsCount', 'updateOpsCount'],
    labels: [
      t('in-forge:plugins.tibcoASNode.put'),
      t('in-forge:plugins.tibcoASNode.get'),
      t('in-forge:plugins.tibcoASNode.delete'),
      t('in-forge:plugins.tibcoASNode.update')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['txnBeginCount', 'txnCommitCount', 'txnRollbackCount'],
    labels: [
      t('in-forge:plugins.tibcoASNode.transactionBegin'),
      t('in-forge:plugins.tibcoASNode.transactionCommit'),
      t('in-forge:plugins.tibcoASNode.transactionRollback')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['sqlInsertOpsCount', 'sqlDeleteOpsCount', 'sqlUpdateOpsCount'],
    labels: [
      t('in-forge:plugins.tibcoASNode.sqlInsertOpsCount'),
      t('in-forge:plugins.tibcoASNode.sqlDeleteOpsCount'),
      t('in-forge:plugins.tibcoASNode.sqlUpdateOpsCount')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['numberOfRowsScanned', 'numberOfRowsDeleted'],
    labels: [
      t('in-forge:plugins.tibcoASNode.numberOfRowsScanned'),
      t('in-forge:plugins.tibcoASNode.numberOfRowsDeleted')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['drPutOpsCount', 'drDeleteOpsCount'],
    labels: [t('in-forge:plugins.tibcoASNode.drPutOpsCount'), t('in-forge:plugins.tibcoASNode.drDeleteOpsCount')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['reindexedRowsCount', 'reclaimedKeysCount'],
    labels: [
      t('in-forge:plugins.tibcoASNode.reindexedRowsCount'),
      t('in-forge:plugins.tibcoASNode.reclaimedKeysCount')
    ],
    min: 0,
    formatter: number.compact
  }
];
