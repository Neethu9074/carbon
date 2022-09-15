/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import { pluginMetricStatisticsEnabled } from 'in-services/featureFlags';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getPluginName } from 'in-sdk/pluginName';
import { config } from 'in-services/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const pluginAndEntityCols = [
  {
    title: t('in-internal:monitoringUnit.thisUnit.entityStatistics.plugin'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return getPluginName(row.plugin, 1);
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.entityStatistics.entityCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId() {
        return ID_OF_PROCESSING_STATISTICS;
      },
      getMetricName(row) {
        return `plugin.${row.plugin}`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
const metricCol = {
  title: t('in-internal:monitoringUnit.thisUnit.entityStatistics.metricCount'),
  type: 'metric',
  typeArgs: {
    getSnapshotId() {
      return ID_OF_PROCESSING_STATISTICS;
    },
    getMetricName(row) {
      return `pluginMetrics.${row.plugin}`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const cols = pluginMetricStatisticsEnabled ? pluginAndEntityCols.concat(metricCol) : pluginAndEntityCols;

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function Cockpit({ timeConfig }) {
    const rows = Object.keys(plugins).map(key => ({ key: plugins[key], plugin: plugins[key], timeConfig }));

    return (
      <InternalViewWrapper>
        <h1>{t('in-internal:thisUnit.entityStatistics.cockpit')}</h1>

        <DashboardSection
          title={
            pluginMetricStatisticsEnabled
              ? t('in-internal:monitoringUnit.thisUnit.entityStatistics.entityAndMetricCount')
              : t('in-internal:monitoringUnit.thisUnit.entityStatistics.entityCount')
          }
        >
          <Chart
            snapshotId={ID_OF_PROCESSING_STATISTICS}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`physicalEntities`],
              labels: [t('in-internal:monitoringUnit.thisUnit.entityStatistics.entityCount')],
              type: 'line'
            }}
            y2={
              pluginMetricStatisticsEnabled && {
                min: 0,
                formatter: number.compact,
                metrics: [`metrics`],
                labels: [t('in-internal:monitoringUnit.thisUnit.entityStatistics.metricCount')],
                type: 'line'
              }
            }
          />
        </DashboardSection>

        {pluginMetricStatisticsEnabled || (
          <Message small type="warning">
            To enable breakdown of metric statistics by plugin, add{' '}
            <strong>
              {config.tenant}-{config.tenantUnit}
            </strong>{' '}
            to <strong>feature.plugin.metric.statistics.enabled</strong>
          </Message>
        )}

        <Table
          cardTitle={
            pluginMetricStatisticsEnabled
              ? t('in-internal:monitoringUnit.thisUnit.entityStatistics.perPluginEntityAndMetricCount')
              : t('in-internal:monitoringUnit.thisUnit.entityStatistics.perPluginEntityCount')
          }
          cols={cols}
          rows={rows}
          getRowDetails={getRowDetails}
          maxItemsPerPage={20}
          initialSortColumn={1}
          initialSortDirection="desc"
        />
      </InternalViewWrapper>
    );
  }
);

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={ID_OF_PROCESSING_STATISTICS}
      timeConfig={row.timeConfig}
      y1={{
        formatter: number.compact,
        metrics: [`plugin.${row.plugin}`],
        labels: [t('in-internal:monitoringUnit.thisUnit.entityStatistics.entityCount')],
        type: 'line'
      }}
      y2={
        pluginMetricStatisticsEnabled && {
          formatter: number.compact,
          metrics: [`pluginMetrics.${row.plugin}`],
          labels: [t('in-internal:monitoringUnit.thisUnit.entityStatistics.metricCount')],
          type: 'line'
        }
      }
    />
  );
}
