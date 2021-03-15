/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, bytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import TopicsTable from './TopicsTable';
import QueuesTable from './QueuesTable';
import { Trans, t } from 'in-i18n';

export default function TibcoDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus === 'STATISTICS_DISABLED') {
    return (
      <DashboardNotification type="info">
        <Trans
          i18nKey="in-forge:plugins.tibcoEMS.infoStatisticsDisabled"
          components={{
            codeTag: <code />,
            bold: <strong />
          }}
        />
      </DashboardNotification>
    );
  } else if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        <Trans
          i18nKey="in-forge:plugins.tibcoEMS.infoEnableMetricCollection"
          components={{
            bold: <strong />
          }}
        />
      </DashboardNotification>
    );
  }

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tibcoEMS.labelConnections')}>
          <MetricValue snapshotId={snapshotId} metric="connectionCount" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoEMS.labelSessions')}>
          <MetricValue snapshotId={snapshotId} metric="sessionCount" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoEMS.labelUpTime')}>
          <MetricValue snapshotId={snapshotId} metric="uptime" formatter={millis.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleConnectivity')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['connectionCount', 'sessionCount'],
              labels: [t('in-forge:plugins.tibcoEMS.labelConnections'), t('in-forge:plugins.tibcoEMS.labelSessions')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleDurables')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['durableCount'],
              labels: [t('in-forge:plugins.tibcoEMS.labelCount')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleStorage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['readOperations', 'writeOperations'],
            labels: [
              t('in-forge:plugins.tibcoEMS.labelReadOperationsRate'),
              t('in-forge:plugins.tibcoEMS.labelWriteOperationsRate')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.tibcoEMS.titlePendingMessages')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['pendingMessagesCount'],
              labels: [t('in-forge:plugins.tibcoEMS.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['pendingMessagesSize'],
              labels: [t('in-forge:plugins.tibcoEMS.labelSize')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleMessagesMemory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['messagesMemory'],
              labels: [t('in-forge:plugins.tibcoEMS.labelUsedMemory')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.tibcoEMS.titleMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['inMessagesCount', 'outMessagesCount'],
            labels: [
              t('in-forge:plugins.tibcoEMS.labelInMessagesCount'),
              t('in-forge:plugins.tibcoEMS.labelOutMessagesCount')
            ],
            type: 'line'
          }}
          y2={{
            formatter: number.compact,
            metrics: ['inMessages', 'outMessages'],
            labels: [
              t('in-forge:plugins.tibcoEMS.labelInMessagesRate'),
              t('in-forge:plugins.tibcoEMS.labelOutMessagesRate')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
      <QueuesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
