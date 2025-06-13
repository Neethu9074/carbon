/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { greaterThanZeroFormatter } from 'in-forge/plugins/rabbitMq/formatters';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import QueuesTable from 'in-forge/plugins/rabbitMq/Dashboard/QueuesTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { t, Trans } from 'in-i18n';

export default function RabbitMqDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  const netPartitions = snapshot.getIn(['data', 'net_partitions'], emptyMap);
  const nodeName = snapshot.getIn(['data', 'overview.node']);
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  return (
    <div>
      {netPartitions.size > 0 && renderNetworkPartitionWarn(netPartitions)}

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.rabbitMq.dashboard.messagesReady')}>
          <MetricValue snapshotId={snapshotId} metric="overview.messages_ready" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.rabbitMq.dashboard.consumers')}>
          <MetricValue snapshotId={snapshotId} metric="overview.consumers" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.rabbitMq.dashboard.connections')}>
          <MetricValue snapshotId={snapshotId} metric="overview.connections" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.rabbitMq.dashboard.messagesPer5Sec')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['overview.publish_rate', 'overview.deliver_rate', 'overview.ack_rate'],
            labels: [
              t('in-forge:plugins.rabbitMq.dashboard.published'),
              t('in-forge:plugins.rabbitMq.dashboard.delivered'),
              t('in-forge:plugins.rabbitMq.dashboard.acknowledged')
            ],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.rabbitMq.dashboard.messageStatus')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['overview.messages_ready', 'overview.messages_unacknowledged', 'overview.messages'],
              labels: [
                t('in-forge:plugins.rabbitMq.dashboard.ready'),
                t('in-forge:plugins.rabbitMq.dashboard.unacknowledged'),
                t('in-forge:plugins.rabbitMq.dashboard.total')
              ],
              type: 'line',
              formatter: zeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: [
                'overview.messages_ready_rate',
                'overview.messages_unacknowledged_rate',
                'overview.messages_rate'
              ],
              labels: [
                t('in-forge:plugins.rabbitMq.dashboard.readyRate'),
                t('in-forge:plugins.rabbitMq.dashboard.unacknowledgedRate'),
                t('in-forge:plugins.rabbitMq.dashboard.totalRate')
              ],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.rabbitMq.dashboard.overview')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['overview.consumers', 'overview.connections'],
            labels: [
              t('in-forge:plugins.rabbitMq.dashboard.consumers'),
              t('in-forge:plugins.rabbitMq.dashboard.connections')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.rabbitMq.dashboard.nodeMetrics')}>
        <Columize>
          <div>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['node_map.' + nodeName + '.fd_used', 'node_map.' + nodeName + '.fd_total'],
                labels: [
                  t('in-forge:plugins.rabbitMq.dashboard.fileDescriptorsUsed'),
                  t('in-forge:plugins.rabbitMq.dashboard.totalFileDescriptors')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: ['node_map.' + nodeName + '.mem_used', 'node_map.' + nodeName + '.mem_limit'],
                labels: [
                  t('in-forge:plugins.rabbitMq.dashboard.memoryUsed'),
                  t('in-forge:plugins.rabbitMq.dashboard.memoryLimit')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </div>
          <div>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: ['node_map.' + nodeName + '.proc_used', 'node_map.' + nodeName + '.proc_total'],
                labels: [
                  t('in-forge:plugins.rabbitMq.dashboard.erlangProcessesUsed'),
                  t('in-forge:plugins.rabbitMq.dashboard.maxErlangProcesses')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />

            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: ['node_map.' + nodeName + '.disk_free', 'node_map.' + nodeName + '.disk_free_limit'],
                labels: [
                  t('in-forge:plugins.rabbitMq.dashboard.diskFreeSpace'),
                  t('in-forge:plugins.rabbitMq.dashboard.diskAlarmThreshold')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </div>
        </Columize>

        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['node_map.' + nodeName + '.sockets_used', 'node_map.' + nodeName + '.sockets_total'],
            labels: [
              t('in-forge:plugins.rabbitMq.dashboard.socketsUsed'),
              t('in-forge:plugins.rabbitMq.dashboard.totalSockets')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

function renderNetworkPartitionWarn(netPartitions) {
  const carbonHeaders = [
    {
      key: 'node',
      header: t('in-forge:plugins.rabbitMq.dashboard.node')
    },
    {
      key: 'wasPartitionedFrom',
      header: t('in-forge:plugins.rabbitMq.dashboard.wasPartitionedFrom')
    }
  ];

  const carbonRows = netPartitions
    ?.map((partFrom, node, index) => {
      return {
        key: index,
        ['node']: node,
        ['wasPartitionedFrom']: partFrom.toArray().join(',')
      };
    })
    .valueSeq()
    .toArray();

  return (
    <DashboardNotification type="danger">
      <div>
        <p>{t('in-forge:plugins.rabbitMq.dashboard.networkPartitionDetected')}</p>
        <p>{t('in-forge:plugins.rabbitMq.dashboard.theNatureOfThePartitionIsAsFollows')}</p>
        {<CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />}
        <br />
        <p>
          <Trans
            i18nKey="in-forge:plugins.rabbitMq.dashboard.networkPartitionWarnFooter"
            components={{
              link: <a href="https://www.rabbitmq.com/partitions.html" />
            }}
          />
        </p>
      </div>
    </DashboardNotification>
  );
}
