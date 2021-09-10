/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WorkloadControllerDashboard from 'in-kubernetes/Dashboards/commonComponents/WorkloadController/WorkloadControllerDashboard';
import getKubernetesWorkloadController from 'in-kubernetes/subscriptions/getKubernetesWorkloadController';
import { deploymentConfigId as matrixDeploymentConfigId } from 'in-kubernetes/navigation/matrix';
import { deploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import { WorkloadControllerBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/DeploymentConfig/tabs/index';
import { deploymentConfigTabChange } from 'in-kubernetes/tracker';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

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
      headerTitle={t('in-kubernetes:dashboards.kubernetesDeploymentConfig')}
      badgeType={t('in-kubernetes:dashboards.k8SDeploymentConfig')}
      tabs={tabs}
    />
  );
}
