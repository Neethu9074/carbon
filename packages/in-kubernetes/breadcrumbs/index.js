/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getNamespaceDashboard,
  getClusterDashboard,
  getDaemonSetDashboard,
  getDeploymentDashboard,
  getDeploymentConfigDashboard,
  getStatefulSetDashboard
} from 'in-kubernetes/navigation/paths';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import WorkloadControllerBreadcrumb from 'in-kubernetes/breadcrumbs/WorkloadControllerBreadcrumb';
import NamespaceBreadcrumb from 'in-kubernetes/breadcrumbs/NamespaceBreadcrumb';
import HomeViewBreadcrumb from 'in-kubernetes/breadcrumbs/HomeViewBreadcrumb';
import ClusterBreadcrumb from 'in-kubernetes/breadcrumbs/ClusterBreadcrumb';
import ServiceBreadcrumb from 'in-kubernetes/breadcrumbs/ServiceBreadcrumb';
import CronJobBreadcrumb from 'in-kubernetes/breadcrumbs/CronJobBreadcrumb';
import NodeBreadcrumb from 'in-kubernetes/breadcrumbs/NodeBreadcrumb';
import PodBreadcrumb from 'in-kubernetes/breadcrumbs/PodBreadcrumb';
import { fullyQualifiedPlugins } from 'in-forge/constants';
import { t } from 'in-i18n';

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

export function CronJobBreadcrumbs(props) {
  const { cronJobId, clusterId, namespaceId } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    cronJobId && <CronJobBreadcrumb {...props} />
  ];
}

export function PodBreadcrumbs(props) {
  const { podId, clusterId, namespaceId, workloadControllerId, workloadControllerType } = props;
  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href$={getClusterDashboard(clusterId)} />,
    namespaceId && <NamespaceBreadcrumb {...props} href$={getNamespaceDashboard(namespaceId)} />,
    workloadControllerId && workloadControllerType === fullyQualifiedPlugins.kubernetesDaemonSet && (
      <WorkloadControllerBreadcrumb
        {...props}
        headerTitle={t('in-kubernetes:breadcrumbs.daemonSet')}
        href$={getDaemonSetDashboard(workloadControllerId)}
        workloadControllerId={workloadControllerId}
        workloadControllerSubscriptionName={getKubernetesWorkloadController}
      />
    ),
    workloadControllerId && workloadControllerType === fullyQualifiedPlugins.kubernetesStatefulSet && (
      <WorkloadControllerBreadcrumb
        {...props}
        headerTitle={t('in-kubernetes:breadcrumbs.statefulSet')}
        href$={getStatefulSetDashboard(workloadControllerId)}
        workloadControllerId={workloadControllerId}
        workloadControllerSubscriptionName={getKubernetesWorkloadController}
      />
    ),
    workloadControllerId && workloadControllerType === fullyQualifiedPlugins.kubernetesDeployment && (
      <WorkloadControllerBreadcrumb
        {...props}
        headerTitle={t('in-kubernetes:breadcrumbs.deployment')}
        href$={getDeploymentDashboard(workloadControllerId)}
        workloadControllerId={workloadControllerId}
        workloadControllerSubscriptionName={getKubernetesWorkloadController}
      />
    ),
    workloadControllerId && workloadControllerType === fullyQualifiedPlugins.openshiftDeploymentConfig && (
      <WorkloadControllerBreadcrumb
        {...props}
        headerTitle={t('in-kubernetes:breadcrumbs.deploymentConfig')}
        href$={getDeploymentConfigDashboard(workloadControllerId)}
        workloadControllerId={workloadControllerId}
        workloadControllerSubscriptionName={getKubernetesWorkloadController}
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
