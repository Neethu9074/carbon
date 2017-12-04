import React from 'react';

import createClusterForPodSubscription from 'in-services/subscription/clusterForPod';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { alwaysNull } from 'in-services/fixedStreams';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      cluster: getClusterForPod(props.snapshot.get('id')).flatMap(id => (id ? getSnapshot(id) : alwaysNull))
    };
  },
  function Info({ snapshot, cluster }) {
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          {cluster ? (
            <DescriptionItem title="Cluster">
              <SnapshotLink snapshotId={cluster.get('id')}>{getLabel(cluster)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
          <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>
          <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
          <KeyValuePopup header="Labels" data={data.get('labels')} />
        </DescriptionList>
      </div>
    );
  }
);

function getClusterForPod(snapshotId) {
  return focusedMoment$.flatMap(time => createClusterForPodSubscription({ snapshotId, time }));
}
