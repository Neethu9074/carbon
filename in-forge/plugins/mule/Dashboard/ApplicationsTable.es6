import React from 'react';

const formatBoolean = value => (value ? 'Yes' : 'No');

import { emptyList } from 'in-services/fixedImmutables';
import Chart from 'in-components/Chart';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import { withSiMultiplyPrefixZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

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
        return formatBoolean(row.config.get('containerMode'));
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
      getContent: function(value) {
        return value;
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
      getContent: function(value) {
        return value;
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
      getContent: function(value) {
        return value;
      }
    }
  }
];

export default function FlowsTableApplicationsTable({ snapshot, timeframe }) {
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
      margins={{
        left: 40,
        right: 40
      }}
      y1={{
        metrics: ['applications.' + row.key + '.processedEvents', 'applications.' + row.key + '.avgProcessingTime'],
        labels: ['Processed events', 'Average processing time'],
        formatter: withSiMultiplyPrefixZeroDecimalPlaces,
        tooltipFormatter: zeroDecimalPlaces,
        type: 'line'
      }}
      y2={{
        metrics: ['applications.' + row.key + '.executionErrors', 'applications.' + row.key + '.fatalErrors'],
        labels: ['Execution errors', 'Fatal errors'],
        formatter: zeroDecimalPlaces,
        type: 'line'
      }}
    />
  );
}
