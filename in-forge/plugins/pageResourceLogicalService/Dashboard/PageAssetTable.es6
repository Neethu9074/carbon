import React from 'react';

import JumpToTracesTouchingServiceEndpointButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceEndpointButton';
import { msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import PageAssetCharts from 'in-forge/plugins/pageResourceLogicalService/Dashboard/PageAssetCharts';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Initiator',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Requests',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.key}.count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'adjustedCount';
      }
    }
  },
  {
    title: 'Latency',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.key}.duration.mean`;
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Traces',
    type: 'custom',
    disableSorting: true,
    typeArgs: {
      comparator: () => 0,
      get(row) {
        return {
          value: row.key,
          content: <JumpToTracesTouchingServiceEndpointButton snapshotId={row.snapshotId} label={row.key} />
        };
      }
    }
  }
];

export default function PageAssetTable({ snapshot, timeframe }) {
  const rows = snapshot.getIn(['data', 'service_endpoints'], emptyList).toArray().map(endpointName => {
    return {
      key: endpointName,
      snapshotId: snapshot.get('id'),
      timeframe: timeframe
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Assets (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return <PageAssetCharts snapshotId={row.snapshotId} timeframe={row.timeframe} prefix={`endpoint.${row.key}.`} />;
}
