/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AwsElbNetDashboard({ snapshot, timeConfig }) {
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
      <DashboardSection title={t('in-forge:plugins.awsElb.titleNewFlowCount')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['new_flow_count'],
            labels: [t('in-forge:plugins.awsElb.labelNewFlowCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsElb.titleTCPResetsRST')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['client_reset_count', 'elb_reset_count', 'target_reset_count'],
            labels: [
              t('in-forge:plugins.awsElb.labelClient'),
              t('in-forge:plugins.awsElb.labelLoadBalancer'),
              t('in-forge:plugins.awsElb.labelTarget')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
