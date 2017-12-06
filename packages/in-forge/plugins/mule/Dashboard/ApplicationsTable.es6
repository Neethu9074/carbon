import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, millis } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Container Mode',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.config.get('containerMode'));
      }
    }
  },
  {
    title: 'Shutdown Timeout',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('shutdownTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  },
  {
    title: 'Synchronous Event Timeout',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('synchronousEventTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  },
  {
    title: 'Transaction Timeout',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('transactionTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  }
];

export default function ApplicationsTable({ snapshot, timeframe }) {
  const data = snapshot.get('data');
  const rows = data
    .getIn(['configurations'], emptyList)
    .map((config, key) => {
      const app = data.getIn(['applications', key], emptyList);
      return {
        key,
        snapshotId: snapshot.get('id'),
        timeframe: timeframe,
        config,
        app
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Applications (${rows.length})`}>
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
        metrics: [
          'applications.' + row.key + '.processedEvents',
          'applications.' + row.key + '.executionErrors',
          'applications.' + row.key + '.fatalErrors'
        ],
        labels: ['Processed events', 'Execution errors', 'Fatal errors'],
        formatter: zeroDecimalPlaces,
        tooltipFormatter: zeroDecimalPlaces,
        type: 'line'
      }}
      y2={{
        metrics: ['applications.' + row.key + '.avgProcessingTime'],
        labels: ['Average processing time'],
        formatter: millis.fixedCompact,
        type: 'line'
      }}
    />
  );
}
