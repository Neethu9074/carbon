/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, millis, percentage } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.awsMq.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.awsMq.dashboard.messagesEnqueued'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metricPrefix + '.enqueue_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsMq.dashboard.messagesDequeued'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metricPrefix + '.dequeue_count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsMq.dashboard.memoryUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.metricPrefix + '.memory_usage';
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function TopicsTable({ snapshot, timeConfig, type }) {
  const topics = snapshot.getIn(['data', 'topics'], emptyList);
  if (topics.size === 0) {
    return null;
  }
  const rows = topics
    .map(topic => {
      return {
        key: topic,
        timeConfig,
        snapshotId: snapshot.get('id'),
        metricPrefix: 'topicMetrics' + type + '.' + topic
      };
    })
    .toArray();
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.awsMq.dashboard.topicsRows', { rows: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          max: 1,
          metrics: [row.metricPrefix + '.memory_usage'],
          labels: [t('in-forge:plugins.awsMq.dashboard.memoryUsage')],
          type: 'line',
          formatter: percentage.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [row.metricPrefix + '.producer_count', row.metricPrefix + '.consumer_count'],
          labels: [t('in-forge:plugins.awsMq.producerCCount'), t('in-forge:plugins.awsMq.dashboard.consumerCount')],
          type: 'line',
          formatter: number.compact
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: [
              row.metricPrefix + '.enqueue_count',
              row.metricPrefix + '.dispatch_count',
              row.metricPrefix + '.dequeue_count'
            ],
            labels: [
              t('in-forge:plugins.awsMq.dashboard.enqueueCount'),
              t('in-forge:plugins.awsMq.dashboard.dispatchCount'),
              t('in-forge:plugins.awsMq.dashboard.dequeueCount')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: [row.metricPrefix + '.expired_count'],
            labels: [t('in-forge:plugins.awsMq.dashboard.expiredCount')],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [row.metricPrefix + '.enqueue_time'],
          labels: [t('in-forge:plugins.awsMq.dashboard.enqueueTime')],
          type: 'line',
          formatter: millis.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
