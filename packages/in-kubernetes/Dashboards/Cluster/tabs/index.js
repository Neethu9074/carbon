/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  getDaemonSetDashboard,
  getDeploymentDashboard,
  getDeploymentConfigDashboard,
  getStatefulSetDashboard
} from 'in-kubernetes/navigation/paths';
import WorkloadControllers from 'in-kubernetes/Dashboards/commonComponents/commonTabs/WorkloadControllers';
import getOpenShiftDeploymentConfigs from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import getKubernetesStatefulSets from 'in-subscription/kubernetes/getKubernetesStatefulSets';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import Namespaces from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Namespaces';
import getKubernetesDaemonSets from 'in-subscription/kubernetes/getKubernetesDaemonSets';
import PersistentVolumes from 'in-kubernetes/Dashboards/Cluster/tabs/PersistentVolumes';
import CronJobs from 'in-kubernetes/Dashboards/commonComponents/commonTabs/CronJobs';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import Infrastructure from 'in-kubernetes/Dashboards/Cluster/tabs/Infrastructure';
import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import { ClusterTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import { persistentVolumeSupportEnabled } from 'in-services/featureFlags';
import Details from 'in-kubernetes/Dashboards/Cluster/tabs/Details';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary';
import Pods from 'in-kubernetes/Dashboards/Cluster/tabs/Pods';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${clusterDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${clusterDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.events'),
    path: `${clusterDashboardFullyQualified}/events`,
    component: Events
  },
  {
    label: t('in-kubernetes:dashboards.nodes'),
    path: `${clusterDashboardFullyQualified}/nodes`,
    component: Nodes,
    header: props => getCounterComponent(props, v => v.nodes)
  },
  {
    label: t('in-kubernetes:dashboards.namespaces'),
    path: `${clusterDashboardFullyQualified}/namespaces`,
    component: Namespaces,
    header: props => getCounterComponent(props, v => v.namespaces)
  },
  {
    label: t('in-kubernetes:dashboards.deployments'),
    path: `${clusterDashboardFullyQualified}/deployments`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deployment',
        getWorkloadControllers$: getKubernetesDeployments,
        getWorkloadControllerDashboard: getDeploymentDashboard,
        pathSegment: '/deployments',
        entityName: 'deployments'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deployments)
  },
  {
    label: t('in-kubernetes:dashboards.deploymentConfigs'),
    path: `${clusterDashboardFullyQualified}/deploymentconfigs`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deploymentConfig',
        getWorkloadControllers$: getOpenShiftDeploymentConfigs,
        getWorkloadControllerDashboard: getDeploymentConfigDashboard,
        pathSegment: '/deploymentconfigs',
        entityName: 'deploymentConfigs'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deploymentConfigs)
  },
  {
    label: t('in-kubernetes:dashboards.daemonSets'),
    path: `${clusterDashboardFullyQualified}/daemonsets`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'daemonset',
        getWorkloadControllers$: getKubernetesDaemonSets,
        getWorkloadControllerDashboard: getDaemonSetDashboard,
        pathSegment: '/daemonsets',
        entityName: 'daemonsets'
      }),
    header: props => getCounterComponent(props, v => v.workloads.daemonSets)
  },
  {
    label: t('in-kubernetes:dashboards.statefulSets'),
    path: `${clusterDashboardFullyQualified}/statefulsets`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'statefulset',
        getWorkloadControllers$: getKubernetesStatefulSets,
        getWorkloadControllerDashboard: getStatefulSetDashboard,
        pathSegment: '/statefulsets',
        entityName: 'statefulsets'
      }),
    header: props => getCounterComponent(props, v => v.workloads.statefulSets)
  },
  {
    label: t('in-kubernetes:dashboards.cronJobs'),
    path: `${clusterDashboardFullyQualified}/cronjobs`,
    component: CronJobs,
    header: props => getCounterComponent(props, v => v.cronJobs)
  },
  {
    label: t('in-kubernetes:dashboards.k8SServices'),
    path: `${clusterDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${clusterDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.workloads.pods),
    stickToBottom: true
  },
  persistentVolumeSupportEnabled && {
    label: t('in-kubernetes:dashboards.persistentVolumes'),
    path: `${clusterDashboardFullyQualified}/persistentvolumes`,
    component: PersistentVolumes,
    header: props => getCounterComponent(props, v => v.persistentVolumes),
    stickToBottom: true
  },
  {
    label: t('in-kubernetes:dashboards.infrastructure'),
    path: `${clusterDashboardFullyQualified}/hosts`,
    component: Infrastructure,
    header: props => getCounterComponent(props, v => v.nodes)
  }
].filter(Boolean);

function getCounterComponent({ clusterId, tab, timeConfig }, valueExtractor) {
  return <ClusterTab clusterId={clusterId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />;
}
