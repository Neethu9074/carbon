/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import LockContentionsTable from './LockContentionsTable';
import CicsExceptionsTable from './CicsExceptionsTable';
import ImsConnectionsTable from './ImsConnectionsTable';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ZDb2Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.zDb2.lockConflictCount')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="DB2_System_States.lock_conflict_count"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.zDb2.currentThreadCount')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="DB2_System_States.current_thread_count"
            formatter={number.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.zDb2.lockConflictCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['DB2_System_States.lock_conflict_count'],
              labels: [t('in-forge:plugins.zDb2.lockConflictCount')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zDb2.systemStates')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['DB2_System_States.current_thread_count', 'DB2_System_States.transactions_per_second'],
              labels: [t('in-forge:plugins.zDb2.currentThreadCount'), t('in-forge:plugins.zDb2.transactionsPerSecond')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.zDb2.pageReads')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['DB2_System_States.pages_read_from_bps', 'DB2_System_States.pages_read_from_dasd'],
              labels: [t('in-forge:plugins.zDb2.pagesReadFromBps'), t('in-forge:plugins.zDb2.pagesReadFromDasd')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.zDb2.storage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['DB2_System_States.ecsa_used_by_db2', 'DB2_System_States.real_storage_used_by_db2'],
              labels: [t('in-forge:plugins.zDb2.ecsaUsedByDb2'), t('in-forge:plugins.zDb2.realStorageUsedByDb2')],
              formatter: bytes,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <CicsExceptionsTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <ImsConnectionsTable snapshotId={snapshotId} timeConfig={timeConfig} />
      <LockContentionsTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
