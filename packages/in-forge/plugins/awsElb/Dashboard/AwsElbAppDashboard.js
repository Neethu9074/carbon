/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes } from 'in-services/formatters/number';
import AZAppTable from './AZAppTable';

export default function AwsElbAppDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.awsElb.titleProcessedBytes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['processed_bytes'],
            labels: [t('in-forge:plugins.awsElb.labelProcessedBytes')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsElb.titleConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['active_connection_count', 'new_connection_count', 'rejected_connection_count'],
            labels: [
              t('in-forge:plugins.awsElb.labelActive'),
              t('in-forge:plugins.awsElb.labelNew'),
              t('in-forge:plugins.awsElb.labelRejected')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.awsElb.titleELBHTTPErrorCodes')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['elb_4XX_count', 'elb_5XX_count'],
            labels: [t('in-forge:plugins.awsElb.labelStatusCode4xx'), t('in-forge:plugins.awsElb.labelStatusCode5xx')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <AZAppTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
