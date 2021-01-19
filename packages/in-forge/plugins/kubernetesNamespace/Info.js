/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import createClusterForNamespaceSubscription from 'in-subscription/clusterForNamespace';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { formatDateTime } from 'in-services/formatters/date';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      cluster: getClusterForNamespace(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function Info({ snapshot, cluster }) {
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          {cluster ? (
            <DescriptionItem title="Cluster">
              <SnapshotLink snapshotId={cluster.get('id')}>{getLabel(cluster)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
          <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
          <DescriptionItem title="Status">{data.get('status')}</DescriptionItem>
          <DescriptionItem title="Creation time">{formatDateTime(data.get('creationTime'))}</DescriptionItem>
          <KeyValueOverlay header="Labels" data={data.get('labels')} />
        </DescriptionList>
      </div>
    );
  }
);

function getClusterForNamespace(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForNamespaceSubscription({ snapshotId, timeConfig }));
}
