/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RunningQueries from 'in-forge/plugins/clickHouseDatabase/Dashboard/RunningQueries';
import RunningMerges from 'in-forge/plugins/clickHouseDatabase/Dashboard/RunningMerges';
import TablesTable from 'in-forge/plugins/clickHouseDatabase/Dashboard/TablesTable.js';
import MetricsTable from 'in-forge/plugins/clickHouseDatabase/Dashboard/MetricsTable';
import { bytes, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { t, Trans } from 'in-i18n';

export default function ClickHouseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.clickhouseDatabase.dashboard.titleSelectQueries')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['SelectQuery'],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelSelectQueries')],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['QueryThread'],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelQueryThreads')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.clickhouseDatabase.dashboard.titleInsertQueries')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['InsertQuery'],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelInsertQueries')],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['InsertedBytes'],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelInsertBytes')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <TablesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DashboardSection title={t('in-forge:plugins.clickhouseDatabase.dashboard.titleMerges')}>
        <ChartExplanation>
          <Trans i18nKey="in-forge:plugins.clickhouseDatabase.dashboard.explanationMerges" />
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['Merge'],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelMerges')],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['parts'],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelActiveParts')],
            type: 'line',
            formatter: withSiPrefixThreeDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.clickhouseDatabase.dashboard.titleReplication')}>
        <ChartExplanation>
          <Trans i18nKey="in-forge:plugins.clickhouseDatabase.dashboard.explanationReplication" />
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['ReplicasMaxQueueSize', 'ReplicasMaxInsertsInQueue', 'ReplicasMaxMergesInQueue'],
            labels: [
              t('in-forge:plugins.clickhouseDatabase.dashboard.labelReplicasMaxQueueSize'),
              t('in-forge:plugins.clickhouseDatabase.dashboard.labelReplicasMaxInsertsInQueue'),
              t('in-forge:plugins.clickhouseDatabase.dashboard.labelReplicasMaxMergesInQueue')
            ],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['ReplicatedSend', 'ReplicatedFetch'],
            labels: [
              t('in-forge:plugins.clickhouseDatabase.dashboard.labelReplicatedSend'),
              t('in-forge:plugins.clickhouseDatabase.dashboard.labelReplicatedFetch')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.clickhouseDatabase.dashboard.titleDistributedSends')}>
        <ChartExplanation>
          <Trans i18nKey="in-forge:plugins.clickhouseDatabase.dashboard.explanationDistributedSends" />
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['DistributedFilesToInsert'],
            labels: [t('in-forge:plugins.clickhouseDatabase.dashboard.labelDistributedFilesToInsert')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <MetricsTable snapshot={snapshot} timeConfig={timeConfig} />
      <RunningQueries snapshot={snapshot} timeConfig={timeConfig} />
      <RunningMerges snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
