import React from 'react';

import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    namespace: getKubernetesNamespace({
      id: props.namespaceId,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data.namespace : null))
  }),
  function NamespaceBreadcrumb({ namespace, href$ }) {
    return (
      <Breadcrumb label="Namespace" icon="lib_kubernetes_namespace" href$={href$}>
        {namespace && namespace.label}
      </Breadcrumb>
    );
  }
);
