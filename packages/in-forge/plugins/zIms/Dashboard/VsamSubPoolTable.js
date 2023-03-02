/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { bytes, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zIms.vsamSubpools.subPoolNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.vsamSubpools.poolNames'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vsamSubPoolKey.get('pool_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.vsamSubpools.poolType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vsamSubPoolKey.get('pool_type');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.vsamSubpools.bufferSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `vsam_sub_pools.${row.key}.buffer_size`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.vsamSubpools.bufferPagefixed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vsamSubPoolKey.get('buffers_page_fixed');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.vsamSubpools.blocksPagefixed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vsamSubPoolKey.get('blocks_page_fixed');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.vsamSubpools.usingHiperspace'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vsamSubPoolKey.get('using_hiperspace');
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'VsamSubpoolRawData', props.timeConfig)
    };
  },
  function VsamSubPoolTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const vsamSubPoolKeys = data.get('raw_payload');
    if (vsamSubPoolKeys.size === 0) {
      return null;
    }

    const rows = vsamSubPoolKeys
      .map((vsamSubPoolKey, key) => {
        return {
          key,
          vsamSubPoolKey,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zIms.vsamSubpools.title')}
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
          metrics: ['vsam_sub_pools.' + row.key + '.subpool_hit_ratio'],
          labels: [t('in-forge:plugins.zIms.vsamSubpools.subPoolHitRatio')],
          type: 'line',
          formatter: percentageZeroDecimalPlaces
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
