import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KubernetesSnapshotLink from 'in-components/Link/SnapshotLink/KubernetesSnapshotLink';
import { getClusterDashboard, getNodeDashboard } from 'in-kubernetes/navigation/paths';
import createClusterForPodSubscription from 'in-subscription/clusterForPod';
import createNodeForHostSubscription from 'in-subscription/nodeForHost';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
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
  function NodeAndClusterInformation({ nodeSnapshot, clusterSnapshot }) {
    if (!nodeSnapshot) {
      return null;
    }

    return (
      <Collapsible>
        <Collapsible.Header>Kubernetes</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Node">
              <KubernetesSnapshotLink
                getKubernetesViewEntityDashboard={getNodeDashboard}
                snapshotId={nodeSnapshot.get('id')}
              >
                {getLabel(nodeSnapshot)}
              </KubernetesSnapshotLink>
            </DescriptionItem>
            {clusterSnapshot && (
              <DescriptionItem title="Cluster">
                <KubernetesSnapshotLink
                  getKubernetesViewEntityDashboard={getClusterDashboard}
                  snapshotId={clusterSnapshot.get('id')}
                >
                  {getLabel(clusterSnapshot)}
                </KubernetesSnapshotLink>
              </DescriptionItem>
            )}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);
