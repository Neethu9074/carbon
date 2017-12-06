import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, millis } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.flowName;
      }
    }
  },
  {
    title: 'Application',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.appName;
      }
    }
  }
];

export default function FlowsTable({ snapshot, timeframe }) {
  const data = snapshot.get('data');
  const rows = data
    .getIn(['flowNames'], emptyMap)
    .map((appName, flowName) => {
      return {
        key: appName + '_' + flowName,
        appName,
        flowName,
        snapshotId: snapshot.get('id'),
        timeframe: timeframe
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
      y1={{
        min: 0,
        metrics: [
          'flows.' + row.key + '.processedEvents',
          'flows.' + row.key + '.executionErrors',
          'flows.' + row.key + '.fatalErrors'
        ],
        labels: ['Processed events', 'Execution errors', 'Fatal errors'],
        formatter: zeroDecimalPlaces,
        tooltipFormatter: zeroDecimalPlaces,
        type: 'line'
      }}
      y2={{
        min: 0,
        metrics: ['flows.' + row.key + '.avgProcessingTime'],
        labels: ['Average processing time'],
        formatter: millis.fixedCompact,
        type: 'line'
      }}
    />
  );
}
