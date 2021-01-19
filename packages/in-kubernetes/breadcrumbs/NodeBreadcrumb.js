/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    node: getKubernetesNode({
      id: props.nodeId,
      timeConfig: props.timeConfig
    }).map(result => result.data)
  }),
  function NodeBreadcrumb({ nodeId, node, href$ }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={nodeId}
        render={healthInfo => (
          <Breadcrumb label="Node" icon="lib_kubernetes_node" snapshotId={nodeId} href$={href$} healthInfo={healthInfo}>
            {node && node.name}
          </Breadcrumb>
        )}
      />
    );
  }
);
