/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { time, number } from 'in-services/formatters/number';
import { identity } from 'in-services/formatters/string';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ibmcloudCloudantDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudCloudant.labelName')}>
          <MetricValue snapshotId={snapshotId} metric="name" formatter={identity.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmcloudCloudant.labelHTTPRequestsTotal')}>
          <MetricValue snapshotId={snapshotId} metric="http_requests_total" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Request Activity">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: time,
            metrics: ['http_requests_total'],
            labels: [t('in-forge:plugins.ibmcloudCloudant.labelHTTPRequestsTotal')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
