import React from 'react';

import KubernetesDescriptionLinks from 'in-kubernetes/components/KubernetesDescriptionLinks';
import createClusterForPodSubscription from 'in-subscription/clusterForPod';
import createNodeForHostSubscription from 'in-subscription/nodeForHost';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { DescriptionList } from 'in-components/DescriptionList';
import { kubernetesEnabled } from 'in-services/featureFlags';
import Separator from 'in-sdk/components/sidebar/Separator';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const nodeSnapshotId = timeConfig$.flatMap(timeConfig =>
      createNodeForHostSubscription({ snapshotId: props.snapshotId, timeConfig })
    );

    return {
      nodeSnapshot: nodeSnapshotId.flatMap(getSnapshot),

      clusterSnapshot: nodeSnapshotId.flatMap(
        nodeSnapshotId =>
          nodeSnapshotId
            ? timeConfig$
                .flatMap(timeConfig => createClusterForPodSubscription({ snapshotId: nodeSnapshotId, timeConfig }))
                .flatMap(getSnapshot)
            : alwaysNull
      )
    };
  },
  function NodeAndClusterInformation({ linkToDashboards, nodeSnapshot, clusterSnapshot }) {
    if (!nodeSnapshot) {
      return null;
    }

    return [
      <Separator key="1" />,
      <Collapsible key="2">
        <Collapsible.Header>{`Kubernetes${kubernetesEnabled ? ' (Beta)' : ''}`}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <KubernetesDescriptionLinks
              linkToDashboards={linkToDashboards}
              nodeSnapshot={nodeSnapshot}
              clusterSnapshot={clusterSnapshot}
            />
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    ];
  }
);
