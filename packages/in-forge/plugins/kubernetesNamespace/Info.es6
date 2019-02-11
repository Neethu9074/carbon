import React from 'react';

import createClusterForNamespaceSubscription from 'in-subscription/clusterForNamespace';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
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
<<<<<<< HEAD
<<<<<<< HEAD
  function Info({ snapshot, clusterSnapshot, linkToDashboards }) {
=======
  function Info({ snapshot, cluster }) {
>>>>>>> parent of c3fc80842... link to kubernetes view entities inside the infra sidebar if the ff is set
=======
  function Info({ snapshot, clusterSnapshot }) {
>>>>>>> parent of d827dc0c0... k8s sidebar links change the context on the map but jump to the dashboard when mounted in dashboards
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
<<<<<<< HEAD
<<<<<<< HEAD
          <KubernetesDescriptionLinks linkToDashboards={linkToDashboards} clusterSnapshot={clusterSnapshot} />
=======
          {cluster ? (
            <DescriptionItem title="Cluster">
              <SnapshotLink snapshotId={cluster.get('id')}>{getLabel(cluster)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
>>>>>>> parent of c3fc80842... link to kubernetes view entities inside the infra sidebar if the ff is set
=======
          <KubernetesDescriptionLinks clusterSnapshot={clusterSnapshot} />
>>>>>>> parent of d827dc0c0... k8s sidebar links change the context on the map but jump to the dashboard when mounted in dashboards
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
