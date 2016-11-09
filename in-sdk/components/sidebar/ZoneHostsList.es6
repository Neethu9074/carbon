import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';
import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import {getRunningComponents} from 'in-stores/snapshot';
import {getClusterMembers} from 'in-stores/clusterMembers';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    snapshotIds: getClusterMembers(props.snapshotId)
                  .flatMap(ids => combineLatest(ids.toArray().map(snapshotId =>
                    getRunningComponents(snapshotId)
                      .map(_ids => _ids.toArray()[0])
                  )))
                  .map(array => Immutable.Set(array))
                  .startWith([])
  };
}, function ZoneHostsList({snapshotIds}) {
  if (!snapshotIds || snapshotIds.length === 0) {
    return null;
  }

  return <RelatedSnapshotList snapshotIds={snapshotIds} />;
});
