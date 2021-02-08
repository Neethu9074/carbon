/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import WorkloadControllerDashboard from 'in-kubernetes/Dashboards/commonComponents/WorkloadController/WorkloadControllerDashboard';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import { deploymentId as matrixDeploymentId } from 'in-kubernetes/navigation/matrix';
import { WorkloadControllerBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { deploymentDashboard } from 'in-kubernetes/navigation/paths';
import tabs from 'in-kubernetes/Dashboards/Deployment/tabs/index';
import { deploymentTabChange } from 'in-kubernetes/tracker';
import { plugins } from 'in-forge/constants';

export default function DeploymentDashboard({ location }) {
  return (
    <WorkloadControllerDashboard
      location={location}
      workloadControllerType="deployment"
      plugin={plugins.kubernetesDeployment}
      dashboardPath={deploymentDashboard}
      matrixParameterId={matrixDeploymentId}
      BreadCrumbComponent={WorkloadControllerBreadcrumbs}
      workloadControllerSubscriptionName={getKubernetesWorkloadController}
      tabChangeTracker={deploymentTabChange}
      headerTitle={t('in-kubernetes:dashboards.kubernetesDeployment')}
      badgeType={t('in-kubernetes:dashboards.k8SDeployment')}
      tabs={tabs}
    />
  );
}
