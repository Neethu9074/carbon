import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytesTwoDecimalPlaces, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Used Space',
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
    title: 'Free Space',
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
    title: 'Spare Nodes',
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
  return (
    <DashboardSection title="Details">
      <Table cols={cols} rows={rows} />
    </DashboardSection>
  );
}
