/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['proxyPutOpsCount', 'proxyGetOpsCount', 'proxyRemoveOpsCount'],
    labels: [
      t('in-forge:plugins.tibcoASProxy.put'),
      t('in-forge:plugins.tibcoASProxy.get'),
      t('in-forge:plugins.tibcoASProxy.remove')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['proxyTxnBeginOpsCount', 'proxyTxnCommitOpsCount', 'proxyTxnRollbackOpsCount'],
    labels: [
      t('in-forge:plugins.tibcoASProxy.txnBegin'),
      t('in-forge:plugins.tibcoASProxy.txnCommit'),
      t('in-forge:plugins.tibcoASProxy.txnRollback')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['proxyActiveDeleteStmts', 'proxyActiveInsertStmts', 'proxyActiveUpdateStmts', 'proxyActiveSelectStmts'],
    labels: [
      t('in-forge:plugins.tibcoASProxy.delete'),
      t('in-forge:plugins.tibcoASProxy.insert'),
      t('in-forge:plugins.tibcoASProxy.update'),
      t('in-forge:plugins.tibcoASProxy.select')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['proxyDMLUpdateDeletesActive', 'proxyDMLUpdateInsertsActive', 'proxyDMLUpdateUpdatesActive'],
    labels: [
      t('in-forge:plugins.tibcoASProxy.delete'),
      t('in-forge:plugins.tibcoASProxy.insert'),
      t('in-forge:plugins.tibcoASProxy.update')
    ],
    min: 0,
    formatter: number.compact
  }
];
