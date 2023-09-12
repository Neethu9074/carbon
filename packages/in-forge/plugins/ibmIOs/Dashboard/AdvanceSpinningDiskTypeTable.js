/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, percentage } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.resourceName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.spinningDiskTypeRawData.get('resourceName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.unitNumber'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.spinningDiskTypeRawData.get('unitNumber');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.aspNumber'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.spinningDiskTypeRawData.get('aspNumber');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.elapsedIORequests'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.spinningDiskTypeRawData.get('elapsedIORequests');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.elapsedRequestSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.spinningDiskTypeRawData.get('elapsedRequestSize');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.diskType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.spinningDiskTypeRawData.get('diskType');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.diskModel'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.spinningDiskTypeRawData.get('diskModel');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.unitMediaCapacityGb'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSpinningDiskTypeMetrics.${row.key}.unitMediaCapacityGb`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.percentUsed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSpinningDiskTypeMetrics.${row.key}.percentUsed`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'advanceSpinningDiskTypeRawPayload')
    };
  },
  function AdvanceSpinningDiskTypeTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const advanceSpinningDiskTypeRawPayload = data.get('raw_payload');
    if (advanceSpinningDiskTypeRawPayload.size === 0) {
      return null;
    }

    const rows = advanceSpinningDiskTypeRawPayload
      .map((spinningDiskTypeRawData, key) => {
        return {
          key,
          spinningDiskTypeRawData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.name')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={6}
        initialSortDirection="desc"
        getRowDetails={getRowDetails}
      />
    );
  }
);

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: percentage.compact,
          metrics: ['advanceSpinningDiskTypeMetrics.' + row.key + '.elapsedPercentBusy'],
          labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.charts.elapsedPercentBusy')],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
