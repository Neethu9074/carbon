/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WorkloadControllerDashboard from 'in-kubernetes/Dashboards/commonComponents/WorkloadController/WorkloadControllerDashboard';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import { deploymentConfigId as matrixDeploymentConfigId } from 'in-kubernetes/navigation/matrix';
import { deploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import { WorkloadControllerBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/DeploymentConfig/tabs/index';
import { deploymentConfigTabChange } from 'in-kubernetes/tracker';
import { plugins } from 'in-forge/constants';

export default function DeploymentConfigDashboard({ location }) {
  return (
    <WorkloadControllerDashboard
      location={location}
      workloadControllerType="deploymentConfig"
      plugin={plugins.openshiftDeploymentConfig}
      dashboardPath={deploymentConfigDashboard}
      matrixParameterId={matrixDeploymentConfigId}
      BreadCrumbComponent={WorkloadControllerBreadcrumbs}
      workloadControllerSubscriptionName={getKubernetesWorkloadController}
      tabChangeTracker={deploymentConfigTabChange}
      headerTitle="Kubernetes Deployment Config"
      badgeType="K8s Deployment Config"
      tabs={tabs}
    />
  );
}
