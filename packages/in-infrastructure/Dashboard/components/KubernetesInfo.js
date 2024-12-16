/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import {
  useDeploymentDashboard,
  useNamespaceDashboard,
  useClusterDashboard,
  usePodDashboard,
  useNodeDashboard
} from 'in-kubernetes/navigation/paths';
import KubernetesSnapshotLink from 'in-components/Link/SnapshotLink/KubernetesSnapshotLink';
import getDeploymentForPodSubscription from 'in-subscription/deploymentForPod';
import getNodeForContainerSubscription from 'in-subscription/nodeForContainer';
import getPodForContainerSubscription from 'in-subscription/podForContainer';
import getNamespaceForPodSubscription from 'in-subscription/namespaceForPod';
import getClusterForPodSubscription from 'in-subscription/clusterForPod';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

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
                <DescriptionItem title={t('in-infrastructure:dashboard.namespace')}>
                  <NamespaceSnapshotLink label={getLabel(namespaceSnapshot)} id={namespaceSnapshot.get('id')} />
                </DescriptionItem>
              ) : (
                <DescriptionItem title={t('in-infrastructure:dashboard.namespace')}>
                  {labels.get('io.kubernetes.pod.namespace')}
                </DescriptionItem>
              )}
              {podSnapshot ? (
                <DescriptionItem title={t('in-infrastructure:dashboard.pod')}>
                  <PodSnapshotLink label={getLabel(podSnapshot)} id={podSnapshot.get('id')} />
                </DescriptionItem>
              ) : null}
              {deploymentSnapshot ? (
                <DescriptionItem title={t('in-infrastructure:dashboard.deployment')}>
                  <DeploymentSnapshotLink label={getLabel(deploymentSnapshot)} id={deploymentSnapshot.get('id')} />
                </DescriptionItem>
              ) : null}
              {nodeSnapshot ? (
                <DescriptionItem title={t('in-infrastructure:dashboard.node')}>
                  <NodeSnapshotLink label={getLabel(nodeSnapshot)} id={nodeSnapshot.get('id')} />
                </DescriptionItem>
              ) : null}
              {clusterSnapshot ? (
                <DescriptionItem title={t('in-infrastructure:dashboard.cluster')}>
                  <ClusterSnapshotLink label={getLabel(clusterSnapshot)} id={clusterSnapshot.get('id')} />
                </DescriptionItem>
              ) : null}
              <DescriptionItem title={t('in-infrastructure:dashboard.restartCount')}>
                {labels.get('annotation.io.kubernetes.container.restartCount')}
              </DescriptionItem>
            </DescriptionList>

            {labels && labels.size > 0 ? (
              <KeyValueOverlay
                header={t('in-infrastructure:dashboard.kubernetesLabels')}
                data={allKubernetesLabelsWithoutPrefix}
              />
            ) : null}
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);

function NamespaceSnapshotLink({ label, id }) {
  const namespaceDashboardHref = useNamespaceDashboard(id);

  return <KubernetesSnapshotLink viewEntityDashboardHref={namespaceDashboardHref}>{label}</KubernetesSnapshotLink>;
}

function PodSnapshotLink({ label, id }) {
  const podDashboardHref = usePodDashboard(id);

  return <KubernetesSnapshotLink viewEntityDashboardHref={podDashboardHref}>{label}</KubernetesSnapshotLink>;
}

function DeploymentSnapshotLink({ label, id }) {
  const deploymentDashboardHref = useDeploymentDashboard(id);

  return <KubernetesSnapshotLink viewEntityDashboardHref={deploymentDashboardHref}>{label}</KubernetesSnapshotLink>;
}

function NodeSnapshotLink({ label, id }) {
  const nodeDashboardHref = useNodeDashboard(id);

  return <KubernetesSnapshotLink viewEntityDashboardHref={nodeDashboardHref}>{label}</KubernetesSnapshotLink>;
}

function ClusterSnapshotLink({ label, id }) {
  const clusterDashboardHref = useClusterDashboard(id);

  return <KubernetesSnapshotLink viewEntityDashboardHref={clusterDashboardHref}>{label}</KubernetesSnapshotLink>;
}

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
