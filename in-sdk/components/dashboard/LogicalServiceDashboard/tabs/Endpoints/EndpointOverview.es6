import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { number, millis, percentage } from 'in-services/formatters/number';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'link',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getSubDashboardLink(`/endpoints/${row.key}`).map(href => ({
          href,
          value: row.key,
          label: row.key
        }));
      }
    }
  },
  {
    title: 'Calls (sum)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.metricPrefix}count`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Latency (avg)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.metricPrefix}duration.mean`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Error Rate (avg)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.metricPrefix}error_rate`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function EndpointOverview({ snapshot }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'service_endpoints'], emptyList)
    .toArray()
    .map(endpoint => {
      return {
        snapshotId,
        key: endpoint,
        endpoint,
        metricPrefix: `endpoint.${endpoint}.`
      };
    });

  return (
    <MaxWidthFullscreenContainer>
      <DashboardTile title={`Endpoints (${rows.length})`}>
        <Table cols={cols} rows={rows} />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
