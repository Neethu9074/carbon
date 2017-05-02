import React from 'react';

import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { yesOrNo } from 'in-services/formatters/boolean';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Health check',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Healthy',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `healthcheck.${row.name}.healthy`;
      },
      getContent: yesOrNo,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Since',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `healthcheck.${row.name}.since`;
      },
      getContent(since) {
        return `${formatDateTime(since)} (${fromNowAccurately(since)})`;
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function HealthchecksTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot.getIn(['data', 'healthchecks'], emptyList).toArray().map(name => {
    return {
      key: name,
      name,
      snapshotId,
      timeframe
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Health checks (${rows.length})`}>
      <Table cols={cols} rows={rows} maxItemsPerPage={20} />
    </DashboardSection>
  );
}
