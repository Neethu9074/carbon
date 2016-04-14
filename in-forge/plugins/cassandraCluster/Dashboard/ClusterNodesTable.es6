import {combineLatest} from 'reactive-observables';
import React from 'react';

import {getSnapshot} from 'in-stores/snapshot';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {timeframeShape} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

const rpt = React.PropTypes;

const ClusterNodesTable = connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.clusterSnapshotid)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith([])
        .flatMap(nodeIds => combineLatest(nodeIds.map(getSnapshot)))
    };
  }, function ClusterNodesTable({clusterNodes}) {
    return (
      <div>
        {clusterNodes.map(node =>
          <div key={node.get('id')}>
            {node.get('id')}
          </div>
        )}
      </div>
    );
  }
);

export default ClusterNodesTable;

ClusterNodesTable.PropTypes = {
  clusterSnapshotId: rpt.string.isRequired,
  clusterNodes: rpt.array.isRequired,
  timeframe: timeframeShape.isRequired
};
