/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WorkloadControllerDashboard from 'in-kubernetes/Dashboards/commonComponents/WorkloadController/WorkloadControllerDashboard';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import { statefulSetId as matrixStatefulSetId } from 'in-kubernetes/navigation/matrix';
import { WorkloadControllerBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { statefulSetDashboard } from 'in-kubernetes/navigation/paths';
import tabs from 'in-kubernetes/Dashboards/StatefulSet/tabs/index';
import { statefulSetTabChange } from 'in-kubernetes/tracker';
import { plugins } from 'in-forge/constants';

export default function StatefulSetDashboard({ location }) {
  return (
    <WorkloadControllerDashboard
      location={location}
      workloadControllerType="statefulSet"
      plugin={plugins.kubernetesStatefulSet}
      dashboardPath={statefulSetDashboard}
      matrixParameterId={matrixStatefulSetId}
      BreadCrumbComponent={WorkloadControllerBreadcrumbs}
      workloadControllerSubscriptionName={getKubernetesWorkloadController}
      tabChangeTracker={statefulSetTabChange}
      headerTitle="Kubernetes StatefulSet"
      badgeType="K8s StatefulSet"
      tabs={tabs}
    />
  );
}
