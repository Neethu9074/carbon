/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import QueuesTableSorted from 'in-forge/plugins/tuxedoMachine/Dashboard/QueuesTableSorted';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, zeroDecimalPlaces } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import ServersTable from './ServersTable';
import { t } from 'in-i18n';

export default function TuxedoMachineDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoMachine.curLoad')}>
          <MetricValue snapshotId={snapshotId} metric="currLoad" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoMachine.highNoOfAccessors')}>
          <MetricValue snapshotId={snapshotId} metric="curAccessers" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tuxedoMachine.numReq')}>
          <MetricValue snapshotId={snapshotId} metric="numReq" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoMachine.totNumOfIPCMsgs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['totalQnum'],
            labels: [t('in-forge:plugins.tuxedoMachine.totNumOfIPCMsgs')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoMachine.loads')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['wkInitiated', 'wkCompleted'],
            labels: [t('in-forge:plugins.tuxedoMachine.initiated'), t('in-forge:plugins.tuxedoMachine.completed')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoMachine.curAccessers')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['curAccessers'],
            labels: [t('in-forge:plugins.tuxedoMachine.curAccessers')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tuxedoMachine.queue')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['numEnqueue', 'numDequeue'],
            labels: [t('in-forge:plugins.tuxedoMachine.enqueue'), t('in-forge:plugins.tuxedoMachine.dequeue')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <ServersTable snapshot={snapshot} />
      <QueuesTableSorted snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
