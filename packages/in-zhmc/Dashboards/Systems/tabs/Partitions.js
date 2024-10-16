/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { percentage } from 'in-services/formatters/number';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const version = ['2.14.0', '2.15.0'];
const cols = [
  {
    title: t('in-zhmc:dashboards.name'),
    id: 'name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.processorUsage'),
    id: 'processorUsage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartitions.${row.key}.processor`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.cp'),
    id: 'cp',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartitions.${row.key}.cpProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.ifl'),
    id: 'ifl',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartitions.${row.key}.iflProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.icf'),
    id: 'icf',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartitions.${row.key}.icfProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.iip'),
    id: 'iip',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartitions.${row.key}.iipProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.cbp'),
    id: 'cbp',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartitions.${row.key}.cbpProcessorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.lparPowerConsumption'),
    id: 'lparPowerConsumption',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartitions.${row.key}.lparPowerConsumption`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const dpmcols = [
  {
    title: t('in-zhmc:dashboards.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.processorUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `partitions.${row.key}.processorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.networkUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `partitions.${row.key}.networkUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.storageUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `partitions.${row.key}.storageUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.acceleratorUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `partitions.${row.key}.acceleratorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.cryptoUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `partitions.${row.key}.cryptoUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function Partitions({ data, timeConfig }) {
  if (data.dpmEnabled === 'false') {
    const rows = [
      ...data.partitions.map(partition => {
        return {
          key: partition,
          partition,
          timeConfig,
          data
        };
      })
    ];

    if (rows.length === 0) {
      return null;
    }

    return (
      <Table
        cardTitle={t('in-zhmc:dashboards.logicalPartition')}
        withoutPadding
        cols={version.includes(data.hmcVersion) ? cols : cols.filter(col => col.id !== 'cbp')}
        rows={rows}
        getRowDetails={getRowDetails}
        initialSortDirection="desc"
      />
    );
  } else {
    const rows = [
      ...data.partitions.map(partition => {
        return {
          key: partition,
          partition,
          timeConfig,
          data
        };
      })
    ];

    if (rows.length === 0) {
      return null;
    }

    return (
      <Table
        cardTitle={t('in-zhmc:dashboards.partition')}
        withoutPadding
        cols={dpmcols}
        rows={rows}
        initialSortDirection="desc"
      />
    );
  }
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.data.id}
      timeConfig={row.timeConfig}
      y1={{
        metrics: [`logicalPartitions.${row.key}.lparPowerConsumption`],
        labels: [t('in-zhmc:dashboards.lparPowerConsumption')],
        type: 'stackedArea'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
