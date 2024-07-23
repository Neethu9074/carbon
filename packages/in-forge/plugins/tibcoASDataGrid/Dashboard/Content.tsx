/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import DataGridMembersTable from 'in-forge/plugins/tibcoASDataGrid/Dashboard/DataGridMembersTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function TibcoASDataGridDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId: string = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tibcoASDataGrid.nodes')}>
          <MetricValue snapshotId={snapshotId} metric="nodeCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoASDataGrid.proxies')}>
          <MetricValue snapshotId={snapshotId} metric="proxyCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoASDataGrid.numberOfListeners')}>
          <MetricValue snapshotId={snapshotId} metric="numberOfListeners" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.tibcoASDataGrid.totalCompletedOrFailedOperationsRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['completedOpsCount', 'failedOpsCount'],
              labels: [
                t('in-forge:plugins.tibcoASDataGrid.totalCompletedOpsCount'),
                t('in-forge:plugins.tibcoASDataGrid.totalFailedOpsCount')
              ],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tibcoASDataGrid.concurrentQueries')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['concurrentActiveQueries', 'concurrentGlobalQueries'],
              labels: [
                t('in-forge:plugins.tibcoASDataGrid.concurrentActiveQueries'),
                t('in-forge:plugins.tibcoASDataGrid.concurrentGlobalQueries')
              ],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.tibcoASDataGrid.totalOperationRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['putOpsCount', 'getOpsCount', 'deleteOpsCount', 'updateOpsCount'],
            labels: [
              t('in-forge:plugins.tibcoASDataGrid.put'),
              t('in-forge:plugins.tibcoASDataGrid.get'),
              t('in-forge:plugins.tibcoASDataGrid.delete'),
              t('in-forge:plugins.tibcoASDataGrid.update')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASDataGrid.totalTransactionRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['txnBeginCount', 'txnCommitCount', 'txnRollbackCount'],
            labels: [
              t('in-forge:plugins.tibcoASDataGrid.txnBeginCount'),
              t('in-forge:plugins.tibcoASDataGrid.txnCommitCount'),
              t('in-forge:plugins.tibcoASDataGrid.txnRollbackCount')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASDataGrid.expirationRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numberOfRowsScanned', 'numberOfRowsDeleted'],
            labels: [
              t('in-forge:plugins.tibcoASDataGrid.numberOfRowsScanned'),
              t('in-forge:plugins.tibcoASDataGrid.numberOfRowsDeleted')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASDataGrid.activeStmts')}>
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
              t('in-forge:plugins.tibcoASDataGrid.delete'),
              t('in-forge:plugins.tibcoASDataGrid.insert'),
              t('in-forge:plugins.tibcoASDataGrid.update'),
              t('in-forge:plugins.tibcoASDataGrid.select')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASDataGrid.activeExecuteUpdateReqs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['proxyDMLUpdateDeletesActive', 'proxyDMLUpdateInsertsActive', 'proxyDMLUpdateUpdatesActive'],
            labels: [
              t('in-forge:plugins.tibcoASDataGrid.delete'),
              t('in-forge:plugins.tibcoASDataGrid.insert'),
              t('in-forge:plugins.tibcoASDataGrid.update')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DataGridMembersTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
