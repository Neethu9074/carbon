import React from 'react';

import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    cluster: getKubernetesCluster({
      id: props.clusterId,
      timeConfig: props.timeConfig
    }).map(result => result.data)
  }),
  function ClusterBreadcrumb({ cluster }) {
    return (
      <Breadcrumb label="Cluster" icon="lib_kubernetes_cluster">
        {cluster && cluster.name}
      </Breadcrumb>
    );
  }
);
