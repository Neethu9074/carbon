/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zDb2.lockContentions.planConnection'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zDb2.lockContentions.planName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.lockContention.get('plan_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.zDb2.lockContentions.lockElapsedTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `DB2_Lock_Contentions.${row.key}.lock_elapsed_time`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'LockContentionsRawData', props.timeConfig)
    };
  },
  function LockContentionsTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const lockContentions = data.get('raw_payload');
    if (lockContentions.size === 0) {
      return null;
    }

    const rows = lockContentions
      .map((lockContention, key) => {
        return {
          key,
          lockContention,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zDb2.lockContentions.title', { len: rows.length })}
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
          metrics: ['DB2_Lock_Contentions.' + row.key + '.lock_elapsed_time'],
          labels: [t('in-forge:plugins.zDb2.lockContentions.lockElapsedTime')],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
