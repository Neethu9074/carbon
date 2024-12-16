/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';
import { combineLatest } from '@instana/observables';

import getKubernetesClusterByNode from 'in-kubernetes/subscriptions/getKubernetesClusterByNode';
import KubernetesSnapshotLink from 'in-components/Link/SnapshotLink/KubernetesSnapshotLink';
import getKubernetesNodeByHost from 'in-kubernetes/subscriptions/getKubernetesNodeByHost';
import { useClusterDashboard, useNodeDashboard } from 'in-kubernetes/navigation/paths';
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
                <NodeSnapshotLink label={node.name} id={node.id} />
              </DescriptionItem>
            )}
            {cluster && (
              <DescriptionItem title={t('in-forge:plugins.host.dashboard.cluster')}>
                <ClusterSnapshotLink label={cluster.label} id={cluster.id} />
              </DescriptionItem>
            )}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);

function NodeSnapshotLink({ label, id }) {
  const nodeDashboardHref = useNodeDashboard(id);

  return <KubernetesSnapshotLink viewEntityDashboardHref={nodeDashboardHref}>{label}</KubernetesSnapshotLink>;
}

function ClusterSnapshotLink({ label, id }) {
  const clusterDashboardHref = useClusterDashboard(id);

  return <KubernetesSnapshotLink viewEntityDashboardHref={clusterDashboardHref}>{label}</KubernetesSnapshotLink>;
}
