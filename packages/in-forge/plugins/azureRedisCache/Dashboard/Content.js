/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentagePlainTwoDecimalPlaces,
  muSecondsZeroDecimalPlaces
} from 'in-services/formatters/number';
import RedisCacheShardTable from 'in-forge/plugins/azureRedisCache/Dashboard/RedisCacheShardTable.js';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureRedisCacheDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureRedisCache.dashboard.labelOperationsPerSecond')}>
          <MetricValue snapshotId={snapshotId} metric="operationsPerSecond" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.azureRedisCache.dashboard.labelEvictedKeys')}>
          <MetricValue snapshotId={snapshotId} metric="evictedkeys" />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.azureRedisCache.dashboard.labelConnections')}>
          <MetricValue snapshotId={snapshotId} metric="connectedclients" />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.azureRedisCache.dashboard.labelLatency')}>
          <MetricValue snapshotId={snapshotId} metric="cacheLatency" formatter={muSecondsZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.labelOperationsPerSecond')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['operationsPerSecond'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelOperationsPerSecond')],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleCachedHits')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cachehits', 'cachemisses'],
            labels: [
              t('in-forge:plugins.azureRedisCache.dashboard.labelCachedHits'),
              t('in-forge:plugins.azureRedisCache.dashboard.labelCachedMisses')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleGetsSets')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['getcommands', 'setcommands'],
            labels: [
              t('in-forge:plugins.azureRedisCache.dashboard.labelGets'),
              t('in-forge:plugins.azureRedisCache.dashboard.labelSets')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleExpired')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expiredkeys', 'evictedkeys'],
            labels: [
              t('in-forge:plugins.azureRedisCache.dashboard.labelKeysExpired'),
              t('in-forge:plugins.azureRedisCache.dashboard.labelKeysEvicted')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleMemory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['usedmemoryRss', 'usedmemory'],
            labels: [
              t('in-forge:plugins.azureRedisCache.dashboard.labelUsedRSS'),
              t('in-forge:plugins.azureRedisCache.dashboard.labelUsed')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleCache')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['cacheRead', 'cacheWrite'],
            labels: [
              t('in-forge:plugins.azureRedisCache.dashboard.labelCacheRead'),
              t('in-forge:plugins.azureRedisCache.dashboard.labelCacheWrite')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleTotalOperations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['totalcommandsprocessed'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelTotalOperations')],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleTotalKeys')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['totalkeys'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelTotalKeys')],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleServerLoad')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['serverLoad'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelServerLoad')],
            formatter: twoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleCPU')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['percentProcessorTime'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelCPU')],
            formatter: twoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleConnections')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['connectedclients'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelConnections')],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleUsedMemory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['usedmemorypercentage'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelUsedMemory')],
            formatter: percentagePlainTwoDecimalPlaces,
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cacheLatency'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelLatency')],
            formatter: muSecondsZeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.azureRedisCache.dashboard.titleErrors')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['errors'],
            labels: [t('in-forge:plugins.azureRedisCache.dashboard.labelErrors')],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <RedisCacheShardTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
