/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import createClusterForNodeSubscription from 'in-subscription/clusterForNode';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import createHostForNodeSubscription from 'in-subscription/hostForNode';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { getZone } from 'in-stores/zone';
import { t } from 'in-i18n';

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
          <DescriptionItem title={t('in-forge:plugins.kubernetesNode.cluster')}>
            <SnapshotLink snapshotId={zoneSnapshot.get('id')}>{getLabel(zoneSnapshot)}</SnapshotLink>
          </DescriptionItem>
        ) : null}
        {hostSnapshot ? (
          <DescriptionItem title={t('in-forge:plugins.kubernetesNode.host')}>
            <SnapshotLink snapshotId={hostSnapshot.get('id')}>{getLabel(hostSnapshot)}</SnapshotLink>
          </DescriptionItem>
        ) : null}

        {clusterSnapshot ? (
          <DescriptionItem title={t('in-forge:plugins.kubernetesNode.cluster')}>
            <SnapshotLink snapshotId={clusterSnapshot.get('id')}>{getLabel(clusterSnapshot)}</SnapshotLink>
          </DescriptionItem>
        ) : null}

        <DescriptionItem title={t('in-forge:plugins.kubernetesNode.hostname')}>{data.get('hostname')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.kubernetesNode.name')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.kubernetesNode.internalIp')}>
          {data.get('internalIp')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.kubernetesNode.machineId')}>
          {data.get('machineId')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.kubernetesNode.bootId')}>{data.get('bootId')}</DescriptionItem>
        <KeyValueOverlay header={t('in-forge:plugins.kubernetesNode.labels')} data={data.get('labels')} />
      </DescriptionList>
    );
  }
);

function getClusterForNode(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForNodeSubscription({ snapshotId, timeConfig }));
}
