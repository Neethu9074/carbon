/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  bytesTwoDecimalPlaces,
  timeByNanoTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { LOG_DOCKER_SNAPSHOT_ID, getValueMatchTagFilter } from 'in-logging/queryBuilder';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import AnalyzeLogsButton from 'in-forge/plugins/docker/Dashboard/AnalyzeLogsButton';
import { hasNetworkMetrics, hasMemoryMetrics } from 'in-forge/plugins/docker/util';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import LogsKpiCard from 'in-forge/plugins/docker/Dashboard/LogsKpiCard';
import LogsChart from 'in-forge/plugins/docker/Dashboard/LogsChart';
import { containerLogsEnabled } from 'in-services/featureFlags';
import useHasLogs from 'in-logging/hooks/useHasLogs';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function DockerDashboard({ snapshot, timeConfig }) {
  const memoryLimitBytes = snapshot.getIn(['data', 'memory.limit']);
  const snapshotId = snapshot.get('id');

  const tagFilterExpression = getValueMatchTagFilter({ name: LOG_DOCKER_SNAPSHOT_ID, value: snapshot.get('id') });
  const hasLogs = useHasLogs({ tagFilterExpression, timeConfig });

  return (
    <div>
      {!hasMemoryMetrics(snapshot) ? (
        <DashboardNotification type="info">
          Due to a regression in Docker 1.11.0 and 1.11.1, no memory metrics can be collected. This has been fixed by
          Docker in 1.12.0 and 1.11.2.
        </DashboardNotification>
      ) : null}

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.docker.dashboard.cpuTotal')}>
          <MetricValue snapshotId={snapshotId} metric="cpu.total_usage" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.docker.dashboard.memoryUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="memory.used_percentage"
            formatter={percentageZeroDecimalPlaces}
          />
        </KpiKeyValue>
        {containerLogsEnabled && (
          <LogsKpiCard
            hasLogs={hasLogs}
            tagFilterExpression={tagFilterExpression}
            timeConfig={timeConfig}
            snapshot={snapshot}
          />
        )}
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.docker.dashboard.cpu')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
            labels: [
              t('in-forge:plugins.docker.dashboard.total'),
              t('in-forge:plugins.docker.dashboard.kernel'),
              t('in-forge:plugins.docker.dashboard.user')
            ],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['cpu.total_usage_normalized', 'cpu.system_usage_normalized', 'cpu.user_usage_normalized'],
            labels: [
              t('in-forge:plugins.docker.dashboard.totalNormalized'),
              t('in-forge:plugins.docker.dashboard.kernelNormalized'),
              t('in-forge:plugins.docker.dashboard.userNormalized')
            ],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.throttling_count'],
            labels: [t('in-forge:plugins.docker.dashboard.throttlingCount')],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['cpu.throttling_time'],
            labels: [t('in-forge:plugins.docker.dashboard.throttlingTime')],
            type: 'line',
            formatter: timeByNanoTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {hasMemoryMetrics(snapshot) ? (
        <DashboardSection
          title={
            memoryLimitBytes
              ? t('in-forge:plugins.docker.dashboard.memoryLimit', {
                  limitBytes: bytesTwoDecimalPlaces(memoryLimitBytes)
                })
              : t('in-forge:plugins.docker.dashboard.memory')
          }
        >
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['memory.usage', 'memory.total_rss', 'memory.total_cache'],
              labels: [
                t('in-forge:plugins.docker.dashboard.usage'),
                t('in-forge:plugins.docker.dashboard.rss'),
                t('in-forge:plugins.docker.dashboard.cache')
              ],
              formatter: bytesTwoDecimalPlaces,
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['memory.used_percentage'],
              labels: [t('in-forge:plugins.docker.dashboard.memoryUsage')],
              type: 'line',
              formatter: percentageTwoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['memory.active_anon', 'memory.active_file', 'memory.inactive_anon', 'memory.inactive_file'],
              labels: [
                t('in-forge:plugins.docker.dashboard.activeAnonymous'),
                t('in-forge:plugins.docker.dashboard.activeCache'),
                t('in-forge:plugins.docker.dashboard.inactiveAnonymous'),
                t('in-forge:plugins.docker.dashboard.inactiveCache')
              ],
              formatter: bytesTwoDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <DashboardSection title={t('in-forge:plugins.docker.dashboard.blockIo')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['blkio.blk_read', 'blkio.blk_write'],
            labels: [t('in-forge:plugins.docker.dashboard.read'), t('in-forge:plugins.docker.dashboard.write')],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {hasNetworkMetrics(snapshot) ? (
        <DashboardSection title={t('in-forge:plugins.docker.dashboard.network')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['network.rx.bytes', 'network.tx.bytes'],
              labels: [
                t('in-forge:plugins.docker.dashboard.received'),
                t('in-forge:plugins.docker.dashboard.transmitted')
              ],
              type: 'line'
            }}
            y2={{
              min: 0,
              max: 1,
              metrics: ['network.rx.errors', 'network.rx.dropped', 'network.tx.errors', 'network.tx.dropped'],
              labels: [
                t('in-forge:plugins.docker.dashboard.rxErrors'),
                t('in-forge:plugins.docker.dashboard.rxDropped'),
                t('in-forge:plugins.docker.dashboard.txErrors'),
                t('in-forge:plugins.docker.dashboard.txDropped')
              ],
              formatter: percentageTwoDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      {hasLogs && containerLogsEnabled && (
        <DashboardSection
          title={t('in-forge:plugins.docker.dashboard.logs')}
          button={<AnalyzeLogsButton tagFilterExpression={tagFilterExpression} timeConfig={timeConfig} />}
        >
          <LogsChart tagFilterExpression={tagFilterExpression} />
        </DashboardSection>
      )}
    </div>
  );
}
