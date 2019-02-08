import React from 'react';

import KubernetesDescriptionLinks from 'in-kubernetes/components/KubernetesDescriptionLinks';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import createClusterForNodeSubscription from 'in-subscription/clusterForNode';
import createHostForNodeSubscription from 'in-subscription/hostForNode';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { getZone } from 'in-stores/zone';

export default connectTo(
  props => {
    return {
      zoneSnapshot: getZone(props.snapshot.get('id')).flatMap(getSnapshot),
      hostSnapshot: timeConfig$
        .flatMap(timeConfig => createHostForNodeSubscription({ snapshotId: props.snapshot.get('id'), timeConfig }))
        .flatMap(getSnapshot),
      clusterSnapshot: getClusterForNode(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function Info({ snapshot, zoneSnapshot, hostSnapshot, clusterSnapshot }) {
    const data = snapshot.get('data');

    return (
      <DescriptionList>
        {zoneSnapshot ? (
          <DescriptionItem title="Cluster">
            <SnapshotLink snapshotId={zoneSnapshot.get('id')}>{getLabel(zoneSnapshot)}</SnapshotLink>
          </DescriptionItem>
        ) : null}
        <KubernetesDescriptionLinks hostSnapshot={hostSnapshot} clusterSnapshot={clusterSnapshot} />

        <DescriptionItem title="Hostname">{data.get('hostname')}</DescriptionItem>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
        <DescriptionItem title="Internal IP">{data.get('internalIp')}</DescriptionItem>
        <DescriptionItem title="Machine ID">{data.get('machineId')}</DescriptionItem>
        <KeyValuePopupButton title="Labels" data={data.get('labels')}>
          Labels
        </KeyValuePopupButton>
      </DescriptionList>
    );
  }
);

function getClusterForNode(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForNodeSubscription({ snapshotId, timeConfig }));
}
