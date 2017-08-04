import { combineLatest } from 'reactive-observables';
import React from 'react';

import LogicalConnectionEntityTable from 'in-components/LogicalEntityTables/LogicalConnectionEntityTable';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import { always, alwaysEmptyArray } from 'in-services/fixedStreams';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import { logicalViewStructure$ } from 'in-stores/view';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

export default function AJAX({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardTile title="XHR / AJAX">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['xhrCalls'],
            labels: ['Calls'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['xhrErrors'],
            labels: ['Errors'],
            type: 'line'
          }}
        />
      </DashboardTile>
      <OutgoingConnections snapshotId={snapshotId} timeframe={timeframe} />
    </div>
  );
}

const OutgoingConnections = connectTo(
  props => {
    return {
      outgoingConnections: logicalViewStructure$
        .map(viewStructure => {
          for (let i = 0, length = viewStructure.children.length; i < length; i++) {
            const item = viewStructure.children[i];
            if (item.id === props.snapshotId) {
              return item;
            }
          }
          return null;
        })
        .flatMap(viewStructureItem => {
          if (!viewStructureItem) {
            return alwaysEmptyArray;
          }

          return (
            combineLatest(viewStructureItem.outgoingConnections.map(c => getSnapshot(c.id)), false)
              // remove null snapshots
              .map(snapshots => snapshots.filter(s => s))
          );
        })
        .throttle(1000)
    };
  },
  function OutgoingConnections({ outgoingConnections, timeframe }) {
    if (!outgoingConnections || outgoingConnections.length === 0) {
      return null;
    }

    const otherConnections = outgoingConnections.filter(
      connectedSnapshot => connectedSnapshot.get('plugin') !== plugins.pageResourceLogicalConnection
    );

    return (
      <DashboardTile title="">
        <LogicalConnectionEntityTable
          title={'Outgoing Connections'}
          timeframe={timeframe}
          dataStream={always(otherConnections)}
        />
      </DashboardTile>
    );
  }
);
