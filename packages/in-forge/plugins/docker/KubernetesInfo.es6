import React from 'react';

import KubernetesDescriptionLinks from 'in-kubernetes/components/KubernetesDescriptionLinks';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import getDeploymentForPodSubscription from 'in-subscription/deploymentForPod';
import getNodeForContainerSubscription from 'in-subscription/nodeForContainer';
import getPodForContainerSubscription from 'in-subscription/podForContainer';
import getNamespaceForPodSubscription from 'in-subscription/namespaceForPod';
import getClusterForPodSubscription from 'in-subscription/clusterForPod';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { kubernetesEnabled } from 'in-services/featureFlags';
import Separator from 'in-sdk/components/sidebar/Separator';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
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
    linkToDashboards,
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
          <Collapsible.Header>{`Kubernetes${kubernetesEnabled ? ' (Beta)' : ''}`}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <KubernetesDescriptionLinks
                linkToDashboards={linkToDashboards}
                deploymentSnapshot={deploymentSnapshot}
                clusterSnapshot={clusterSnapshot}
                namespaceSnapshot={namespaceSnapshot}
                nodeSnapshot={nodeSnapshot}
                podSnapshot={podSnapshot}
                defaultNamespaceContent={
                  <DescriptionItem title="Namespace">{labels.get('io.kubernetes.pod.namespace')}</DescriptionItem>
                }
              />

              <DescriptionItem title="Restart Count">
                {labels.get('annotation.io.kubernetes.container.restartCount')}
              </DescriptionItem>
            </DescriptionList>

            {labels &&
              labels.size > 0 && (
                <KeyValuePopupButton title="Kubernetes Labels" data={allKubernetesLabelsWithoutPrefix}>
                  Kubernetes Labels
                </KeyValuePopupButton>
              )}
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
