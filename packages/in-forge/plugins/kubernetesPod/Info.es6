import React from 'react';

import createDeploymentConfigForPodSubscription from 'in-subscription/deploymentConfigForPod';
import createDeploymentForPodSubscription from 'in-subscription/deploymentForPod';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
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
<<<<<<< HEAD
  function Info({
    snapshot,
    deploymentSnapshot,
    deploymentConfig,
    nodeSnapshot,
    hostSnapshot,
    clusterSnapshot,
    namespaceSnapshot
  }) {
=======
  function Info({ snapshot, deployment, deploymentConfig, node, host, cluster, namespace }) {
>>>>>>> parent of c3fc80842... link to kubernetes view entities inside the infra sidebar if the ff is set
    const data = snapshot.get('data');
    return (
      <div>
        <DescriptionList>
<<<<<<< HEAD
          <KubernetesDescriptionLinks
            deploymentSnapshot={deploymentSnapshot}
            deploymentConfig={deploymentConfig}
            nodeSnapshot={nodeSnapshot}
            hostSnapshot={hostSnapshot}
            clusterSnapshot={clusterSnapshot}
            namespaceSnapshot={namespaceSnapshot}
          />
=======
          {deployment ? (
            <DescriptionItem title="Deployment">
              <SnapshotLink snapshotId={deployment.get('id')}>{getLabel(deployment)}</SnapshotLink>
            </DescriptionItem>
          ) : null}

          {deploymentConfig ? (
            <DescriptionItem title="DeploymentConfig">
              <SnapshotLink snapshotId={deploymentConfig.get('id')}>{getLabel(deploymentConfig)}</SnapshotLink>
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

          {cluster ? (
            <DescriptionItem title="Cluster">
              <SnapshotLink snapshotId={cluster.get('id')}>{getLabel(cluster)}</SnapshotLink>
            </DescriptionItem>
          ) : null}

          {namespace ? (
            <DescriptionItem title="Namespace">
              <SnapshotLink snapshotId={namespace.get('id')}>{getLabel(namespace)}</SnapshotLink>
            </DescriptionItem>
          ) : (
            <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>
          )}

>>>>>>> parent of c3fc80842... link to kubernetes view entities inside the infra sidebar if the ff is set
          <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
          <DescriptionItem title="Host IP">{data.get('hostIp')}</DescriptionItem>
          <DescriptionItem title="Pod IP">{data.get('podIp')}</DescriptionItem>
          <DescriptionItem title="Phase">{data.get('phase')}</DescriptionItem>
          <KeyValuePopupButton title="Labels" data={data.get('labels')}>
            Labels
          </KeyValuePopupButton>
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
