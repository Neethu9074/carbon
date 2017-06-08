import React from 'react';

import { percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Health',
    type: 'health',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      }
    }
  },
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      }
    }
  },
  {
    title: 'Calls',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      },
      getMetricName() {
        return 'count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Latency',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      },
      getMetricName() {
        return 'duration.mean';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const colsWithErrorRate = cols.concat({
  title: 'Error Rate',
  type: 'sparkChart',
  typeArgs: {
    getSnapshotId(row) {
      return row.node.get('id');
    },
    getMetricName() {
      return 'error_rate';
    },
    getContent: percentageTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
});

export default connectTo(
  props => {
    return {
      nodes: props.dataStream
    };
  },
  function LogicalEntityTable({ nodes, title, getRowDetails, timeframe, withoutErrorRate }) {
    if (!nodes || nodes.length === 0) {
      return null;
    }

    const rows = nodes.map(node => {
      return {
        key: node.get('id'),
        timeframe,
        node
      };
    });

    return (
      <DashboardSection title={`${title} (${rows.length})`}>
        <Table cols={withoutErrorRate ? cols : colsWithErrorRate} rows={rows} getRowDetails={getRowDetails} />
      </DashboardSection>
    );
  }
);
