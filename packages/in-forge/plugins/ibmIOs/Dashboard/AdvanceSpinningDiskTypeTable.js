/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number, percentage, bytes } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const ProtectionStatusEnum = protectionStatus => {
  switch (protectionStatus) {
    case 0:
      return 'ACTIVE';
    case 1:
      return 'BUSY';
    case 2:
      return 'DEGRADED';
    case 3:
      return 'FAILED';
    case 4:
      return 'HARDWARE_FAILURE';
    case 5:
      return 'NOT_READY';
    case 6:
      return 'PARITY_REBUILD';
    case 7:
      return 'POWER_LOSS';
    case 8:
      return 'READ_WRITE_PROTECTED';
    case 9:
      return 'RESUME';
    case 10:
      return 'RESUME_PENDING';
    case 11:
      return 'SUSPEND';
    case 12:
      return 'UNKNOWN';
    case 13:
      return 'UNPROTECTED';
    case 14:
      return 'WRITE_PROTECTED';
    default:
      return '-';
  }
};

const RaidTypeEnum = raidType => {
  switch (raidType) {
    case 1:
      return 'RAID5';
    case 2:
      return 'RAID6';
    case 3:
      return 'RAID10';
    default:
      return '-';
  }
};

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
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSpinningDiskTypeMetrics.${row.key}.unitNumber`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.aspNumber'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSpinningDiskTypeMetrics.${row.key}.aspNumber`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
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
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.unitStorageCapacity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSpinningDiskTypeMetrics.${row.key}.unitStorageCapacity`;
      },
      getContent: bytes.detailed,
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
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.raidType'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSpinningDiskTypeMetrics.${row.key}.raidType`;
      },
      getContent: RaidTypeEnum,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.protectionStatus'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `advanceSpinningDiskTypeMetrics.${row.key}.protectionStatus`;
      },
      getContent: ProtectionStatusEnum,
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
          formatter: number.compact,
          metrics: ['advanceSpinningDiskTypeMetrics.' + row.key + '.elapsedIoRequests'],
          labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.charts.elapsedIoRequests')],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: bytes.detailed,
          metrics: ['advanceSpinningDiskTypeMetrics.' + row.key + '.elapsedRequestSize'],
          labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.spinningDiskType.charts.elapsedRequestSize')],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: percentage.detailed,
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
