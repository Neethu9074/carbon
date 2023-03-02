/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zIms.poolUtilization.poolName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.poolUtilization.poolGroup'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.poolUtilizationJob.get('pool_group');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.poolUtilization.poolSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pool_utilization.${row.key}.pool_size`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.poolUtilization.freeSpace'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pool_utilization.${row.key}.free_space`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.poolUtilization.freeBlocks'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pool_utilization.${row.key}.free_blocks`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.poolUtilization.largestFreeBlock'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pool_utilization.${row.key}.largest_free_block`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.poolUtilization.currentStorageUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pool_utilization.${row.key}.current_storage_used`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'PoolUtilizationRawData', props.timeConfig)
    };
  },
  function poolUtilizationTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const poolUtilizationJobs = data.get('raw_payload');
    if (poolUtilizationJobs.size === 0) {
      return null;
    }

    const rows = poolUtilizationJobs
      .map((poolUtilizationJob, key) => {
        return {
          key,
          poolUtilizationJob,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zIms.poolUtilization.title')}
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
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: [
              'pool_utilization.' + row.key + '.pool_size',
              'pool_utilization.' + row.key + '.free_space',
              'pool_utilization.' + row.key + '.largest_free_block',
              'pool_utilization.' + row.key + '.current_storage_used'
            ],
            labels: [
              t('in-forge:plugins.zIms.poolUtilization.poolSize'),
              t('in-forge:plugins.zIms.poolUtilization.freeSpace'),
              t('in-forge:plugins.zIms.poolUtilization.largestFreeBlock'),
              t('in-forge:plugins.zIms.poolUtilization.currentStorageUsed')
            ],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['pool_utilization.' + row.key + '.free_blocks'],
            labels: [t('in-forge:plugins.zIms.poolUtilization.freeBlocks')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
