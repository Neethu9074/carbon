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
        return `processors.${row.key}.processorUsage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.smt'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `processors.${row.key}.smtUsage`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.thread0'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `processors.${row.key}.thread0Usage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.thread1'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `processors.${row.key}.thread1Usage`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function Processors({ data, timeConfig }) {
  const rows = [
    ...data.processors.map(processor => {
      return {
        key: processor,
        processor,
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
      cardTitle={t('in-zhmc:dashboards.processorUsage')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
    />
  );
}
