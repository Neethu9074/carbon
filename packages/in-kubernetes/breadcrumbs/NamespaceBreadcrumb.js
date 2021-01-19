/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    namespace: getKubernetesNamespace({
      id: props.namespaceId,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data : null))
  }),
  function NamespaceBreadcrumb({ namespaceId, namespace, href$ }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={namespaceId}
        render={healthInfo => (
          <Breadcrumb label="Namespace" icon="lib_kubernetes_namespace" href$={href$} healthInfo={healthInfo}>
            {namespace && namespace.label}
          </Breadcrumb>
        )}
      />
    );
  }
);
