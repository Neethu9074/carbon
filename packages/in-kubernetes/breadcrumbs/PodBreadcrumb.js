/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    pod: getKubernetesPod({
      id: props.podId,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data : null))
  }),
  function NodeBreadPodBreadcrumbcrumb({ podId, pod, href$ }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={podId}
        render={healthInfo => (
          <Breadcrumb label="Pod" icon="lib_kubernetes_pod" href$={href$} healthInfo={healthInfo}>
            {pod && pod.label}
          </Breadcrumb>
        )}
      />
    );
  }
);
