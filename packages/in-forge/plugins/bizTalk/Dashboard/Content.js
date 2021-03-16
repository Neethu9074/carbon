/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function BizTalkHostDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.bizTalk.dashboard.titleThrottling')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['delay'],
            labels: [t('in-forge:plugins.bizTalk.dashboard.labelThrottling')],
            formatter: millis.compact,
            type: 'bar'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.bizTalk.dashboard.titleLocations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['send_locs', 'rec_locs'],
            labels: [
              t('in-forge:plugins.bizTalk.dashboard.labelActiveSendLocations'),
              t('in-forge:plugins.bizTalk.dashboard.labelActiveReceiveLocations')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          y2={{
            metrics: ['send_threads', 'rec_threads'],
            labels: [
              t('in-forge:plugins.bizTalk.dashboard.labelActiveSendThreads'),
              t('in-forge:plugins.bizTalk.dashboard.labelActiveReceiveThreads')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.bizTalk.dashboard.titleDocuments')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['docs_proc', 'docs_resub', 'docs_rec', 'docs_sus'],
            labels: [
              t('in-forge:plugins.bizTalk.dashboard.labelProcessed'),
              t('in-forge:plugins.bizTalk.dashboard.labelResubmitted'),
              t('in-forge:plugins.bizTalk.dashboard.labelReceived'),
              t('in-forge:plugins.bizTalk.dashboard.labelSuspended')
            ],
            formatter: number.compact,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
