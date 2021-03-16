/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SqlDatasourcesTable from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/SqlDatasourcesTable.js';
import QueueManagersTable from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/QueueManagersTable.js';
import ServicesTable from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/ServicesTable.js';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmDataPowerDomainDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')}>
          <MetricValue snapshotId={snapshotId} metric="currentMemUsage" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: percentage.compact,
            tooltipFormatter: percentage.compact,
            metrics: [`currentMemUsage`],
            labels: [t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')],
            type: 'line'
          }}
        />
      </DashboardSection>

      <QueueManagersTable snapshot={snapshot} timeConfig={timeConfig} />
      <ServicesTable snapshot={snapshot} timeConfig={timeConfig} />
      <SqlDatasourcesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
