/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { megaBytes, percentagePlain } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

interface DatasourcesTableProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

interface Row {
  key: string;
  diskList: Map<string, string | number>;
  timeConfig: TimeConfig;
  snapshotId: string;
}

const healthStatusMap = new Map([
  [0, 'Good'],
  [1, 'Bad disk'],
  [2, 'Offline disk']
]);

const cols = [
  {
    title: t('in-forge:plugins.maprNode.diskName'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.diskList.get('diskName');
      }
    }
  },
  {
    title: t('in-forge:plugins.maprNode.totalSpace'),
    type: 'number',
    typeArgs: {
      getValue(row: Row) {
        return row.diskList.get('totalSpace');
      },
      getContent: megaBytes.detailed
    }
  },
  {
    title: t('in-forge:plugins.maprNode.usedSpace'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `metrics.diskList.${row.key}.usedSpace`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.maprNode.usedSpacePercent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `metrics.diskList.${row.key}.usedSpacePercent`;
      },
      getContent: percentagePlain.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.maprNode.availableSpace'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `metrics.diskList.${row.key}.availableSpace`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.maprNode.healthStatus'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `metrics.diskList.${row.key}.healthStatus`;
      },
      getContent(value: number) {
        return healthStatusMap.get(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.maprNode.mount'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.diskList.get('mount');
      }
    }
  },
  {
    title: t('in-forge:plugins.maprNode.fsType'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.diskList.get('fsType');
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeConfig }: DatasourcesTableProps) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'diskList'], emptyMap)
    .map((diskList: Object, key: string) => {
      return {
        key,
        diskList,
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
      cardTitle={t('in-forge:plugins.maprNode.diskList', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: Row) {
  return (
    <div>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: megaBytes.detailed,
            metrics: [`metrics.diskList.${row.key}.usedSpace`, `metrics.diskList.${row.key}.availableSpace`],
            labels: [t('in-forge:plugins.maprNode.usedSpace'), t('in-forge:plugins.maprNode.availableSpace')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: percentagePlain.detailed,
            metrics: [`metrics.diskList.${row.key}.usedSpacePercent`],
            labels: [t('in-forge:plugins.maprNode.usedSpacePercent')],
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
