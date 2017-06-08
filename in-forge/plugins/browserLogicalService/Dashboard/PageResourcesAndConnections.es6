import { combineLatest } from 'reactive-observables';
import React from 'react';

import LogicalConnectionEntityTable from 'in-components/LogicalEntityTables/LogicalConnectionEntityTable';
import { alwaysEmptyArray, always } from 'in-services/fixedStreams';
import { logicalViewStructure$ } from 'in-stores/view';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
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
            combineLatest(viewStructureItem.outgoingConnections.map(c => getSnapshot(c.id).startWith(null)))
              // remove null snapshots
              .map(snapshots => snapshots.filter(s => s))
          );
        })
        .throttle(1000)
    };
  },
  function PageResourcesAndConnections({ outgoingConnections, timeframe }) {
    if (!outgoingConnections || outgoingConnections.length === 0) {
      return null;
    }

    const resourceConnections = outgoingConnections.filter(
      connectedSnapshot => connectedSnapshot.get('plugin') === plugins.pageResourceLogicalConnection
    );

    const otherConnections = outgoingConnections.filter(
      connectedSnapshot => connectedSnapshot.get('plugin') !== plugins.pageResourceLogicalConnection
    );

    return (
      <div>
        <LogicalConnectionEntityTable
          timeframe={timeframe}
          title={'Resources'}
          dataStream={always(resourceConnections)}
          withoutErrorRate
        />
        <LogicalConnectionEntityTable
          timeframe={timeframe}
          title={'Outgoing Connections'}
          dataStream={always(otherConnections)}
        />
      </div>
    );
  }
);
