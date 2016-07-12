import irpt from 'react-immutable-proptypes';
import React from 'react';

import RelatedSnapshotList from 'in-components/RelatedSnapshotList';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {emptySet} from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

import './ClusterMembersList.less';


export default connectTo(
  props => {
    return {
      snapshotIds: getClusterMembers(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptySet)
    };
  }, ClusterMembersList);

function ClusterMembersList({snapshotIds, onRenderItem}) {
  if (!snapshotIds) {
    return null;
  }
  return (
    <RelatedSnapshotList snapshotIds={snapshotIds}
                         initiallyOpen={true}
                         onRenderItem={onRenderItem}/>
  );
}

const rpt = React.PropTypes;
ClusterMembersList.propTypes = {
  snapshotIds: irpt.setOf(React.PropTypes.string),
  snapshotId: rpt.string.isRequired,
  onRenderItem: rpt.func
};
