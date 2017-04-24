import React from 'react';

import { percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import Table from 'in-sdk/components/dashboard/Table';
import { getLabel } from 'in-sdk/snapshot';
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
    type: 'string',
    typeArgs: {
      getValue(row) {
        return (
          <HierarchicalLink snapshotId={row.node.get('id')} calculateHierarchy kind="dark">
            {getLabel(row.node)}
          </HierarchicalLink>
        );
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
        return `count`;
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
        return `msTwoDecimalPlaces`;
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Error Rate',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.node.get('id');
      },
      getMetricName() {
        return `error_rate`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      nodes: props.dataStream
    };
  },
  function LogicalEntityTable({ nodes, title, getRowDetails, timeframe }) {
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
      <DashboardSection title={`${title} (${nodes.length})`}>
        <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
      </DashboardSection>
    );
  }
);
