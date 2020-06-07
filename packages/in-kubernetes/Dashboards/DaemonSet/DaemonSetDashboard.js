import React from 'react';

import WorkloadControllerDashboard from 'in-kubernetes/Dashboards/commonComponents/WorkloadController/WorkloadControllerDashboard';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import { daemonSetId as matrixDaemonSetId } from 'in-kubernetes/navigation/matrix';
import { WorkloadControllerBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { daemonSetDashboard } from 'in-kubernetes/navigation/paths';
import { plugins, fullyQualifiedPlugins } from 'in-forge/constants';
import tabs from 'in-kubernetes/Dashboards/DaemonSet/tabs/index';
import { daemonSetTabChange } from 'in-kubernetes/tracker';

export default function DaemonSetDashboard({ location }) {
  return (
    <WorkloadControllerDashboard
      location={location}
      workloadControllerType="daemonSet"
      shortPluginName={plugins.kubernetesDaemonSet}
      fullyQualifiedPluginName={fullyQualifiedPlugins.kubernetesDaemonSet}
      dashboardPath={daemonSetDashboard}
      matrixParameterId={matrixDaemonSetId}
      BreadCrumbComponent={WorkloadControllerBreadcrumbs}
      workloadControllerSubscriptionName={getKubernetesWorkloadController}
      tabChangeTracker={daemonSetTabChange}
      headerTitle="DaemonSet"
      badgeType="K8s DaemonSet"
      tabs={tabs}
    />
  );
}
