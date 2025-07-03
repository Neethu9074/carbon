/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  useClusterDashboard,
  useOtelClusterDashboard,
  useOtelNodeDashboard,
  useCronJobDashboard,
  useNamespaceDashboard,
  useDaemonSetDashboard,
  useDeploymentDashboard,
  useDeploymentConfigDashboard,
  useStatefulSetDashboard
} from 'in-kubernetes/navigation/paths';
import getKubernetesWorkloadController from 'in-kubernetes/subscriptions/getKubernetesWorkloadController';
import PersistentVolumeClaimBreadcrumb from 'in-kubernetes/breadcrumbs/PersistentVolumeClaimBreadcrumb';
import WorkloadControllerBreadcrumb from 'in-kubernetes/breadcrumbs/WorkloadControllerBreadcrumb';
import PersistentVolumeBreadcrumb from 'in-kubernetes/breadcrumbs/PersistentVolumeBreadcrumb';
import getOtelKubernetesCluster from 'in-kubernetes/subscriptions/getOtelKubernetesCluster';
import getKubernetesCluster from 'in-kubernetes/subscriptions/getKubernetesCluster';
import NamespaceBreadcrumb from 'in-kubernetes/breadcrumbs/NamespaceBreadcrumb';
import HomeViewBreadcrumb from 'in-kubernetes/breadcrumbs/HomeViewBreadcrumb';
import ClusterBreadcrumb from 'in-kubernetes/breadcrumbs/ClusterBreadcrumb';
import ServiceBreadcrumb from 'in-kubernetes/breadcrumbs/ServiceBreadcrumb';
import CronJobBreadcrumb from 'in-kubernetes/breadcrumbs/CronJobBreadcrumb';
import OtelPodBreadcrumb from 'in-kubernetes/breadcrumbs/OtelPodBreadcrumb';
import NodeBreadcrumb from 'in-kubernetes/breadcrumbs/NodeBreadcrumb';
import PodBreadcrumb from 'in-kubernetes/breadcrumbs/PodBreadcrumb';
import { fullyQualifiedPlugins } from 'in-forge/constants';
import { t } from 'in-i18n';

export function ClusterBreadcrumbs(props) {
  const { clusterId, isOtelCluster } = props;

  return [
    <HomeViewBreadcrumb />,
    clusterId && (
      <ClusterBreadcrumb {...props} subscription={isOtelCluster ? getOtelKubernetesCluster : getKubernetesCluster} />
    )
  ];
}

export function NamespaceBreadcrumbs(props) {
  const { namespaceId, clusterId } = props;

  const clusterHref = useClusterDashboard(clusterId);

  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href={clusterHref} />,
    namespaceId && <NamespaceBreadcrumb {...props} />
  ];
}

export function ServiceBreadcrumbs(props) {
  const { serviceId, namespaceId, clusterId } = props;

  const clusterHref = useClusterDashboard(clusterId);
  const namespaceHref = useNamespaceDashboard(namespaceId);

  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href={clusterHref} />,
    namespaceId && <NamespaceBreadcrumb {...props} href={namespaceHref} />,
    serviceId && <ServiceBreadcrumb {...props} />
  ];
}

export function NodeBreadcrumbs(props) {
  const { nodeId, clusterId, namespaceId, isOtelCluster } = props;

  const clusterHref = isOtelCluster ? useOtelClusterDashboard(clusterId) : useClusterDashboard(clusterId);
  const namespaceHref = useNamespaceDashboard(namespaceId);

  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href={clusterHref} />,
    namespaceId && <NamespaceBreadcrumb {...props} href={namespaceHref} />,
    nodeId && <NodeBreadcrumb {...props} />
  ];
}

export function PersistentVolumeBreadcrumbs(props) {
  const { persistentVolumeId, clusterId } = props;

  const clusterHref = useClusterDashboard(clusterId);

  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href={clusterHref} />,
    persistentVolumeId && <PersistentVolumeBreadcrumb {...props} />
  ];
}

export function PersistentVolumeClaimBreadcrumbs(props) {
  const { persistentVolumeClaimId, clusterId, namespaceId } = props;

  const clusterHref = useClusterDashboard(clusterId);
  const namespaceHref = useNamespaceDashboard(namespaceId);

  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href={clusterHref} />,
    namespaceId && <NamespaceBreadcrumb {...props} href={namespaceHref} />,
    persistentVolumeClaimId && <PersistentVolumeClaimBreadcrumb {...props} />
  ];
}

