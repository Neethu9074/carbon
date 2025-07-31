/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import TransfersTable from 'in-forge/plugins/ibmMqMftCoordiQmgr/Dashboard/TransfersTable';
import MonitorsTable from 'in-forge/plugins/ibmMqMftCoordiQmgr/Dashboard/MonitorsTable';
import AgentsTable from 'in-forge/plugins/ibmMqMftCoordiQmgr/Dashboard/AgentsTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmMqMftCoordiQmgrDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.currentActiveTransfers')}>
          <MetricValue snapshotId={snapshotId} metric="currentTransfers" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.totalTransfers')}>
          <MetricValue snapshotId={snapshotId} metric="totalTransfers" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.transferStatistics')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: [`partiallySuccessfulTransfers`, `successfulTransfers`, `failedTransfers`, `cancelledTransfers`],
            labels: [
              t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.partiallySuccessfulTransfers'),
              t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.successfulTransfers'),
              t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.failedTransfers'),
              t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.cancelledTransfers')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <AgentsTable snapshot={snapshot} timeConfig={timeConfig} />
      <TransfersTable snapshot={snapshot} timeConfig={timeConfig} />
      <MonitorsTable snapshot={snapshot} />
    </div>
  );
}
