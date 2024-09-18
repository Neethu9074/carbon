/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WorkloadControllerDashboard from 'in-kubernetes/Dashboards/commonComponents/WorkloadController/WorkloadControllerDashboard';
import getKubernetesWorkloadController from 'in-kubernetes/subscriptions/getKubernetesWorkloadController';
import { deploymentId as matrixDeploymentId } from 'in-kubernetes/navigation/matrix';
import { WorkloadControllerBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { deploymentDashboard } from 'in-kubernetes/navigation/paths';
import tabs from 'in-kubernetes/Dashboards/Deployment/tabs/index';
import { useSegmentTracker } from 'in-kubernetes/tracker';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

export default function DeploymentDashboard({ location }) {
  const { k8sTabChange } = useSegmentTracker();
  return (
    <WorkloadControllerDashboard
      location={location}
      workloadControllerType="deployment"
      plugin={plugins.kubernetesDeployment}
      dashboardPath={deploymentDashboard}
      matrixParameterId={matrixDeploymentId}
      BreadCrumbComponent={WorkloadControllerBreadcrumbs}
      workloadControllerSubscriptionName={getKubernetesWorkloadController}
      tabChangeTracker={e =>
        k8sTabChange({
          ...e,
          dashboard: 'deployment',
          path: location.pathname
        })
      }
      headerTitle={t('in-kubernetes:dashboards.kubernetesDeployment')}
      badgeType={t('in-kubernetes:dashboards.k8SDeployment')}
      tabs={tabs}
    />
  );
}