export function CronJobBreadcrumbs(props) {
  const { cronJobId, clusterId, namespaceId } = props;

  const clusterHref = useClusterDashboard(clusterId);
  const namespaceHref = useNamespaceDashboard(namespaceId);

  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href={clusterHref} />,
    namespaceId && <NamespaceBreadcrumb {...props} href={namespaceHref} />,
    cronJobId && <CronJobBreadcrumb {...props} />
  ];
}

export function PodBreadcrumbs(props) {
  const {
    podId,
    cronJobId,
    clusterId,
    namespaceId,
    workloadControllerId,
    workloadControllerType,
    nodeId,
    isOtelCluster
  } = props;

  const clusterHref = isOtelCluster ? useOtelClusterDashboard(clusterId) : useClusterDashboard(clusterId);
  const nodeHref = useOtelNodeDashboard(nodeId);
  const namespaceHref = useNamespaceDashboard(namespaceId);
  const daemonSetHref = useDaemonSetDashboard(workloadControllerId);
  const statefulSetHref = useStatefulSetDashboard(workloadControllerId);
  const deploymentHref = useDeploymentDashboard(workloadControllerId);
  const deploymentConfigHref = useDeploymentConfigDashboard(workloadControllerId);
  const cronJobHref = useCronJobDashboard(cronJobId, { podId });

  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href={clusterHref} />,
    isOtelCluster && nodeId && <NodeBreadcrumb {...props} href={nodeHref} />,
    namespaceId && <NamespaceBreadcrumb {...props} href={namespaceHref} />,
    workloadControllerId && workloadControllerType === fullyQualifiedPlugins.kubernetesDaemonSet && (
      <WorkloadControllerBreadcrumb
        {...props}
        headerTitle={t('in-kubernetes:breadcrumbs.daemonSet')}
        href={daemonSetHref}
        workloadControllerId={workloadControllerId}
        workloadControllerSubscriptionName={getKubernetesWorkloadController}
      />
    ),
    workloadControllerId && workloadControllerType === fullyQualifiedPlugins.kubernetesStatefulSet && (
      <WorkloadControllerBreadcrumb
        {...props}
        headerTitle={t('in-kubernetes:breadcrumbs.statefulSet')}
        href={statefulSetHref}
        workloadControllerId={workloadControllerId}
        workloadControllerSubscriptionName={getKubernetesWorkloadController}
      />
    ),
    workloadControllerId && workloadControllerType === fullyQualifiedPlugins.kubernetesDeployment && (
      <WorkloadControllerBreadcrumb
        {...props}
        headerTitle={t('in-kubernetes:breadcrumbs.deployment')}
        href={deploymentHref}
        workloadControllerId={workloadControllerId}
        workloadControllerSubscriptionName={getKubernetesWorkloadController}
      />
    ),
    workloadControllerId && workloadControllerType === fullyQualifiedPlugins.openshiftDeploymentConfig && (
      <WorkloadControllerBreadcrumb
        {...props}
        headerTitle={t('in-kubernetes:breadcrumbs.deploymentConfig')}
        href={deploymentConfigHref}
        workloadControllerId={workloadControllerId}
        workloadControllerSubscriptionName={getKubernetesWorkloadController}
      />
    ),
    clusterId && cronJobId && <CronJobBreadcrumb {...props} href={cronJobHref} />,
    isOtelCluster && podId && <OtelPodBreadcrumb {...props} />,
    !isOtelCluster && podId && <PodBreadcrumb {...props} />
  ];
}

export function WorkloadControllerBreadcrumbs(props) {
  const { workloadControllerId, clusterId, namespaceId } = props;

  const clusterHref = useClusterDashboard(clusterId);
  const namespaceHref = useNamespaceDashboard(namespaceId);

  return [
    <HomeViewBreadcrumb />,
    clusterId && <ClusterBreadcrumb {...props} href={clusterHref} />,
    namespaceId && <NamespaceBreadcrumb {...props} href={namespaceHref} />,
    workloadControllerId && <WorkloadControllerBreadcrumb {...props} />
  ];
}
