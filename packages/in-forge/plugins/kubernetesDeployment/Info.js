/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import createNamespaceForDeploymentSubscription from 'in-subscription/namespaceForDeployment';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
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
  function Info({ snapshot, cluster, namespace }) {
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
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

          <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
          <KeyValueOverlay header="Labels" data={data.get('labels')} />
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
