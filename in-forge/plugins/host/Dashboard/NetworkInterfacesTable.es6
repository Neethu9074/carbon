import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart'
import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import {
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Interface',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Mac',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.iface.get('mac');
      }
    }
  },
  {
    title: 'IPs',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.iface.get('addresses', emptyList).map(address => address.get('ip')).join(', ');
      }
    }
  },
  {
    title: 'RX Bytes',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ifs.${row.name}.rx.bytes`;
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'RX Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ifs.${row.name}.rx.errors`;
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'TX Bytes',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ifs.${row.name}.tx.bytes`;
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'TX Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ifs.${row.name}.tx.errors`;
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NetworkInterfacesTable({ snapshot, timeframe }) {
  const rows = snapshot
    .getIn(['data', 'interfaces'], emptyMap)
    .map((iface, name) => {
      return {
        key: name,
        name,
        iface,
        snapshotId: snapshot.get('id'),
        timeframe
      };
    })
    .valueSeq()
    .toArray();

  return (
    <DashboardSection title="Network Interfaces">
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
        left: 80,
        right: 80
      }}
      y1={{
        min: 0,
        formatter: bytesZeroDecimalPlaces,
        tooltipFormatter: bytesTwoDecimalPlaces,
        metrics: ['ifs.' + row.name + '.rx.bytes', 'ifs.' + row.name + '.tx.bytes'],
        labels: ['Received/s', 'Transmitted/s'],
        type: 'line'
      }}
      y2={{
        min: 0,
        max: 1,
        metrics: ['ifs.' + row.name + '.rx.errors', 'ifs.' + row.name + '.tx.errors'],
        labels: ['RX Errors', 'TX Errors'],
        formatter: percentageZeroDecimalPlaces,
        tooltipFormatter: percentageTwoDecimalPlaces,
        type: 'line'
      }}
    />
  );
}
