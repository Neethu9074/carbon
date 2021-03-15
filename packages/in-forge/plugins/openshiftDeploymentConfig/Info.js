/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import createNamespaceForDeploymentConfigSubscription from 'in-subscription/namespaceForDeploymentConfig';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import createClusterForPodSubscription from 'in-subscription/clusterForPod';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      cluster: getClusterForPod(props.snapshot.get('id')).flatMap(getSnapshot),
      namespace: getNamespaceForDeploymentConfig(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function Info({ snapshot, cluster, namespace }) {
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          {cluster ? (
            <DescriptionItem title={t('in-forge:plugins.openshiftDeploymentConfig.cluster')}>
              <SnapshotLink snapshotId={cluster.get('id')}>{getLabel(cluster)}</SnapshotLink>
            </DescriptionItem>
          ) : null}

          {namespace ? (
            <DescriptionItem title={t('in-forge:plugins.openshiftDeploymentConfig.namespace')}>
              <SnapshotLink snapshotId={namespace.get('id')}>{getLabel(namespace)}</SnapshotLink>
            </DescriptionItem>
          ) : (
            <DescriptionItem title={t('in-forge:plugins.openshiftDeploymentConfig.namespace')}>
              {data.get('namespace')}
            </DescriptionItem>
          )}

          <DescriptionItem title={t('in-forge:plugins.openshiftDeploymentConfig.name')}>
            {data.get('name')}
          </DescriptionItem>
          <KeyValueOverlay header={t('in-forge:plugins.openshiftDeploymentConfig.labels')} data={data.get('labels')} />
        </DescriptionList>
      </div>
    );
  }
);

function getClusterForPod(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createClusterForPodSubscription({ snapshotId, timeConfig }));
}

function getNamespaceForDeploymentConfig(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createNamespaceForDeploymentConfigSubscription({ snapshotId, timeConfig }));
}
