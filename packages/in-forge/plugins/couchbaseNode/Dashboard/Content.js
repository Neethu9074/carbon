/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { BUCKET_METRICS_PREFIX } from 'in-forge/plugins/couchbaseNode/constants.js';
import BucketsTable from 'in-forge/plugins/couchbaseNode/Dashboard/BucketsTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function CouchbaseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.couchbaseNode.dashboard.titleUsedResources')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['node.mem_used'],
              labels: [t('in-forge:plugins.couchbaseNode.dashboard.labelUsedMemory')],
              type: 'line',
              min: 0,
              formatter: bytes.compact,
              tooltipFormatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['node.couch_docs_actual_disk_size'],
              labels: [t('in-forge:plugins.couchbaseNode.dashboard.labelUsedDisk')],
              type: 'line',
              min: 0,
              formatter: bytes.compact,
              tooltipFormatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.couchbaseNode.dashboard.titleDiskDrain')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['node.disk_write_queue'],
            labels: [t('in-forge:plugins.couchbaseNode.dashboard.labelItemsInDiskQueue')],
            type: 'line'
          }}
          y2={{
            type: 'line',
            metrics: ['node.ep_diskqueue_fill', 'node.ep_diskqueue_drain'],
            labels: [
              t('in-forge:plugins.couchbaseNode.dashboard.labelItemsPutToDiskQueue'),
              t('in-forge:plugins.couchbaseNode.dashboard.labelItemsWrittenToDisk')
            ],
            min: 0,
            formatter: number.perSecond.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <BucketsTable snapshot={snapshot} timeConfig={timeConfig} bucketMetricsPrefix={BUCKET_METRICS_PREFIX} />
    </div>
  );
}
