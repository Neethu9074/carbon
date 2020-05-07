import React from 'react';

import WorkloadControllerDashboard from 'in-kubernetes/Dashboards/commonComponents/WorkloadController/WorkloadControllerDashboard';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import { deploymentId as matrixDeploymentId } from 'in-kubernetes/navigation/matrix';
import { deploymentDashboard } from 'in-kubernetes/navigation/paths';
import { plugins, fullyQualifiedPlugins } from 'in-forge/constants';
import tabs from 'in-kubernetes/Dashboards/Deployment/tabs/index';
import { DeploymentBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { deploymentTabChange } from 'in-kubernetes/tracker';

export default function DeploymentDashboard({ location }) {
  return (
    <WorkloadControllerDashboard
      location={location}
      workloadControllerType="deployment"
      shortPluginName={plugins.kubernetesDeployment}
      fullyQualifiedPluginName={fullyQualifiedPlugins.kubernetesDeployment}
      dashboardPath={deploymentDashboard}
      matrixParameterId={matrixDeploymentId}
      BreadCrumbComponent={DeploymentBreadcrumbs}
      getWorkloadControllerSubscription={getKubernetesDeployment}
      tabChangeTracker={deploymentTabChange}
      headerTitle="Deployment"
      badgeType="K8s Deployment"
      tabs={tabs}
    />
  );
}
