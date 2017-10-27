import { combineLatest } from 'reactive-observables';

import { getLogicalConnections } from 'in-services/logicalConnections';
import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { nothing, alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';

// terminology is:
// incoming => middle => outgoing
//
// The terms node and link stem from the Sankey terminology

export const sizeByLatency = 'latency';
export const sizeByCalls = 'calls';

const errorRateColor = preval`
module.exports = require('tinygradient')('#ddd', 'ffde00', '#ff4229').hsv(10).map(c => '#' + c.toHex());
`;

export const getData = memoize(getDataInternal, ({ snapshot, sizeBy }) => `${snapshot.get('id')}_${sizeBy}`);
function getDataInternal({ snapshot, sizeBy }) {
  const middleId = snapshot.get('id');
  const middleNode = {
    id: middleId,
    label: getLabel(snapshot),
    snapshot,
    color: errorRateColor[0]
  };

  return getLogicalConnections(middleId)
    .flatMap(connections => turnConnectionsIntoSankeyChartData(connections, middleNode, sizeBy))
    .throttle(500);
}

function turnConnectionsIntoSankeyChartData(connections, middleNode, sizeBy) {
  return combineLatest(
    connections.map(connection => getConnectionDetails({ connection, middleNode, sizeBy })),
    false
  ).map(connectionData => {
    const resultingData = {
      nodes: [middleNode],
      links: []
    };

    for (let i = 0, length = connectionData.length; i < length; i++) {
      const data = connectionData[i];
      if (data != null) {
        resultingData.nodes.push(data.node);
        resultingData.links.push(data.link);
      }
    }

    return resultingData;
  });
}

const getConnectionDetails = memoize(getConnectionDetailsInternal, getConnectionDetailsId);

function getConnectionDetailsId({ connection, middleNode, sizeBy }) {
  return `${connection.get('connectionSnapshotId')}_${middleNode.id}_${sizeBy}`;
}

function getConnectionDetailsInternal({ connection, middleNode, sizeBy }) {
  const otherSnapshotId = connection.get('otherSideSnapshotId');
  const connectionSnapshotId = connection.get('connectionSnapshotId');
  const direction = connection.get('direction');

  const node = {
    id: otherSnapshotId
  };
  const link = {
    source: direction === 'INCOMING' ? otherSnapshotId : middleNode.id,
    target: direction === 'OUTGOING' ? otherSnapshotId : middleNode.id
  };
  const nodeAndLink = { node, link };

  // self-referencing services are not supported in the Sankey
  if (link.source === link.target) {
    return nothing;
  }

  return (
    combineLatest([
      // handle unknown services
      otherSnapshotId === '' ? alwaysNull : getSnapshot(otherSnapshotId),

      getTimeWindowBasedMetricAggregation({
        snapshotId: connectionSnapshotId,
        metric: 'count',
        timeWindowAggregation: 'sum'
      })
        .startWith(0)
        .distinct(),

      getTimeWindowBasedMetricAggregation({
        snapshotId: connectionSnapshotId,
        metric: 'duration.mean',
        timeWindowAggregation: 'mean'
      })
        .startWith(null)
        .distinct(),

      getTimeWindowBasedMetricAggregation({
        snapshotId: connectionSnapshotId,
        metric: 'error_rate',
        timeWindowAggregation: 'mean'
      })
        .startWith(null)
        .distinct()
    ])
      .map(([snapshot, calls, latency, errorRate]) => {
        const color = errorRateColor[Math.round(errorRate * 9)];

        if (snapshot) {
          node.label = getLabel(snapshot);
          node.snapshot = snapshot;
        } else {
          node.label = 'Unknown';
        }
        node.color = color;

        link.color = color;
        link.errorRate = errorRate;
        link.calls = calls;
        link.latency = latency;
        if (sizeBy === sizeByCalls) {
          link.value = Math.round(calls);
        } else {
          link.value = Math.round(latency);
        }

        return nodeAndLink;
      })
      // links with a value of 0 will result in errors in the Sankey
      .filter(({ link }) => link.value > 0)
  );
}
