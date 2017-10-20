/* eslint-disable no-console */

import { combineLatest } from 'reactive-observables';
import { ResponsiveSankey } from 'nivo';
import React from 'react';

import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { logicalViewStructure$ } from 'in-stores/view';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

const errorRateColor = preval`
module.exports = require('tinygradient')('#ddd', '#ff4229').hsv(9).map(c => '#' + c.toHex());
`;

export default connectTo(
  props => {
    const snapshotId = props.snapshot.get('id');
    const theSelectedService = getLabel(props.snapshot);

    console.warn(
      'Do not rely on logical view structure! This is expensive to retrieve. Please use special subscriptions for this.'
    );
    const entity$ = logicalViewStructure$.map(root => {
      for (let i = 0, length = root.children.length; i < length; i++) {
        const item = root.children[i];
        if (item.id === snapshotId) {
          return item;
        }
      }
      return null;
    });

    const data$ = entity$
      .flatMap(viewStructureItem => {
        if (!viewStructureItem) {
          return alwaysEmptyArray;
        }

        let result = [];

        result = result.concat(
          viewStructureItem.outgoingConnections.map(connection => {
            const snapshot$ = getSnapshot(connection.otherId);
            const callCount$ = getTimeWindowBasedMetricAggregation({
              snapshotId: connection.id,
              metric: 'count',
              timeWindowAggregation: 'sum',
              timeframe: props.timeframe
            });
            const errorRate$ = getTimeWindowBasedMetricAggregation({
              snapshotId: connection.id,
              metric: 'error_rate',
              timeWindowAggregation: 'mean',
              timeframe: props.timeframe
            }).startWith(0);
            const otherErrorRate$ = getTimeWindowBasedMetricAggregation({
              snapshotId: connection.otherId,
              metric: 'error_rate',
              timeWindowAggregation: 'mean',
              timeframe: props.timeframe
            }).startWith(null);
            return combineLatest([
              snapshot$,
              callCount$,
              errorRate$,
              otherErrorRate$
            ]).map(([snapshot, callCount, errorRate, otherErrorRate]) => {
              otherErrorRate = otherErrorRate != null ? otherErrorRate : errorRate;
              return {
                connectionId: connection.id,
                direction: 'outgoing',
                label: getLabel(snapshot),
                callCount,
                errorRate,
                otherErrorRate,
                color: errorRateColor[Math.round(errorRate * 9)],
                otherColor: errorRateColor[Math.round(otherErrorRate * 9)]
              };
            });
          })
        );

        result = result.concat(
          viewStructureItem.incomingConnections.map(connection => {
            const snapshot$ = getSnapshot(connection.otherId);
            const callCount$ = getTimeWindowBasedMetricAggregation({
              snapshotId: connection.id,
              metric: 'count',
              timeWindowAggregation: 'sum',
              timeframe: props.timeframe
            });
            const errorRate$ = getTimeWindowBasedMetricAggregation({
              snapshotId: connection.id,
              metric: 'error_rate',
              timeWindowAggregation: 'mean',
              timeframe: props.timeframe
            }).startWith(0);
            const otherErrorRate$ = getTimeWindowBasedMetricAggregation({
              snapshotId: connection.otherId,
              metric: 'error_rate',
              timeWindowAggregation: 'mean',
              timeframe: props.timeframe
            }).startWith(null);
            return combineLatest([
              snapshot$,
              callCount$,
              errorRate$,
              otherErrorRate$
            ]).map(([snapshot, callCount, errorRate, otherErrorRate]) => {
              otherErrorRate = otherErrorRate != null ? otherErrorRate : errorRate;
              return {
                connectionId: connection.id,
                direction: 'incoming',
                label: getLabel(snapshot),
                callCount,
                errorRate,
                otherErrorRate,
                color: errorRateColor[Math.round(errorRate * 9)],
                otherColor: errorRateColor[Math.round(otherErrorRate * 9)]
              };
            });
          })
        );

        return combineLatest(result, false);
      })
      .map(connections => connections.filter(c => c && c.callCount > 0 && c.label !== theSelectedService))
      .map(connections => {
        const data = {
          nodes: connections.map(connection => {
            return {
              id: connection.label,
              color: connection.otherColor,
              errorRate: connection.otherErrorRate
            };
          }),
          links: connections.map(connection => {
            return {
              source: connection.direction === 'incoming' ? connection.label : theSelectedService,
              target: connection.direction === 'outgoing' ? connection.label : theSelectedService,
              value: Math.round(connection.callCount),
              errorRate: connection.errorRate,
              color: connection.color
            };
          })
        };

        data.nodes.push({
          id: theSelectedService,
          color: '#ddd'
        });

        return data;
      })
      .throttle(500);

    return {
      data: data$
    };
  },
  function ConnectionSankey({ data }) {
    if (!data || data.links.length === 0) {
      return null;
    }
    return (
      <DashboardTile title="Overview">
        <strong>Interaction with this chart and labels are not yet done.</strong>

        <div style={{ height: '200px' }}>
          <ResponsiveSankey
            data={data}
            align="center"
            colors="d320"
            margin={{
              top: 10,
              right: 0,
              bottom: 10,
              left: 0
            }}
            nodeOpacity={0.6}
            nodeHoverOpacity={1}
            nodeWidth={16}
            nodePaddingX={4}
            nodePaddingY={12}
            nodeBorderWidth={0}
            nodeBorderColor="inherit:darker(0.4)"
            colorBy={nodeColorBy}
            linkOpacity={0.4}
            linkHoverOpacity={0.6}
            linkHoverOthersOpacity={0.3}
            linkContract={0}
            linkColorBy={linkColorBy}
            enableLabels
            labelOrientation="horizontal"
            labelPadding={12}
            labelTextColor="inherit:darker(2.4)"
            labelPosition="inside"
            animate={false}
            isInteractive
          />
        </div>
      </DashboardTile>
    );
  }
);

function nodeColorBy(node) {
  return node.color;
}

function linkColorBy(link) {
  return link.color;
}
