/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
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
        {hostSnapshot ? (
          <DescriptionItem title="Host">
            <SnapshotLink snapshotId={hostSnapshot.get('id')}>{getLabel(hostSnapshot)}</SnapshotLink>
          </DescriptionItem>
        ) : null}

        {clusterSnapshot ? (
          <DescriptionItem title="Cluster">
            <SnapshotLink snapshotId={clusterSnapshot.get('id')}>{getLabel(clusterSnapshot)}</SnapshotLink>
          </DescriptionItem>
        ) : null}

        <DescriptionItem title="Hostname">{data.get('hostname')}</DescriptionItem>
        <DescriptionItem title="Name">{data.get('name')}</DescriptionItem>
        <DescriptionItem title="Internal IP">{data.get('internalIp')}</DescriptionItem>
        <DescriptionItem title="Machine ID">{data.get('machineId')}</DescriptionItem>
        <DescriptionItem title="Boot ID">{data.get('bootId')}</DescriptionItem>
        <KeyValueOverlay header="Labels" data={data.get('labels')} />
      </DescriptionList>
    );
  }
);

function getClusterForNode(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForNodeSubscription({ snapshotId, timeConfig }));
}
