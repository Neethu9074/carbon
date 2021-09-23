/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from '../../../PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage, bytes } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const stateFormatter = state => {
  switch (state) {
    case 0:
      return 'NONE';
    case 1:
      return 'ACTIVE';
    case 2:
      return 'INACTIVE';
    case 3:
      return 'VARIED_OFF';
    case 4:
      return 'VARIED_ON';
    default:
      return '-';
  }
};

const typeFormatter = type => {
  switch (type) {
    case 10:
      return 'SYSTEM';
    case 11:
      return 'PRIMARY';
    case 12:
      return 'SECONDARY';
    case 13:
      return 'UDFS';
    case 14:
      return 'USER';
    default:
      return '-';
  }
};

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.aspNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.aspInfoName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.aspInfoStringData.get('aspInfoName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.aspInfoType'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `aspInfoMetrics.${row.key}.aspInfoType`;
      },
      getContent: typeFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.aspInfoState'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `aspInfoMetrics.${row.key}.aspInfoState`;
      },
      getContent: stateFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.disks'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `aspInfoMetrics.${row.key}.disks`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function AspTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'aspInfoStringMap'], emptyMap)
    .map((aspInfoStringData, key) => {
      return {
        key,
        aspInfoStringData,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.name')}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: bytes.detailed,
          metrics: [
            'aspInfoMetrics.' + row.key + '.totalCapacity',
            'aspInfoMetrics.' + row.key + '.protectedCapacity',
            'aspInfoMetrics.' + row.key + '.unprotectedCapacity'
          ],
          labels: [
            t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.storage.totalCapacity'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.storage.protectedCapacity'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.storage.unprotectedCapacity')
          ],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: percentage.compact,
          metrics: [
            'aspInfoMetrics.' + row.key + '.totalCapacityUtilization',
            'aspInfoMetrics.' + row.key + '.protectedCapacityUtilization',
            'aspInfoMetrics.' + row.key + '.unprotectedCapacityUtilization'
          ],
          labels: [
            t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.utilization.totalCapacityUtilization'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.utilization.protectedCapacityUtilization'),
            t('in-forge:plugins.ibmIOs.dashboard.tables.aspInfos.charts.utilization.unprotectedCapacityUtilization')
          ],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
