import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Table from 'in-sdk/components/dashboard/Table';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';

const cols = [
  {
    title: 'Labels',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('labels', emptyList).join(', ');
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('state');
      }
    }
  },
  {
    title: 'Rack',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('rack');
      }
    }
  },
  {
    title: 'Http Address',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('httpAddress');
      }
    }
  },
  {
    title: 'Last Health Update',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.node.get('lastHealthUpdate');
      },
      getContent: formatDateTime
    }
  },
  {
    title: 'Health Report',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.node.get('healthReport');
      }
    }
  },
  {
    title: 'Containers Running',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.${row.node.get('id')}.containers`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Available',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.${row.node.get('id')}.memoryAvailable`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Virtual Cores Available',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.${row.node.get('id')}.virtualCoresAvailable`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NodesTable({ snapshot, timeframe }) {
  const nodes = snapshot.getIn(['data', 'nodes.nodeList'], emptyList);
  if (nodes.size === 0) {
    return null;
  }

  const rows = nodes
    .map(node => {
      return {
        key: node.get('id'),
        node,
        timeframe,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <DashboardSection title="Nodes">
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  const leftMarginSize = 60;
  const id = row.node.get('id');
  return (
    <div>
      <ChartWithLegend
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: leftMarginSize
        }}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['nodes.' + id + '.containers'],
          labels: ['Containers Running'],
          type: 'stackedArea'
        }}
      />
      <TwoColumnRow>
        <ChartWithLegend
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: leftMarginSize
          }}
          y1={{
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['nodes.' + id + '.memoryUsed', 'nodes.' + id + '.memoryAvailable'],
            labels: ['Memory Used', 'Memory Available'],
            type: 'stackedArea'
          }}
        />
        <ChartWithLegend
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          margins={{
            left: leftMarginSize
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['nodes.' + id + '.virtualCoresUsed', 'nodes.' + id + '.virtualCoresAvailable'],
            labels: ['Virtual Cores Used', 'Virtual Cores Available'],
            type: 'stackedArea'
          }}
        />
      </TwoColumnRow>
    </div>
  );
}
