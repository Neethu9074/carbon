/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
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
        return `logicalPartitions.${row.key}.processor`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.zvm'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartitions.${row.key}.zvmPagingRate`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.cp'),
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
        cols={cols}
        rows={rows}
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
