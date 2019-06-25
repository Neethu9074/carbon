import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getOpenShiftDeploymentConfig$ from 'in-subscription/kubernetes/getOpenShiftDeploymentConfig';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    deploymentConfig: getOpenShiftDeploymentConfig$({
      id: props.deploymentConfigId,
      timeConfig: props.timeConfig
    }).map(result => (result.data ? result.data : null))
  }),
  function DeploymentConfigBreadcrumb({ deploymentConfigId, deploymentConfig, href$ }) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={deploymentConfigId}
        render={healthInfo => (
          <Breadcrumb label="Deployment Config" icon="lib_kubernetes_workload" href$={href$} healthInfo={healthInfo}>
            {deploymentConfig && deploymentConfig.name}
          </Breadcrumb>
        )}
      />
    );
  }
);
