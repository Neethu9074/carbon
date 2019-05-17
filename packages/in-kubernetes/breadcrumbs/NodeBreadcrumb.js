import React from 'react';

import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    node: getKubernetesNode({
      id: props.nodeId,
      timeConfig: props.timeConfig
    }).map(result => result.data)
  }),
  function NodeBreadcrumb({ node, href$ }) {
    return (
      <Breadcrumb label="Node" icon="lib_kubernetes_node" href$={href$}>
        {node && node.name}
      </Breadcrumb>
    );
  }
);
