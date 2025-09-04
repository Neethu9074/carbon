/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';
import { TimeConfig } from '@instana/types';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

import TotalUsageBigNumber from 'in-forge/plugins/oTelMilvusDB/Dashboard/TotalUsageBigNumber';
import TopListByService from 'in-forge/plugins/oTelMilvusDB/Dashboard/TopListByService';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import { days, hours, minutes, seconds } from 'in-services/time';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';
import { Config } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { InfraMetricConfiguration } from '@instana/types';

interface OTelMilvusDBDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

export default function OTelMilvusDBDashboard({ snapshot, timeConfig }: OTelMilvusDBDashboardProps): JSX.Element {
  const snapshotId = snapshot.get('id');
  const metricIds = snapshot.get('metricIds');

  const inserUnits = metricIds
    .filter((metric: string) => metric.includes('db.milvus.usage.insert_units'))
    .sort()
    .toArray();
  const upsertUnits = metricIds
    .filter((metric: string) => metric.includes('db.milvus.usage.upsert_units'))
    .sort()
    .toArray();
  const deleteUnits = metricIds
    .filter((metric: string) => metric.includes('db.milvus.usage.delete_units'))
    .sort()
    .toArray();
  const queryDuration = metricIds
    .filter((metric: string) => metric.includes('db.milvus.query.duration'))
    .sort()
    .toArray();
  const searchDistance = metricIds
    .filter((metric: string) => metric.includes('db.milvus.search.distance'))
    .sort()
    .toArray();

  const instanceId = snapshot.get('data').get('resource.service.instance.id');

  let minRollup = seconds.toMillis(10);
  if (timeConfig.windowSize >= days.toMillis(91)) {
    minRollup = days.toMillis(7);
  } else if (timeConfig.windowSize >= days.toMillis(7)) {
    minRollup = days.toMillis(1);
  } else if (timeConfig.windowSize >= hours.toMillis(24)) {
    minRollup = hours.toMillis(1);
  } else if (timeConfig.windowSize >= hours.toMillis(12)) {
    minRollup = minutes.toMillis(10);
  } else if (timeConfig.windowSize >= hours.toMillis(6)) {
    minRollup = minutes.toMillis(5);
  } else if (timeConfig.windowSize >= hours.toMillis(1)) {
    minRollup = minutes.toMillis(1);
  } else if (timeConfig.windowSize >= minutes.toMillis(30)) {
    minRollup = seconds.toMillis(30);
  }

  // Create config objects for TotalUsageBigNumber components
  const createBigNumberConfig = (metricName: string): Config<InfraMetricConfiguration> => ({
    formatter: "number.compact",
    metricConfiguration: {
      aggregation: 'SUM',
      metric: metricName,
      source: 'INFRASTRUCTURE_METRICS',
      timeShift: { offset: 0 },
      tagFilterExpression: {
        name: 'otel.attribute.service.instance.id',
        type: 'TAG_FILTER',
        value: instanceId,
        entity: 'NOT_APPLICABLE',
        operator: 'EQUALS'
      },
      crossSeriesAggregation: 'SUM',
      type: 'oTelMilvusDB',
      regex: false,
      timeConfig: {
        windowSize: timeConfig.windowSize,
        to: timeConfig.to,
        focusedMoment: timeConfig.focusedMoment,
        autoRefresh: timeConfig.autoRefresh
      },
      resultType: 'SINGLE_NUMBER'
    }
  });

  // Create chart timeConfig with autoRefresh property
  const chartTimeConfig = {
    windowSize: timeConfig.windowSize,
    to: timeConfig.to,
    focusedMoment: timeConfig.focusedMoment,
    autoRefresh: timeConfig.autoRefresh
  };

  return (
    <div>
      <Columize>
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelMilvusDB.dashboard.totalInsertCount')}
          metricName="metrics.sums.db.milvus.usage.insert_units"
          tagFilter={instanceId}
          formatter="number.compact"
          config={createBigNumberConfig("metrics.sums.db.milvus.usage.insert_units")}
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelMilvusDB.dashboard.totalUpsertCount')}
          metricName="metrics.sums.db.milvus.usage.upsert_units"
          tagFilter={instanceId}
          formatter="number.compact"
          config={createBigNumberConfig("metrics.sums.db.milvus.usage.upsert_units")}
        />
        <TotalUsageBigNumber
          title={t('in-forge:plugins.oTelMilvusDB.dashboard.totalDeleteCount')}
          metricName="metrics.sums.db.milvus.usage.delete_units"
          tagFilter={instanceId}
          formatter="number.compact"
          config={createBigNumberConfig("metrics.sums.db.milvus.usage.delete_units")}
        />
      </Columize>

      <Columize>
        <TopListByService
          title={t('in-forge:plugins.oTelMilvusDB.dashboard.totalInsertCountByService')}
          metricName="metrics.sums.db.milvus.usage.insert_units"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByService
          title={t('in-forge:plugins.oTelMilvusDB.dashboard.totalUpsertCountByService')}
          metricName="metrics.sums.db.milvus.usage.upsert_units"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="number.compact"
        />
        <TopListByService
          title={t('in-forge:plugins.oTelMilvusDB.dashboard.totalDeleteCountByService')}
          metricName="metrics.sums.db.milvus.usage.delete_units"
          tag="metric.tag.service_name"
          tagFilter={instanceId}
          formatter="number.compact"
        />
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelMilvusDB.dashboard.insertCountByService')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={chartTimeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: inserUnits ? inserUnits : [],
              labels: inserUnits?.map((metric: string) => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelMilvusDB.dashboard.insertCountByService');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelMilvusDB.dashboard.upsertCountByService')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={chartTimeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: upsertUnits ? upsertUnits : [],
              labels: upsertUnits?.map((metric: string) => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelMilvusDB.dashboard.upsertCountByService');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelMilvusDB.dashboard.deleteCountByService')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={chartTimeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: deleteUnits ? deleteUnits : [],
              labels: deleteUnits?.map((metric: string) => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelMilvusDB.dashboard.deleteCountByService');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelMilvusDB.dashboard.queryDurationByService')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={chartTimeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: millis.detailed,
              metrics: queryDuration ? queryDuration : [],
              labels: queryDuration?.map((metric: string) => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelMilvusDB.dashboard.queryDurationByService');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.oTelMilvusDB.dashboard.searchDistanceByService')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={chartTimeConfig}
            minRollup={minRollup}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: searchDistance ? searchDistance : [],
              labels: searchDistance?.map((metric: string) => {
                if (metric.split('.').length > 4) {
                  return metric.split('.')[4];
                }
                return t('in-forge:plugins.oTelMilvusDB.dashboard.searchDistanceByService');
              }),
              type: 'line',
              aggregation: 'sum'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
