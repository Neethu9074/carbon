/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import {
  withSiMultiplyPrefixZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  number
} from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

function optionalCountFormatter(v) {
  if (v < 0) {
    return 'N/A';
  }
  return number.compact(v);
}

const cols = [
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.index'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.shards'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.shards || -1;
      },
      getContent: optionalCountFormatter
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.replicas'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.replicas;
      },
      getContent: optionalCountFormatter
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.documents'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.document_count`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.deleted'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.deleted_count`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.totalQueries'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.query_total`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.size'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.size`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.elasticsearchCluster.dashboard.metadataSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clusterState.indices.${row.name}.indexMetadataSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function IndicesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const shards = snapshot.getIn(['data', 'index.shards'], emptyList);
  const replicas = snapshot.getIn(['data', 'index.replicas'], emptyList);
  const rows = snapshot
    .getIn(['data', 'index_names'], emptyList)
    .toArray()
    .map((name, i) => {
      return {
        key: name,
        name,
        timeConfig,
        snapshotId,
        shards: shards.get(i),
        replicas: replicas.get(i)
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.elasticsearchCluster.dashboard.indexDetailsWithCount', { count: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <Fragment>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['index.' + row.name + '.document_count', 'index.' + row.name + '.deleted_count'],
          labels: [
            t('in-forge:plugins.elasticsearchCluster.dashboard.documents'),
            t('in-forge:plugins.elasticsearchCluster.dashboard.deletions')
          ],
          formatter: withSiMultiplyPrefixZeroDecimalPlaces,
          tooltipFormatter: zeroDecimalPlaces,
          type: 'line'
        }}
        y2={{
          metrics: ['index.' + row.name + '.size', 'clusterState.indices.' + row.name + '.indexMetadataSize'],
          labels: [
            t('in-forge:plugins.elasticsearchCluster.dashboard.size'),
            t('in-forge:plugins.elasticsearchCluster.dashboard.metadataSize')
          ],
          formatter: bytesZeroDecimalPlaces,
          tooltipFormatter: bytesTwoDecimalPlaces,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['index.' + row.name + '.query_total'],
          labels: [t('in-forge:plugins.elasticsearchCluster.dashboard.queries')],
          formatter: number.compact,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </Fragment>
  );
}
