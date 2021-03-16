/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import getKubernetesClusterByNode from 'in-subscription/kubernetes/getKubernetesClusterByNode';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KubernetesSnapshotLink from 'in-components/Link/SnapshotLink/KubernetesSnapshotLink';
import getKubernetesNodeByHost from 'in-subscription/kubernetes/getKubernetesNodeByHost';
import { getClusterDashboard, getNodeDashboard } from 'in-kubernetes/navigation/paths';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshotId }) => {
    const node$ = timeConfig$.flatMap(timeConfig =>
      getKubernetesNodeByHost({
        filter: {
          hostId: snapshotId,
          timeConfig
        }
      })
        .map(result => result.data)
        .filter(Boolean)
    );
    return {
      node: node$,
      cluster: combineLatest([timeConfig$, node$]).flatMap(([timeConfig, node]) =>
        getKubernetesClusterByNode({
          filter: {
            resourceSnapshotId: node.id,
            timeConfig
          }
        }).map(result => result.data)
      )
    };
  },
  function NodeAndClusterInformation({ node, cluster }) {
    if (!node && !cluster) {
      return null;
    }

    return (
      <Collapsible>
        <Collapsible.Header>{t('in-forge:plugins.host.dashboard.kubernetes')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {node && (
              <DescriptionItem title={t('in-forge:plugins.host.dashboard.node')}>
                <KubernetesSnapshotLink getKubernetesViewEntityDashboard={getNodeDashboard} snapshotId={node.id}>
                  {node.name}
                </KubernetesSnapshotLink>
              </DescriptionItem>
            )}
            {cluster && (
              <DescriptionItem title={t('in-forge:plugins.host.dashboard.cluster')}>
                <KubernetesSnapshotLink getKubernetesViewEntityDashboard={getClusterDashboard} snapshotId={cluster.id}>
                  {cluster.label}
                </KubernetesSnapshotLink>
              </DescriptionItem>
            )}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);
