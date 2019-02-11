import React from 'react';

import createNamespaceForDeploymentSubscription from 'in-subscription/namespaceForDeployment';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import createClusterForPodSubscription from 'in-subscription/clusterForPod';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      cluster: getClusterForPod(props.snapshot.get('id')).flatMap(getSnapshot),
      namespace: getNamespaceForDeployment(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
<<<<<<< HEAD
<<<<<<< HEAD
  function Info({ snapshot, clusterSnapshot, namespaceSnapshot, linkToDashboards }) {
=======
  function Info({ snapshot, cluster, namespace }) {
>>>>>>> parent of c3fc80842... link to kubernetes view entities inside the infra sidebar if the ff is set
=======
  function Info({ snapshot, clusterSnapshot, namespaceSnapshot }) {
>>>>>>> parent of d827dc0c0... k8s sidebar links change the context on the map but jump to the dashboard when mounted in dashboards
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
<<<<<<< HEAD
          <KubernetesDescriptionLinks
            clusterSnapshot={clusterSnapshot}
            namespaceSnapshot={namespaceSnapshot}
            defaultNamespaceContent={<DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>}
          />
=======
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
          <KeyValuePopupButton title="Labels" data={data.get('labels')}>
            Labels
          </KeyValuePopupButton>
        </DescriptionList>
      </div>
    );
  }
);

function getClusterForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForPodSubscription({ snapshotId, timeConfig }));
}

function getNamespaceForDeployment(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createNamespaceForDeploymentSubscription({ snapshotId, timeConfig }));
}
