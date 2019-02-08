import React from 'react';

import createNamespaceForDeploymentSubscription from 'in-subscription/namespaceForDeployment';
import KubernetesDescriptionLinks from 'in-kubernetes/components/KubernetesDescriptionLinks';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import createClusterForPodSubscription from 'in-subscription/clusterForPod';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      clusterSnapshot: getClusterForPod(props.snapshot.get('id')).flatMap(getSnapshot),
      namespaceSnapshot: getNamespaceForDeployment(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function Info({ snapshot, clusterSnapshot, namespaceSnapshot }) {
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          <KubernetesDescriptionLinks
            clusterSnapshot={clusterSnapshot}
            namespaceSnapshot={namespaceSnapshot}
            defaultNamespaceContent={<DescriptionItem title="Namespace">{data.get('namespace')}</DescriptionItem>}
          />
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
