import React from 'react';

import createClusterForPodSubscription from 'in-services/subscription/clusterForPod';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import createNodeForPodSubscription from 'in-services/subscription/nodeForPod';
import createHostForPodSubscription from 'in-services/subscription/hostForPod';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    cluster: getClusterForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    node: getNodeForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    host: getHostForPod(props.snapshot.get('id')).flatMap(getSnapshot)
  }),
  function Info({ snapshot, cluster, node, host }) {
    const data = snapshot.get('data');
    return (
      <div>
        <DescriptionList>
          {cluster ? (
            <DescriptionItem title="Cluster">
              <SnapshotLink snapshotId={cluster.get('id')}>{getLabel(cluster)}</SnapshotLink>
            </DescriptionItem>
          ) : null}

          {node ? (
            <DescriptionItem title="Node">
              <SnapshotLink snapshotId={node.get('id')}>{getLabel(node)}</SnapshotLink>
            </DescriptionItem>
          ) : null}

          {host ? (
            <DescriptionItem title="Host">
              <SnapshotLink snapshotId={host.get('id')}>{getLabel(host)}</SnapshotLink>
            </DescriptionItem>
          ) : null}

          <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
          <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>

          <DescriptionItem title="Host IP">{data.get('hostIp')}</DescriptionItem>

          <DescriptionItem title="Pod IP">{data.get('podIp')}</DescriptionItem>
          <DescriptionItem title="Phase">{data.get('phase')}</DescriptionItem>
          <KeyValuePopup header="Labels" data={data.get('labels')} />
        </DescriptionList>
      </div>
    );
  }
);

function getClusterForPod(snapshotId) {
  return focusedMoment$.flatMap(time => createClusterForPodSubscription({ snapshotId, time }));
}

function getNodeForPod(snapshotId) {
  return focusedMoment$.flatMap(time => createNodeForPodSubscription({ snapshotId, time }));
}

function getHostForPod(snapshotId) {
  return focusedMoment$.flatMap(time => createHostForPodSubscription({ snapshotId, time }));
}
