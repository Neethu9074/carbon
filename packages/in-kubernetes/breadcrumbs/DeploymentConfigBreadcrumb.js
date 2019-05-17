import React from 'react';

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
  function DeploymentConfigBreadcrumb({ deploymentConfig, href$ }) {
    return (
      <Breadcrumb label="Deployment Config" icon="lib_kubernetes_workload" href$={href$}>
        {deploymentConfig && deploymentConfig.name}
      </Breadcrumb>
    );
  }
);
