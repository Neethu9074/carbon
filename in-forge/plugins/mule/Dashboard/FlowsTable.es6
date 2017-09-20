import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import Chart from 'in-components/Chart';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import { withSiMultiplyPrefixZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

const cols = [
  {
    title: 'Application name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.appName;
      }
    }
  },
  {
    title: 'Flow name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.flowName;
      }
    }
  }
];

export default function FlowsTable({ snapshot, timeframe }) {
  const data = snapshot.get('data');
  const rows = data
    .getIn(['flowNames'], emptyList)
    .map(key => {
      const separatorIndex = key.indexOf('_');
      const appName = key.substring(0, separatorIndex);
      const flowName = key.substring(separatorIndex + 1);
      return {
        key,
        snapshotId: snapshot.get('id'),
        timeframe: timeframe,
        appName,
        flowName
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Flows (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 40,
        right: 40
      }}
      y1={{
        metrics: ['flows.' + row.key + '.processedEvents', 'flows.' + row.key + '.avgProcessingTime'],
        labels: ['Processed events', 'Average processing time'],
        formatter: withSiMultiplyPrefixZeroDecimalPlaces,
        tooltipFormatter: zeroDecimalPlaces,
        type: 'line'
      }}
      y2={{
        metrics: ['flows.' + row.key + '.executionErrors', 'flows.' + row.key + '.fatalErrors'],
        labels: ['Execution errors', 'Fatal errors'],
        formatter: zeroDecimalPlaces,
        type: 'line'
      }}
    />
  );
}
