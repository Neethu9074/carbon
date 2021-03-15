/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { greaterThanZeroFormatter } from 'in-forge/plugins/rabbitMq/formatters';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import QueuesTable from 'in-forge/plugins/rabbitMq/Dashboard/QueuesTable';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import NodesTable from 'in-forge/plugins/rabbitMq/Dashboard/NodesTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { t, Trans } from 'in-i18n';

export default function RabbitMqDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  const netPartitions = snapshot.getIn(['data', 'net_partitions'], emptyMap);
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

      <NodesTable snapshot={snapshot} timeConfig={timeConfig} />

      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

function renderNetworkPartitionWarn(netPartitions) {
  return (
    <DashboardNotification type="danger">
      <div>
        <p>{t('in-forge:plugins.rabbitMq.dashboard.networkPartitionDetected')}</p>
        <p>{t('in-forge:plugins.rabbitMq.dashboard.theNatureOfThePartitionIsAsFollows')}</p>
        <table>
          <tbody>
            <tr>
              <th>{t('in-forge:plugins.rabbitMq.dashboard.node')}</th>
              <th>{t('in-forge:plugins.rabbitMq.dashboard.wasPartitionedFrom')}</th>
            </tr>
            {netPartitions
              .map((partFrom, node) => (
                <tr>
                  <td>{node}</td>
                  <td>{partFrom.toArray().join(',')}</td>
                </tr>
              ))
              .valueSeq()
              .toArray()}
          </tbody>
        </table>
        <br />
        <p>
          <Trans
            i18nKey="in-forge:plugins.rabbitMq.dashboard.networkPartitionWarnFooter"
            components={{
              link: <a href="http://www.rabbitmq.com/partitions.html" />
            }}
          />
        </p>
      </div>
    </DashboardNotification>
  );
}
