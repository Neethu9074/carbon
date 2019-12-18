import { combineLatest } from 'reactive-observables';
import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

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
        return row.key;
      },
      getMetricName() {
        return '';
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
      let key = row.name;
      let consumerGroupTopicPair = key.split('#');
      return {
        key,
        consumerGroup: consumerGroupTopicPair[0],
        topic: consumerGroupTopicPair[1],
        node: row.node,
        timeConfig
      };
    });

    return <Table withoutPadding cardTitle={`Consumer Group/Topic Lags`} cols={cols} rows={rows} />;
  }
);
