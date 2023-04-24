/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { KubernetesCluster, KubernetesNode } from '@instana/types';
import { Observable } from '@instana/observables';

// @ts-expect-error
import getKubernetesClusterByNode from 'in-kubernetes/subscriptions/getKubernetesClusterByNode';
// @ts-expect-error
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
// @ts-expect-error
import KubernetesSnapshotLink from 'in-components/Link/SnapshotLink/KubernetesSnapshotLink';
// @ts-expect-error
import { getClusterDashboard, getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
// @ts-expect-error
import getKubernetesNodeByHost from 'in-kubernetes/subscriptions/getKubernetesNodeByHost';
// @ts-expect-error
import getKubernetesNamespacesByCluster from 'in-subscription/namespacesForCluster';
// @ts-expect-error
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
// @ts-expect-error
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
// @ts-expect-error
import { getSnapshots, SnapshotData } from 'in-stores/snapshot';
// @ts-expect-error
import connectTo from 'in-hoc/connectTo';
import { timeConfig$ } from 'in-stores/time/config';
import { t } from 'in-i18n';

interface KubernetesInformationProps {
  cluster?: KubernetesCluster;
  namespaceSnapshots?: SnapshotData[];
  snapshot: any;
}

export default connectTo(
  ({ snapshot }: { snapshot: any }) => ({
    cluster: getHostSnapshotId(snapshot)
      .filter(Boolean)
      .flatMap(getNodeByHost)
      .flatMap((node: KubernetesNode) => getClusterByNode(node.id)),
    namespaceSnapshots: getHostSnapshotId(snapshot)
      .filter(Boolean)
      .flatMap(getNodeByHost)
      .flatMap((node: KubernetesNode) => getClusterByNode(node.id))
      .flatMap((cluster: KubernetesCluster) => getNamespacesByCluster(cluster.id))
  }),
  function KubernetesInformation({ cluster, namespaceSnapshots, snapshot }: KubernetesInformationProps) {
    const namespaceName = snapshot.getIn(['data', 'properties.namespace']);
    const clusterName = snapshot.getIn(['data', 'properties.clusterName']);
    let namespaceSnapshot;
    if (Array.isArray(namespaceSnapshots) && namespaceSnapshots.length && namespaceName) {
      namespaceSnapshot = namespaceSnapshots.find(
        namespaceSnapshot => namespaceSnapshot.getIn(['data', 'name']) === namespaceName
      );
    }
    if (!namespaceName && !namespaceSnapshot && !clusterName && !cluster) {
      return null;
    }

    return (
      <Collapsible>
        <Collapsible.Header>{t('in-forge:plugins.syntheticPoP.dashboard.kubernetes')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {namespaceSnapshot || namespaceName ? (
              <DescriptionItem title={t('in-forge:plugins.syntheticPoP.dashboard.namespace')}>
                {namespaceSnapshot ? (
                  <KubernetesSnapshotLink
                    getKubernetesViewEntityDashboard={getNamespaceDashboard}
                    snapshotId={namespaceSnapshot.get('id')}
                  >
                    {namespaceSnapshot.get('label')}
                  </KubernetesSnapshotLink>
                ) : (
                  namespaceName
                )}
              </DescriptionItem>
            ) : null}
            {cluster || clusterName ? (
              <DescriptionItem title={t('in-forge:plugins.syntheticPoP.dashboard.cluster')}>
                {cluster ? (
                  <KubernetesSnapshotLink
                    getKubernetesViewEntityDashboard={getClusterDashboard}
                    snapshotId={cluster.id}
                  >
                    {cluster.label}
                  </KubernetesSnapshotLink>
                ) : (
                  clusterName
                )}
              </DescriptionItem>
            ) : null}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    );
  }
);

function getNodeByHost(hostSnapshotId: string): Observable<KubernetesNode> {
  return timeConfig$.flatMap(timeConfig =>
    getKubernetesNodeByHost({
      filter: {
        hostId: hostSnapshotId,
        timeConfig
      }
    })
      .map((result: { data: any }) => result.data)
      .filter(Boolean)
  );
}
function getClusterByNode(nodeSnapshotId: string): Observable<KubernetesCluster> {
  return timeConfig$.flatMap(timeConfig =>
    getKubernetesClusterByNode({
      filter: {
        resourceSnapshotId: nodeSnapshotId,
        timeConfig
      }
    })
      .map((result: { data: any }) => result.data)
      .filter(Boolean)
  );
}
function getNamespacesByCluster(clusterSnapshotId: string): Observable<SnapshotData[]> {
  return timeConfig$.flatMap(timeConfig =>
    getKubernetesNamespacesByCluster({
      snapshotId: clusterSnapshotId,
      timeConfig: timeConfig
    }).flatMap(getSnapshots)
  );
}
