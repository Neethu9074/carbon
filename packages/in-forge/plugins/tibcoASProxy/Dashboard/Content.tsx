/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function TibcoASProxyDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.tibcoASProxy.operationRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['proxyPutOpsCount', 'proxyGetOpsCount', 'proxyRemoveOpsCount'],
            labels: [
              t('in-forge:plugins.tibcoASProxy.put'),
              t('in-forge:plugins.tibcoASProxy.get'),
              t('in-forge:plugins.tibcoASProxy.remove')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASProxy.transactionRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['proxyTxnBeginOpsCount', 'proxyTxnCommitOpsCount', 'proxyTxnRollbackOpsCount'],
            labels: [
              t('in-forge:plugins.tibcoASProxy.txnBegin'),
              t('in-forge:plugins.tibcoASProxy.txnCommit'),
              t('in-forge:plugins.tibcoASProxy.txnRollback')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASProxy.activeStmts')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'proxyActiveDeleteStmts',
              'proxyActiveInsertStmts',
              'proxyActiveUpdateStmts',
              'proxyActiveSelectStmts'
            ],
            labels: [
              t('in-forge:plugins.tibcoASProxy.delete'),
              t('in-forge:plugins.tibcoASProxy.insert'),
              t('in-forge:plugins.tibcoASProxy.update'),
              t('in-forge:plugins.tibcoASProxy.select')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASProxy.activeExecuteUpdateReqs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['proxyDMLUpdateDeletesActive', 'proxyDMLUpdateInsertsActive', 'proxyDMLUpdateUpdatesActive'],
            labels: [
              t('in-forge:plugins.tibcoASProxy.delete'),
              t('in-forge:plugins.tibcoASProxy.insert'),
              t('in-forge:plugins.tibcoASProxy.update')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
