/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import QueueManagersV9Table from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/QueueManagerTableV9';
import SqlDatasourcesTable from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/SqlDatasourcesTable';
import QueueManagersTable from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/QueueManagersTable';
import PeeringStatusTable from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/PeeringStatusTable';
import XmlNamesTable from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/XmlNamesTable';
import ServicesTable from 'in-forge/plugins/ibmDataPowerDomain/Dashboard/ServicesTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
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
      <QueueManagersV9Table snapshotId={snapshotId} timeConfig={timeConfig} />
      <ServicesTable snapshot={snapshot} timeConfig={timeConfig} />
      <SqlDatasourcesTable snapshot={snapshot} timeConfig={timeConfig} />
      <XmlNamesTable snapshot={snapshot} />
      <PeeringStatusTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
