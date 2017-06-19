import React from 'react';

import JumpToTracesTouchingServiceEndpointButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceEndpointButton';
import PageCharts from 'in-forge/plugins/browserLogicalService/Dashboard/PageCharts';
import ErrorTable from 'in-forge/plugins/browserLogicalService/Dashboard/ErrorTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getLabel } from 'in-sdk/snapshot';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Page Loads',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.name}.count`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'adjustedCount';
      }
    }
  },
  {
    title: 'Page Load Time (95th)',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.name}.duration.95th`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'XHR / AJAX Calls',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.name}.xhrCalls`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'adjustedCount';
      }
    }
  },
  {
    title: 'Uncaught errors',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `endpoint.${row.name}.uncaughtErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'adjustedCount';
      }
    }
  },
  {
    title: 'Traces',
    type: 'custom',
    disableSorting: true,
    typeArgs: {
      get(row) {
        return {
          value: row.name,
          content: <JumpToTracesTouchingServiceEndpointButton snapshotId={row.snapshotId} label={row.name} />
        };
      }
    }
  }
];

export default function Endpoints({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const websiteLabel = getLabel(snapshot);

  const hashes = snapshot.getIn(['data', 'service_endpoint_hashes'], emptyList);
  const rows = snapshot.getIn(['data', 'service_endpoints'], emptyList).toArray().map((name, i) => {
    const hash = hashes.get(i);
    return {
      key: hash,
      name,
      hash,
      snapshotId,
      websiteLabel,
      timeframe
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Pages (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <PageCharts snapshotId={row.snapshotId} timeframe={row.timeframe} metricPrefix={`endpoint.${row.name}.`} />
      <ErrorTable
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        websiteLabel={row.websiteLabel}
        pageLabel={row.name}
        pageHash={row.hash}
      />
    </div>
  );
}
