import React from 'react';

import {
  resourceQuotaPercentage,
  resourceQuotaBytes,
  resourceQuotaZeroDecimalPlaces,
  resourceQuotaTwoDecimalPlaces
} from '../../kubernetesCluster/formatters/resourceQuota';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DeploymentConfigsTable from './DeploymentConfigsTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import DeploymentsTable from './DeploymentsTable';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

export default function KubernetesNamespaceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const isOpenshift = snapshot.getIn(['data', 'isOpenshift'], false);

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Status">{snapshot.getIn(['data', 'status'], null)}</KpiKeyValue>
        <KpiKeyValue label="Pods Allocation">
          <MetricValue snapshotId={snapshotId} metric="used_pods_percentage" formatter={resourceQuotaPercentage} />
        </KpiKeyValue>
        <KpiKeyValue label="CPU Requests Allocation">
          <MetricValue snapshotId={snapshotId} metric="required_cpu_percentage" formatter={resourceQuotaPercentage} />
        </KpiKeyValue>
        <KpiKeyValue label="CPU Limits Allocation">
          <MetricValue snapshotId={snapshotId} metric="limit_cpu_percentage" formatter={resourceQuotaPercentage} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Requests Allocation">
          <MetricValue snapshotId={snapshotId} metric="required_mem_percentage" formatter={resourceQuotaPercentage} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Limits Allocation">
          <MetricValue snapshotId={snapshotId} metric="limit_mem_percentage" formatter={resourceQuotaPercentage} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={`CPU Requests / Limits`}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: resourceQuotaTwoDecimalPlaces,
              metrics: [`cap_requests_cpu`, `used_requests_cpu`, `cap_limits_cpu`, `used_limits_cpu`],
              labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits', 'Used Limits'],
              type: 'line',
              min: 0
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Memory Requests / Limits`}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: resourceQuotaBytes,
              metrics: [`cap_requests_memory`, `used_requests_memory`, `cap_limits_memory`, `used_limits_memory`],
              labels: ['Capacity Requests', 'Used Requests', 'Capacity Limits ', 'Used Limits'],
              type: 'line',
              min: 0
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Pods Allocation">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: resourceQuotaZeroDecimalPlaces,
            metrics: ['used_pods', 'cap_pods'],
            labels: ['Used Pods', 'Pods Capacity'],
            type: 'line',
            min: 0
          }}
        />
      </DashboardSection>

      <DeploymentsTable snapshot={snapshot} timeConfig={timeConfig} />
      {isOpenshift && <DeploymentConfigsTable snapshot={snapshot} timeConfig={timeConfig} />}
    </div>
  );
}
