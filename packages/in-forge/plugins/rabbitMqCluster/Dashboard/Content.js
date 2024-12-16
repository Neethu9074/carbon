/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';

import ClusterNodesTable from 'in-forge/plugins/rabbitMqCluster/Dashboard/ClusterNodesTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { zeroDecimalPlaces, twoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import { greaterThanZeroFormatter } from 'in-forge/plugins/rabbitMq/formatters';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { carbonTableEnabled } from 'in-services/featureFlags';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { t, Trans } from 'in-i18n';

export default function RabbitMqClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const netPartitions = snapshot.getIn(['data', 'net_partitions'], emptyMap);

  return (
    <div>
      {netPartitions.size > 0 && renderNetworkPartitionWarn(netPartitions)}

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.rabbitMqCluster.nodesUp')}>
          <MetricValue snapshotId={snapshotId} metric="nodes_up" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.rabbitMqCluster.nodesDown')}>
          <MetricValue snapshotId={snapshotId} metric="nodes_down" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.rabbitMqCluster.dashboard.connections')}>
          <MetricValue snapshotId={snapshotId} metric="overview.connections" formatter={greaterThanZeroFormatter} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.rabbitMqCluster.dashboard.messagesPer5Sec')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['overview.publish_rate', 'overview.deliver_rate', 'overview.ack_rate'],
            labels: [
              t('in-forge:plugins.rabbitMqCluster.dashboard.published'),
              t('in-forge:plugins.rabbitMqCluster.dashboard.delivered'),
              t('in-forge:plugins.rabbitMqCluster.dashboard.acknowledged')
            ],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.rabbitMqCluster.dashboard.messageStatus')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['overview.messages_ready', 'overview.messages_unacknowledged', 'overview.messages'],
              labels: [
                t('in-forge:plugins.rabbitMqCluster.dashboard.ready'),
                t('in-forge:plugins.rabbitMqCluster.dashboard.unacknowledged'),
                t('in-forge:plugins.rabbitMqCluster.dashboard.total')
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
                t('in-forge:plugins.rabbitMqCluster.dashboard.readyRate'),
                t('in-forge:plugins.rabbitMqCluster.dashboard.unacknowledgedRate'),
                t('in-forge:plugins.rabbitMqCluster.dashboard.totalRate')
              ],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.rabbitMqCluster.dashboard.overview')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['overview.consumers', 'overview.connections'],
            labels: [
              t('in-forge:plugins.rabbitMqCluster.dashboard.consumers'),
              t('in-forge:plugins.rabbitMqCluster.dashboard.connections')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

function renderNetworkPartitionWarn(netPartitions) {
  const carbonHeaders = [
    {
      key: 'node',
      header: t('in-forge:plugins.rabbitMqCluster.dashboard.node')
    },
    {
      key: 'wasPartitionedFrom',
      header: t('in-forge:plugins.rabbitMqCluster.dashboard.wasPartitionedFrom')
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
        <p>{t('in-forge:plugins.rabbitMqCluster.dashboard.networkPartitionDetected')}</p>
        <p>{t('in-forge:plugins.rabbitMqCluster.dashboard.theNatureOfThePartitionIsAsFollows')}</p>
        {carbonTableEnabled && <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />}
        {!carbonTableEnabled && (
          <table>
            <tbody>
              <tr>
                <th>{t('in-forge:plugins.rabbitMqCluster.dashboard.node')}</th>
                <th>{t('in-forge:plugins.rabbitMqCluster.dashboard.wasPartitionedFrom')}</th>
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
        )}
        <br />
        <p>
          <Trans
            i18nKey="in-forge:plugins.rabbitMqCluster.dashboard.networkPartitionWarnFooter"
            components={{
              link: <a href="http://www.rabbitmq.com/partitions.html" />
            }}
          />
        </p>
      </div>
    </DashboardNotification>
  );
}
