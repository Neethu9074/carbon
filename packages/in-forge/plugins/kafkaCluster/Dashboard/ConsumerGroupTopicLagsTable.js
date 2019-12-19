import { combineLatest } from 'reactive-observables';
import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import DashboardSection from '../../../../in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

const cols = [
  {
    title: 'Consumer Group',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.consumerGroup;
      }
    }
  },
  {
    title: 'Topic',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topic;
      }
    }
  },
  {
    title: 'Lag',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `broker.lagData.data.${row.key}.lag`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.clusterSnapshotId)
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function ConsumerGroupTopicLagsTable({ clusterNodes, timeConfig }) {
    if (clusterNodes == null || clusterNodes.length === 0) {
      return null;
    }

    let rows = [];
    clusterNodes.map(node => {
      node.getIn(['data', 'broker.lagData.itemsNames'], emptyList).map(name => {
        rows.push({ name, node });
      });
    });

    rows = rows.map(row => {
      let [consumerGroup, topic] = row.name.split('#');
      return {
        key: row.name,
        snapshotId: row.node.get('id'),
        node: row.node,
        consumerGroup,
        topic,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={`Consumer Group/Topic Lags`}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return (
    <DashboardSection title="Lag">
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          tooltipFormatter: zeroDecimalPlaces,
          metrics: [`broker.lagData.data.${row.key}.lag`],
          labels: ['Messages Count'],
          type: 'line'
        }}
      />
    </DashboardSection>
  );
}
