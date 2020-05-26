import React from 'react';

import {
  getNamespaceDashboard,
  getClusterDashboard,
  getDeploymentDashboard,
  getDeploymentConfigDashboard
} from 'in-kubernetes/navigation/paths';
import WorkloadControllerBreadcrumb from 'in-kubernetes/breadcrumbs/WorkloadControllerBreadcrumb';
import getOpenShiftDeploymentConfig from 'in-subscription/kubernetes/getOpenShiftDeploymentConfig';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import NamespaceBreadcrumb from 'in-kubernetes/breadcrumbs/NamespaceBreadcrumb';
import HomeViewBreadcrumb from 'in-kubernetes/breadcrumbs/HomeViewBreadcrumb';
import ClusterBreadcrumb from 'in-kubernetes/breadcrumbs/ClusterBreadcrumb';
import ServiceBreadcrumb from 'in-kubernetes/breadcrumbs/ServiceBreadcrumb';
import NodeBreadcrumb from 'in-kubernetes/breadcrumbs/NodeBreadcrumb';
import PodBreadcrumb from 'in-kubernetes/breadcrumbs/PodBreadcrumb';
import { fullyQualifiedPlugins } from 'in-forge/constants';

export function ClusterBreadcrumbs(props) {
  const { clusterId } = props;
  return [<HomeViewBreadcrumb />, clusterId && <ClusterBreadcrumb {...props} />];
}

export function NamespaceBreadcrumbs(props) {
  const { namespaceId, clusterId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} />
  ];
}

export function ServiceBreadcrumbs(props) {
  const { serviceId, namespaceId, clusterId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    serviceId && <ServiceBreadcrumb {...props} />
  ];
}

export function NodeBreadcrumbs(props) {
  const { nodeId, clusterId, namespaceId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    nodeId && <NodeBreadcrumb {...props} />
  ];
}

export function PodBreadcrumbs(props) {
  const { podId, clusterId, namespaceId, workloadControllerId, workloadControllerType } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    workloadControllerId &&
      workloadControllerType === fullyQualifiedPlugins.kubernetesDeployment && (
        <WorkloadControllerBreadcrumb
          {...props}
          href$={getDeploymentDashboard(workloadControllerId)}
          workloadControllerId={workloadControllerId}
          workloadControllerSubscriptionName={getKubernetesDeployment}
        />
      ),
    workloadControllerId &&
      workloadControllerType === fullyQualifiedPlugins.openshiftDeploymentConfig && (
        <WorkloadControllerBreadcrumb
          {...props}
          href$={getDeploymentConfigDashboard(workloadControllerId)}
          workloadControllerId={workloadControllerId}
          workloadControllerSubscriptionName={getOpenShiftDeploymentConfig}
        />
      ),
    podId && <PodBreadcrumb {...props} />
  ];
}

export function WorkloadControllerBreadcrumbs(props) {
  const { workloadControllerId, clusterId, namespaceId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    workloadControllerId && <WorkloadControllerBreadcrumb {...props} />
  ];
}
