/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, bytes } from 'in-services/formatters/number';
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
    title: t('in-phmc:dashboards.utilized'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `vios.${row.key}.utilizedMem`;
      },
      getContent: bytes.detailed,
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
        return `vios.${row.key}.maxVirtualProcessors`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function Vios({ data, timeConfig }) {
  const rows = [
    ...data.vios.map(flag => {
      return {
        key: flag,
        flag,
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
      cardTitle={t('in-phmc:dashboards.vios')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
    />
  );
}

