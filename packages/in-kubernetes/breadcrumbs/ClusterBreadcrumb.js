import { get } from 'lodash';
import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    cluster: getKubernetesCluster({
      id: props.clusterId,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data : null))
  }),
  function ClusterBreadcrumb({ clusterId, cluster, href$ }) {
    const distributionType = get(cluster, ['distributionType'], 'Kubernetes');
    const clusterIcon = `lib_${distributionType.toLowerCase()}`;

    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={clusterId}
        render={healthInfo => (
          <Breadcrumb label="Cluster" icon={clusterIcon} href$={href$} healthInfo={healthInfo}>
            {cluster && cluster.label}
          </Breadcrumb>
        )}
      />
    );
  }
);
