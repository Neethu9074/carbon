/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import QueuesTable from './QueuesTable';
import { t } from 'in-i18n';

export default function ActiveMQDashboard({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type="info">
        {t(
          'in-forge:plugins.activeMQArtemis.jmxIsNotEnabledYouCanEnableItInActivemqConfigBySettingTheBrokerPropertyUseJmxToTrue'
        )}
      </DashboardNotification>
    );
  }
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.activeMQArtemis.addresses')}>
          {snapshot.getIn(['data', 'addressNames'], emptyList).size}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQArtemis.queues')}>
          {snapshot.getIn(['data', 'queueNames'], emptyList).size}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQArtemis.allQueuesMessagesCount')}>
          <MetricValue snapshotId={snapshotId} metric="totalMessageCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.activeMQArtemis.addressMemoryUsage')}>
          <MetricValue snapshotId={snapshotId} metric="addressMemoryPercentage" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.activeMQArtemis.brokerWideMessages')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'totalMessagesAdded',
                'totalMessagesAcknowledged',
                'totalMessagesExpired',
                'totalMessagesKilled'
              ],
              labels: [
                t('in-forge:plugins.activeMQArtemis.added'),
                t('in-forge:plugins.activeMQArtemis.acknowledged'),
                t('in-forge:plugins.activeMQArtemis.expired'),
                t('in-forge:plugins.activeMQArtemis.killed')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.activeMQArtemis.brokerWideMessage')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['totalMessageCount'],
              labels: [t('in-forge:plugins.activeMQArtemis.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.activeMQArtemis.brokerWideConnectionsAndConsumers')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: ['totalConnectionCount', 'totalConsumerCount'],
              labels: [
                t('in-forge:plugins.activeMQArtemis.totalConnections'),
                t('in-forge:plugins.activeMQArtemis.totalConsumers')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.activeMQArtemis.memoryUsage')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: percentage.compact,
              min: 0,
              max: 1,
              metrics: ['addressMemoryPercentage'],
              labels: [t('in-forge:plugins.activeMQArtemis.addressMemoryUsage')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
