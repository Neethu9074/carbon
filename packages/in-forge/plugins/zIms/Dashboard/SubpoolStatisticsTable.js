/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, bytes, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zIms.subpoolStatistics.subpoolNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.subpoolStatistics.bufferCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `sub_pool_statistics.${row.key}.buffer_count`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.subpoolStatistics.bufferSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `sub_pool_statistics.${row.key}.buffer_size`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.subpoolStatistics.totalStorage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `sub_pool_statistics.${row.key}.total_storage`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.subpoolStatistics.prefixPagefixed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subPool.get('prefix_pagefixed');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.subpoolStatistics.bufferPagefixed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subPool.get('buffer_pagefixed');
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'SubpoolStatisticsRawData', props.timeConfig)
    };
  },
  function SubpoolStatisticsTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const subPools = data.get('raw_payload');
    if (subPools.size === 0) {
      return null;
    }

    const rows = subPools
      .map((subPool, key) => {
        return {
          key,
          subPool,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zIms.subpoolStatistics.title')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['sub_pool_statistics.' + row.key + '.subpool_hit_ratio'],
          labels: [t('in-forge:plugins.zIms.subpoolStatistics.subpoolHitRatio')],
          type: 'line',
          formatter: percentageZeroDecimalPlaces
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
