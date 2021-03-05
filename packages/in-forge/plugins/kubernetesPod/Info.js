/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import createDeploymentConfigForPodSubscription from 'in-subscription/deploymentConfigForPod';
import createDeploymentForPodSubscription from 'in-subscription/deploymentForPod';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import createNamespaceForPodSubscription from 'in-subscription/namespaceForPod';
import createClusterForPodSubscription from 'in-subscription/clusterForPod';
import createNodeForPodSubscription from 'in-subscription/nodeForPod';
import createHostForPodSubscription from 'in-subscription/hostForPod';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    deployment: getDeploymentForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    deploymentConfig: getDeploymentConfigForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    node: getNodeForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    host: getHostForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    cluster: getClusterForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    namespace: getNamespaceForPod(props.snapshot.get('id')).flatMap(getSnapshot)
  }),
  function Info({ snapshot, deployment, deploymentConfig, node, host, cluster, namespace }) {
    const data = snapshot.get('data');
    return (
      <div>
        <DescriptionList>
          {deployment ? (
            <DescriptionItem title={t('in-forge:plugins.kubernetesPod.deployment')}>
              <SnapshotLink snapshotId={deployment.get('id')}>{getLabel(deployment)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
          {deploymentConfig ? (
            <DescriptionItem title={t('in-forge:plugins.kubernetesPod.deploymentConfig')}>
              <SnapshotLink snapshotId={deploymentConfig.get('id')}>{getLabel(deploymentConfig)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
          {node ? (
            <DescriptionItem title={t('in-forge:plugins.kubernetesPod.node')}>
              <SnapshotLink snapshotId={node.get('id')}>{getLabel(node)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
          {host ? (
            <DescriptionItem title={t('in-forge:plugins.kubernetesPod.host')}>
              <SnapshotLink snapshotId={host.get('id')}>{getLabel(host)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
          {cluster ? (
            <DescriptionItem title={t('in-forge:plugins.kubernetesPod.cluster')}>
              <SnapshotLink snapshotId={cluster.get('id')}>{getLabel(cluster)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
          {namespace ? (
            <DescriptionItem title={t('in-forge:plugins.kubernetesPod.namespace')}>
              <SnapshotLink snapshotId={namespace.get('id')}>{getLabel(namespace)}</SnapshotLink>
            </DescriptionItem>
          ) : (
            <DescriptionItem title={t('in-forge:plugins.kubernetesPod.namespace')}>
              {data.get('namespace')}
            </DescriptionItem>
          )}
          <DescriptionItem title={t('in-forge:plugins.kubernetesPod.name')}>{data.get('name')}</DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.kubernetesPod.hostIp')}>{data.get('hostIp')}</DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.kubernetesPod.podIp')}>{data.get('podIp')}</DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.kubernetesPod.phase')}>{data.get('phase')}</DescriptionItem>
          <KeyValueOverlay header={t('in-forge:plugins.kubernetesPod.labels')} data={data.get('labels')} />
        </DescriptionList>
      </div>
    );
  }
);

function getDeploymentForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createDeploymentForPodSubscription({ snapshotId, timeConfig }));
}
function getDeploymentConfigForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createDeploymentConfigForPodSubscription({ snapshotId, timeConfig }));
}
function getNodeForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createNodeForPodSubscription({ snapshotId, timeConfig }));
}
function getHostForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createHostForPodSubscription({ snapshotId, timeConfig }));
}
function getClusterForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForPodSubscription({ snapshotId, timeConfig }));
}
function getNamespaceForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createNamespaceForPodSubscription({ snapshotId, timeConfig }));
}
