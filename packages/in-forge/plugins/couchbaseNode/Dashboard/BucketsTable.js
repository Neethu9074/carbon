/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes, percentage } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', `cluster.bucket_map.${row.key}.type`]);
      }
    }
  },
  {
    title: 'Items',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.bucketMetricsPrefix}.${row.key}.curr_items`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Used memory',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.bucketMetricsPrefix}.${row.key}.mem_used_ratio`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Used disk',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.bucketMetricsPrefix}.${row.key}.couch_docs_actual_disk_size`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Cache miss',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.bucketMetricsPrefix}.${row.key}.ep_cache_miss_rate`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Fragmentation',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.bucketMetricsPrefix}.${row.key}.couch_docs_fragmentation`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function BucketsTable({ snapshot, timeConfig, bucketMetricsPrefix }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'cluster.buckets'], emptyList)
    .toArray()
    .map(bucket => {
      return {
        key: bucket,
        snapshot,
        snapshotId,
        timeConfig,
        bucketMetricsPrefix
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table withoutPadding cardTitle={`Buckets (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
  );
}

function getDetails(row) {
  return (
    <div>
      <DashboardSection title="Throughput">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [
              `${row.bucketMetricsPrefix}.${row.key}.ops`,
              `${row.bucketMetricsPrefix}.${row.key}.cmd_get`,
              `${row.bucketMetricsPrefix}.${row.key}.cmd_set`
            ],
            labels: ['Operations per sec.', 'Gets per sec.', 'Sets per sec.'],
            type: 'line',
            formatter: number.perSecond.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Used Resources">
        <Columize>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              metrics: [`${row.bucketMetricsPrefix}.${row.key}.mem_used_ratio`],
              labels: [`Used memory`],
              type: 'stackedArea',
              min: 0,
              max: 1,
              formatter: percentage.compact,
              tooltipFormatter: percentage.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              metrics: [`${row.bucketMetricsPrefix}.${row.key}.couch_docs_actual_disk_size`],
              labels: ['Used disk'],
              type: 'line',
              formatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>
      <DashboardSection title="Cache">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [`${row.bucketMetricsPrefix}.${row.key}.vb_active_resident_items_ratio`],
            labels: ['Active items resident in cache'],
            type: 'stackedArea',
            min: 0,
            max: 1,
            formatter: percentage.compact,
            tooltipFormatter: percentage.detailed
          }}
          y2={{
            metrics: [`${row.bucketMetricsPrefix}.${row.key}.ep_cache_miss_rate`],
            labels: ['Cache miss'],
            type: 'stackedArea',
            min: 0,
            max: 1,
            formatter: percentage.compact,
            tooltipFormatter: percentage.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [
              `${row.bucketMetricsPrefix}.${row.key}.ep_bg_fetched`,
              `${row.bucketMetricsPrefix}.${row.key}.vb_active_eject`
            ],
            labels: ['Disk reads per sec.', 'Active items ejected per sec.'],
            type: 'line',
            min: 0,
            formatter: number.perSecond.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Fragmentation">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [`${row.bucketMetricsPrefix}.${row.key}.couch_docs_fragmentation`],
            labels: ['Docs fragmentation'],
            type: 'stackedArea',
            min: 0,
            max: 1,
            formatter: percentage.compact,
            tooltipFormatter: percentage.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
