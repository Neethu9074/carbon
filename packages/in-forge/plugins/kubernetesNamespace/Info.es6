import React from 'react';

import KubernetesDescriptionLinks from 'in-kubernetes/components/KubernetesDescriptionLinks';
import createClusterForNamespaceSubscription from 'in-subscription/clusterForNamespace';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import { formatDateTime } from 'in-services/formatters/date';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      clusterSnapshot: getClusterForNamespace(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function Info({ snapshot, clusterSnapshot, linkToDashboards }) {
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          <KubernetesDescriptionLinks linkToDashboards={linkToDashboards} clusterSnapshot={clusterSnapshot} />
          <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
          <DescriptionItem title="Status">{data.get('status')}</DescriptionItem>
          <DescriptionItem title="Creation time">{formatDateTime(data.get('creationTime'))}</DescriptionItem>
          <KeyValuePopupButton title="Labels" data={data.get('labels')}>
            Labels
          </KeyValuePopupButton>
        </DescriptionList>
      </div>
    );
  }
);

function getClusterForNamespace(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForNamespaceSubscription({ snapshotId, timeConfig }));
}
