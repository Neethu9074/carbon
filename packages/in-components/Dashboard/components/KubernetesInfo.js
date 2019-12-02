import React from 'react';

import {
  getDeploymentDashboard,
  getPodDashboard,
  getNamespaceDashboard,
  getClusterDashboard,
  getNodeDashboard
} from 'in-kubernetes/navigation/paths';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KubernetesSnapshotLink from 'in-components/Link/SnapshotLink/KubernetesSnapshotLink';
import getDeploymentForPodSubscription from 'in-subscription/deploymentForPod';
import getNodeForContainerSubscription from 'in-subscription/nodeForContainer';
import getPodForContainerSubscription from 'in-subscription/podForContainer';
import getNamespaceForPodSubscription from 'in-subscription/namespaceForPod';
import getClusterForPodSubscription from 'in-subscription/clusterForPod';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
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
    podSnapshot,
    deploymentSnapshot,
    nodeSnapshot,
    clusterSnapshot,
    namespaceSnapshot,
    labels
  }) {
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
        <Collapsible initiallyOpen>
          <Collapsible.Header>Kubernetes</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {namespaceSnapshot ? (
                <DescriptionItem title="Namespace">
                  <KubernetesSnapshotLink
                    getKubernetesViewEntityDashboard={getNamespaceDashboard}
                    snapshotId={namespaceSnapshot.get('id')}
                  >
                    {getLabel(namespaceSnapshot)}
                  </KubernetesSnapshotLink>
                </DescriptionItem>
              ) : (
                <DescriptionItem title="Namespace">{labels.get('io.kubernetes.pod.namespace')}</DescriptionItem>
              )}

              {podSnapshot ? (
                <DescriptionItem title="Pod">
                  <KubernetesSnapshotLink
                    getKubernetesViewEntityDashboard={getPodDashboard}
                    snapshotId={podSnapshot.get('id')}
                  >
                    {getLabel(podSnapshot)}
                  </KubernetesSnapshotLink>
                </DescriptionItem>
              ) : null}

              {deploymentSnapshot ? (
                <DescriptionItem title="Deployment">
                  <KubernetesSnapshotLink
                    getKubernetesViewEntityDashboard={getDeploymentDashboard}
                    snapshotId={deploymentSnapshot.get('id')}
                  >
                    {getLabel(deploymentSnapshot)}
                  </KubernetesSnapshotLink>
                </DescriptionItem>
              ) : null}

              {nodeSnapshot ? (
                <DescriptionItem title="Node">
                  <KubernetesSnapshotLink
                    getKubernetesViewEntityDashboard={getNodeDashboard}
                    snapshotId={nodeSnapshot.get('id')}
                  >
                    {getLabel(nodeSnapshot)}
                  </KubernetesSnapshotLink>
                </DescriptionItem>
              ) : null}

              {clusterSnapshot ? (
                <DescriptionItem title="Cluster">
                  <KubernetesSnapshotLink
                    getKubernetesViewEntityDashboard={getClusterDashboard}
                    snapshotId={clusterSnapshot.get('id')}
                  >
                    {getLabel(clusterSnapshot)}
                  </KubernetesSnapshotLink>
                </DescriptionItem>
              ) : null}
              <DescriptionItem title="Restart Count">
                {labels.get('annotation.io.kubernetes.container.restartCount')}
              </DescriptionItem>
            </DescriptionList>

            {labels && labels.size > 0 ? (
              <KeyValueOverlay header="Kubernetes Labels" data={allKubernetesLabelsWithoutPrefix} />
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
