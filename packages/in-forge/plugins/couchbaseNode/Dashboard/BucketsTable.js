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
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.couchbaseNode.dashboard.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.couchbaseNode.dashboard.titleType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', `cluster.bucket_map.${row.key}.type`]);
      }
    }
  },
  {
    title: t('in-forge:plugins.couchbaseNode.dashboard.titleItems'),
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
    title: t('in-forge:plugins.couchbaseNode.dashboard.titleUsedMemory'),
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
    title: t('in-forge:plugins.couchbaseNode.dashboard.titleUsedDisk'),
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
    title: t('in-forge:plugins.couchbaseNode.dashboard.titleCacheMiss'),
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
    title: t('in-forge:plugins.couchbaseNode.dashboard.titleFragmentation'),
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
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.couchbaseNode.dashboard.titleBucketsCount', { bucketsCount: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.couchbaseNode.dashboard.titleThroughput')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [
              `${row.bucketMetricsPrefix}.${row.key}.ops`,
              `${row.bucketMetricsPrefix}.${row.key}.cmd_get`,
              `${row.bucketMetricsPrefix}.${row.key}.cmd_set`
            ],
            labels: [
              t('in-forge:plugins.couchbaseNode.dashboard.labelOperationsPerSec'),
              t('in-forge:plugins.couchbaseNode.dashboard.labelGetsPerSec'),
              t('in-forge:plugins.couchbaseNode.dashboard.labelSetsPerSec')
            ],
            type: 'line',
            formatter: number.perSecond.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.couchbaseNode.dashboard.titleUsedResources')}>
        <Columize>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              metrics: [`${row.bucketMetricsPrefix}.${row.key}.mem_used_ratio`],
              labels: [t('in-forge:plugins.couchbaseNode.dashboard.labelUsedMemory')],
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
              labels: [t('in-forge:plugins.couchbaseNode.dashboard.labelUsedDisk')],
              type: 'line',
              formatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.couchbaseNode.dashboard.titleCache')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [`${row.bucketMetricsPrefix}.${row.key}.vb_active_resident_items_ratio`],
            labels: [t('in-forge:plugins.couchbaseNode.dashboard.labelActiveItemsResidentInCache')],
            type: 'stackedArea',
            min: 0,
            max: 1,
            formatter: percentage.compact,
            tooltipFormatter: percentage.detailed
          }}
          y2={{
            metrics: [`${row.bucketMetricsPrefix}.${row.key}.ep_cache_miss_rate`],
            labels: [t('in-forge:plugins.couchbaseNode.dashboard.labelCacheMiss')],
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
            labels: [
              t('in-forge:plugins.couchbaseNode.dashboard.labelDiskReadsPerSec'),
              t('in-forge:plugins.couchbaseNode.dashboard.labelActiveItemsEjected')
            ],
            type: 'line',
            min: 0,
            formatter: number.perSecond.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.couchbaseNode.dashboard.titleFragmentation')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [`${row.bucketMetricsPrefix}.${row.key}.couch_docs_fragmentation`],
            labels: [t('in-forge:plugins.couchbaseNode.dashboard.labelDocsFragmentation')],
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
