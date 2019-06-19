import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    deployment: getKubernetesDeployment({
      id: props.deploymentId,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data : null))
  }),
  function DeploymentBreadcrumb({ deploymentId, deployment, href$ }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={deploymentId}
        render={healthInfo => (
          <Breadcrumb label="Deployment" icon="lib_kubernetes_workload" href$={href$} healthInfo={healthInfo}>
            {deployment && deployment.name}
          </Breadcrumb>
        )}
      />
    );
  }
);
