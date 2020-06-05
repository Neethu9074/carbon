import React from 'react';

import WorkloadControllerDashboard from 'in-kubernetes/Dashboards/commonComponents/WorkloadController/WorkloadControllerDashboard';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import { deploymentId as matrixDeploymentId } from 'in-kubernetes/navigation/matrix';
import { WorkloadControllerBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { deploymentDashboard } from 'in-kubernetes/navigation/paths';
import { plugins, fullyQualifiedPlugins } from 'in-forge/constants';
import tabs from 'in-kubernetes/Dashboards/Deployment/tabs/index';
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
      BreadCrumbComponent={WorkloadControllerBreadcrumbs}
      workloadControllerSubscriptionName={getKubernetesWorkloadController}
      tabChangeTracker={deploymentTabChange}
      headerTitle="Deployment"
      badgeType="K8s Deployment"
      tabs={tabs}
    />
  );
}
