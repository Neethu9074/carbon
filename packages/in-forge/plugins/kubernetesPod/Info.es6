import React from 'react';

import createDeploymentConfigForPodSubscription from 'in-subscription/deploymentConfigForPod';
import createDeploymentForPodSubscription from 'in-subscription/deploymentForPod';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import createClusterForPodSubscription from 'in-subscription/clusterForPod';
import createNodeForPodSubscription from 'in-subscription/nodeForPod';
import createHostForPodSubscription from 'in-subscription/hostForPod';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    deployment: getDeploymentForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    deploymentConfig: getDeploymentConfigForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    node: getNodeForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    host: getHostForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    cluster: getClusterForPod(props.snapshot.get('id')).flatMap(getSnapshot)
  }),
  function Info({ snapshot, deployment, deploymentConfig, node, host, cluster }) {
    const data = snapshot.get('data');
    return (
      <div>
        <DescriptionList>
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

          <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
          <DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>
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
  return focusedMoment$.flatMap(time => createDeploymentForPodSubscription({ snapshotId, time }));
}
function getDeploymentConfigForPod(snapshotId) {
  return focusedMoment$.flatMap(time => createDeploymentConfigForPodSubscription({ snapshotId, time }));
}
function getNodeForPod(snapshotId) {
  return focusedMoment$.flatMap(time => createNodeForPodSubscription({ snapshotId, time }));
}
function getHostForPod(snapshotId) {
  return focusedMoment$.flatMap(time => createHostForPodSubscription({ snapshotId, time }));
}
function getClusterForPod(snapshotId) {
  return focusedMoment$.flatMap(time => createClusterForPodSubscription({ snapshotId, time }));
}
