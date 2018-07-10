import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

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
    title: 'Messages Current Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'jmsDestinations.' + row.key + '.messagesCurrentCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages Pending Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'jmsDestinations.' + row.key + '.messagesPendingCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Messages Received Count',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'jmsDestinations.' + row.key + '.messagesReceivedCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function JMSDestinationsTable({ snapshot, timeConfig }) {
  const jmsDestinationNames = snapshot.getIn(['data', 'jmsDestinationNames'], emptyList);
  if (jmsDestinationNames.size === 0) {
    return null;
  }

  const rows = jmsDestinationNames.toArray().map(key => {
    return {
      key,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <DashboardSection title={`JMS Destinations (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: [
            'jmsDestinations.' + row.key + '.messagesCurrentCount',
            'jmsDestinations.' + row.key + '.messagesPendingCount',
            'jmsDestinations.' + row.key + '.messagesReceivedCount'
          ],
          labels: ['Messages Current Count', 'Messages Pending Count', 'Messages Received Count'],
          type: 'line'
        }}
      />
    </div>
  );
}
