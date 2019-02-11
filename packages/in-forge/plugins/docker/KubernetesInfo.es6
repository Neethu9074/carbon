import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import getDeploymentForPodSubscription from 'in-subscription/deploymentForPod';
import getNodeForContainerSubscription from 'in-subscription/nodeForContainer';
import getPodForContainerSubscription from 'in-subscription/podForContainer';
import getNamespaceForPodSubscription from 'in-subscription/namespaceForPod';
import getClusterForPodSubscription from 'in-subscription/clusterForPod';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const containerSnapshotId = props.snapshot.get('id');
    const podForContainer = getPodForContainer(containerSnapshotId);

    return {
      podSnapshot: podForContainer.flatMap(getSnapshot),
      deploymentSnapshot: podForContainer
        .filter(podId => podId != null)
        .flatMap(getDeploymentForPod)
        .filter(deploymentId => deploymentId != null)
        .flatMap(getSnapshot),
      namespaceSnapshot: podForContainer
        .filter(podId => podId != null)
        .flatMap(getNamespaceForPod)
        .filter(namespaceId => namespaceId != null)
        .flatMap(getSnapshot),
      nodeSnapshot: getNodeForContainer(containerSnapshotId).flatMap(getSnapshot),
      clusterSnapshot: getClusterForContainer(containerSnapshotId).flatMap(getSnapshot)
    };
  },

  function KubernetesInfo({
    snapshot,
    podSnapshot,
    deploymentSnapshot,
    nodeSnapshot,
    clusterSnapshot,
    namespaceSnapshot
  }) {
    const labels = snapshot.getIn(['data', 'Labels']);
    if (!labels || labels.size === 0) {
      return null;
    }

    const smellsLikeKubernetes = labels.some(
      (value, key) => key.indexOf('io.kubernetes.') !== -1 || key.indexOf('annotation.io.kubernetes') === 0
    );

    if (!smellsLikeKubernetes) {
      return null;
    }

    const allKubernetesLabelsWithoutPrefix = labels
      .filter((v, k) => k.indexOf('io.kubernetes') !== -1)
      .mapKeys(k => k.replace(/^(annotation\.)?io\.kubernetes\./i, ''));

    return (
      <div>
        <Separator />

        <Collapsible initiallyOpen>
          <Collapsible.Header>Kubernetes</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
<<<<<<< HEAD
              <KubernetesDescriptionLinks
                deploymentSnapshot={deploymentSnapshot}
                clusterSnapshot={clusterSnapshot}
                namespaceSnapshot={namespaceSnapshot}
                nodeSnapshot={nodeSnapshot}
                podSnapshot={podSnapshot}
                defaultNamespaceContent={
                  <DescriptionItem title="Namespace">{labels.get('io.kubernetes.pod.namespace')}</DescriptionItem>
                }
              />
=======
              {namespaceSnapshot ? (
                <DescriptionItem title="Namespace">
                  <SnapshotLink snapshotId={namespaceSnapshot.get('id')}>{getLabel(namespaceSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : (
                <DescriptionItem title="Namespace">{labels.get('io.kubernetes.pod.namespace')}</DescriptionItem>
              )}

              {podSnapshot ? (
                <DescriptionItem title="Pod">
                  <SnapshotLink snapshotId={podSnapshot.get('id')}>{getLabel(podSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : null}

              {deploymentSnapshot ? (
                <DescriptionItem title="Deployment">
                  <SnapshotLink snapshotId={deploymentSnapshot.get('id')}>{getLabel(deploymentSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : null}
>>>>>>> parent of c3fc80842... link to kubernetes view entities inside the infra sidebar if the ff is set

              {nodeSnapshot ? (
                <DescriptionItem title="Node">
                  <SnapshotLink snapshotId={nodeSnapshot.get('id')}>{getLabel(nodeSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : null}

              {clusterSnapshot ? (
                <DescriptionItem title="Cluster">
                  <SnapshotLink snapshotId={clusterSnapshot.get('id')}>{getLabel(clusterSnapshot)}</SnapshotLink>
                </DescriptionItem>
              ) : null}
              <DescriptionItem title="Restart Count">
                {labels.get('annotation.io.kubernetes.container.restartCount')}
              </DescriptionItem>
            </DescriptionList>

            {labels && labels.size > 0 ? (
              <KeyValuePopupButton title="Kubernetes Labels" data={allKubernetesLabelsWithoutPrefix}>
                Kubernetes Labels
              </KeyValuePopupButton>
            ) : null}
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);

function getPodForContainer(snapshotId) {
  return timeConfig$.flatMap(timeConfig => getPodForContainerSubscription({ snapshotId, timeConfig }));
}
function getDeploymentForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => getDeploymentForPodSubscription({ snapshotId, timeConfig }));
}
function getNodeForContainer(snapshotId) {
  return timeConfig$.flatMap(timeConfig => getNodeForContainerSubscription({ snapshotId, timeConfig }));
}
function getClusterForContainer(snapshotId) {
  return timeConfig$.flatMap(timeConfig => getClusterForPodSubscription({ snapshotId, timeConfig }));
}
function getNamespaceForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => getNamespaceForPodSubscription({ snapshotId, timeConfig }));
}
