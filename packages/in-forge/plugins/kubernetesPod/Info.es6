import React from 'react';

import createDeploymentConfigForPodSubscription from 'in-subscription/deploymentConfigForPod';
import KubernetesDescriptionLinks from 'in-kubernetes/components/KubernetesDescriptionLinks';
import createDeploymentForPodSubscription from 'in-subscription/deploymentForPod';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import createNamespaceForPodSubscription from 'in-subscription/namespaceForPod';
import createClusterForPodSubscription from 'in-subscription/clusterForPod';
import createNodeForPodSubscription from 'in-subscription/nodeForPod';
import createHostForPodSubscription from 'in-subscription/hostForPod';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    deploymentSnapshot: getDeploymentForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    deploymentConfig: getDeploymentConfigForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    nodeSnapshot: getNodeForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    hostSnapshot: getHostForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    clusterSnapshot: getClusterForPod(props.snapshot.get('id')).flatMap(getSnapshot),
    namespaceSnapshot: getNamespaceForPod(props.snapshot.get('id')).flatMap(getSnapshot)
  }),
  function Info({
    snapshot,
    linkToDashboards,
    deploymentSnapshot,
    deploymentConfig,
    nodeSnapshot,
    hostSnapshot,
    clusterSnapshot,
    namespaceSnapshot
  }) {
    const data = snapshot.get('data');
    return (
      <div>
        <DescriptionList>
          <KubernetesDescriptionLinks
            linkToDashboards={linkToDashboards}
            deploymentSnapshot={deploymentSnapshot}
            deploymentConfig={deploymentConfig}
            nodeSnapshot={nodeSnapshot}
            hostSnapshot={hostSnapshot}
            clusterSnapshot={clusterSnapshot}
            namespaceSnapshot={namespaceSnapshot}
          />
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
