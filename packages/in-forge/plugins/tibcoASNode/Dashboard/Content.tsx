/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function TibcoASNodeDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tibcoASNode.liveDataSize')}>
          <MetricValue snapshotId={snapshotId} metric="liveDataSize" formatter={bytes.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoASNode.pendingGlobalRequests')}>
          <MetricValue snapshotId={snapshotId} metric="pendingGlobalRequests" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoASNode.diskWriteRate')}>
          <MetricValue snapshotId={snapshotId} metric="diskWriteRate" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoASNode.numberOfListeners')}>
          <MetricValue snapshotId={snapshotId} metric="numberOfListeners" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.tibcoASNode.completedOrFailedOperationsRate')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['completedOpsCount', 'failedOpsCount'],
              labels: [
                t('in-forge:plugins.tibcoASNode.completedOpsCount'),
                t('in-forge:plugins.tibcoASNode.failedOpsCount')
              ],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tibcoASNode.concurrentQueries')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['concurrentActiveQueries', 'concurrentGlobalQueries'],
              labels: [
                t('in-forge:plugins.tibcoASNode.concurrentActiveQueries'),
                t('in-forge:plugins.tibcoASNode.concurrentGlobalQueries')
              ],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.tibcoASNode.operationRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['putOpsCount', 'getOpsCount', 'deleteOpsCount', 'updateOpsCount'],
            labels: [
              t('in-forge:plugins.tibcoASNode.put'),
              t('in-forge:plugins.tibcoASNode.get'),
              t('in-forge:plugins.tibcoASNode.delete'),
              t('in-forge:plugins.tibcoASNode.update')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASNode.transactionRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['txnBeginCount', 'txnCommitCount', 'txnRollbackCount'],
            labels: [
              t('in-forge:plugins.tibcoASNode.txnBeginCount'),
              t('in-forge:plugins.tibcoASNode.txnCommitCount'),
              t('in-forge:plugins.tibcoASNode.txnRollbackCount')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASNode.sqlOperationsRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sqlInsertOpsCount', 'sqlDeleteOpsCount', 'sqlUpdateOpsCount'],
            labels: [
              t('in-forge:plugins.tibcoASNode.insert'),
              t('in-forge:plugins.tibcoASNode.delete'),
              t('in-forge:plugins.tibcoASNode.update')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASNode.expirationRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numberOfRowsScanned', 'numberOfRowsDeleted'],
            labels: [
              t('in-forge:plugins.tibcoASNode.numberOfRowsScanned'),
              t('in-forge:plugins.tibcoASNode.numberOfRowsDeleted')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASNode.drOperationRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['drPutOpsCount', 'drDeleteOpsCount'],
            labels: [t('in-forge:plugins.tibcoASNode.put'), t('in-forge:plugins.tibcoASNode.delete')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoASNode.reindexOrReclaimedRates')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['reindexedRowsCount', 'reclaimedKeysCount'],
            labels: [
              t('in-forge:plugins.tibcoASNode.reindexedRowsCount'),
              t('in-forge:plugins.tibcoASNode.reclaimedKeysCount')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
