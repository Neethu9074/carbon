/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { bytesTwoDecimalPlaces, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.varnish.titleUsedSpace'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `mse_bytes`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.varnish.titleFreeSpace'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `mse_space`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.varnish.titleSpareNodes'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `mse_sparenode`;
      },
      getContent: withSiPrefixThreeDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MseTable({ snapshot, timeConfig }) {
  const rows = [
    {
      key: 'mse_detail',
      timeConfig,
      snapshotId: snapshot.get('id')
    }
  ];
  return <Table withoutPadding cardTitle={t('in-forge:plugins.varnish.titleDetails')} cols={cols} rows={rows} />;
}
