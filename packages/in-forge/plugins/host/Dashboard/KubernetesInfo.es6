import React from 'react';

import createClusterForPodSubscription from 'in-services/subscription/clusterForPod';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import createNodeForHostSubscription from 'in-services/subscription/nodeForHost';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { alwaysNull } from 'in-services/fixedStreams';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const nodeSnapshotId = focusedMoment$.flatMap(time =>
      createNodeForHostSubscription({ snapshotId: props.snapshotId, time })
    );

    return {
      nodeSnapshot: nodeSnapshotId.flatMap(getSnapshot),

      clusterSnapshot: nodeSnapshotId.flatMap(
        nodeSnapshotId =>
          nodeSnapshotId
            ? focusedMoment$
                .flatMap(time => createClusterForPodSubscription({ snapshotId: nodeSnapshotId, time }))
                .flatMap(getSnapshot)
            : alwaysNull
      )
    };
  },
  function NodeAndClusterInformation({ nodeSnapshot, clusterSnapshot }) {
    if (!nodeSnapshot) {
      return null;
    }

    return [
      <Separator key="1" />,
      <Collapsible key="2">
        <Collapsible.Header>Kubernetes</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Node">
              <SnapshotLink snapshotId={nodeSnapshot.get('id')}>{getLabel(nodeSnapshot)}</SnapshotLink>
            </DescriptionItem>
            {clusterSnapshot ? (
              <DescriptionItem title="Cluster">
                <SnapshotLink snapshotId={clusterSnapshot.get('id')}>{getLabel(clusterSnapshot)}</SnapshotLink>
              </DescriptionItem>
            ) : null}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    ];
  }
);
