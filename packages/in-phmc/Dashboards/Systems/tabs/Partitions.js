/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, percentage, bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-phmc:dashboards.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-phmc:dashboards.backedPhysicalMem'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.backedPhysicalMem`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-phmc:dashboards.entitledProcUnits'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.entitledProcUnits`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-phmc:dashboards.maxVirtualProcessors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.maxVirtualProcessors`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-phmc:dashboards.currentVirtualProcessors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `logicalPartition.${row.key}.currentVirtualProcessors`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function Partitions({ data, timeConfig }) {
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
      cardTitle={t('in-phmc:dashboards.logicalPartition')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
    />
  );
}
