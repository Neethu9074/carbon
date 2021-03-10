/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import EthernetInterfacesTable from 'in-forge/plugins/ibmDataPowerAppliance/Dashboard/EthernetInterfacesTable.js';
import TCPSummaryTable from 'in-forge/plugins/ibmDataPowerAppliance/Dashboard/TCPSummaryTable';
import DomainsTable from 'in-forge/plugins/ibmDataPowerAppliance/Dashboard/DomainsTable.js';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function IbmDataPowerApplianceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerAppliance.cpuUsage')}>
          <MetricValue snapshotId={snapshotId} metric="cpuUsage" formatter={percentage.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerAppliance.memoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="memoryUsage" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerAppliance.systemLoad')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['systemLoad'],
            labels: [t('in-forge:plugins.ibmDataPowerAppliance.systemLoad')],
            type: 'line',
            formatter: percentage.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerAppliance.cpuUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cpuUsage'],
            labels: [t('in-forge:plugins.ibmDataPowerAppliance.cpuUsage')],
            type: 'line',
            formatter: percentage.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerAppliance.encryptedFilesystemUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['encryptedFilesystemUsage'],
            labels: [t('in-forge:plugins.ibmDataPowerAppliance.encryptedFilesystemUsage')],
            type: 'line',
            formatter: percentage.compact
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmDataPowerAppliance.connectionAccepted')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['connectionAccepted'],
            labels: [t('in-forge:plugins.ibmDataPowerAppliance.connectionAccepted')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <TCPSummaryTable snapshot={snapshot} timeConfig={timeConfig} />
      <EthernetInterfacesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DomainsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
