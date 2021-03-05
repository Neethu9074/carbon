/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
            <DescriptionItem title={t('in-forge:plugins.kubernetesNamespace.cluster')}>
              <SnapshotLink snapshotId={cluster.get('id')}>{getLabel(cluster)}</SnapshotLink>
            </DescriptionItem>
          ) : null}
          <DescriptionItem title={t('in-forge:plugins.kubernetesNamespace.name')}>{data.get('name')}</DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.kubernetesNamespace.status')}>
            {data.get('status')}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.kubernetesNamespace.creationTime')}>
            {formatDateTime(data.get('creationTime'))}
          </DescriptionItem>
          <KeyValueOverlay header={t('in-forge:plugins.kubernetesNamespace.labels')} data={data.get('labels')} />
        </DescriptionList>
      </div>
    );
  }
);

function getClusterForNamespace(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForNamespaceSubscription({ snapshotId, timeConfig }));
}
