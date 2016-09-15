import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import {getServiceInstances} from 'in-stores/snapshot';
import {emptySet} from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    snapshotIds: getServiceInstances(props.snapshotId)
      // Always start with an empty set to avoid inconsistent view,
      // displaying running components for a previously selected snapshot.
      .startWith(emptySet)
  };
}, function ServiceInstancesList({snapshotIds}) {
  if (snapshotIds == null) {
    return null;
  }

  return <RelatedSnapshotList snapshotIds={snapshotIds} />;
});
