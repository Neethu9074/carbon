import React from 'react';

import {
  getDaemonSetDashboard,
  getDeploymentDashboard,
  getDeploymentConfigDashboard,
  getStatefulSetDashboard
} from 'in-kubernetes/navigation/paths';
import WorkloadControllers from 'in-kubernetes/Dashboards/commonComponents/commonTabs/WorkloadControllers';
import CronJobs from 'in-kubernetes/Dashboards/commonComponents/commonTabs/CronJobs';
import getOpenShiftDeploymentConfigs from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import { ClusterTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import Namespaces from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Namespaces';
import getKubernetesDaemonSets from 'in-subscription/kubernetes/getKubernetesDaemonSets';
import getKubernetesStatefulSets from 'in-subscription/kubernetes/getKubernetesStatefulSets';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import Infrastructure from 'in-kubernetes/Dashboards/Cluster/tabs/Infrastructure';
import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import Details from 'in-kubernetes/Dashboards/Cluster/tabs/Details';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary';
import Pods from 'in-kubernetes/Dashboards/Cluster/tabs/Pods';
import PersistentVolumes from 'in-kubernetes/Dashboards/Cluster/tabs/PersistentVolumes';
import { persistentVolumeSupportEnabled } from 'in-services/featureFlags';

export default [
  {
    label: 'Summary',
    path: `${clusterDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${clusterDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${clusterDashboardFullyQualified}/events`,
    component: Events
  },
  {
    label: 'Nodes',
    path: `${clusterDashboardFullyQualified}/nodes`,
    component: Nodes,
    header: props => getCounterComponent(props, v => v.nodes)
  },
  {
    label: 'Namespaces',
    path: `${clusterDashboardFullyQualified}/namespaces`,
    component: Namespaces,
    header: props => getCounterComponent(props, v => v.namespaces)
  },
  {
    label: 'Deployments',
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
    label: 'Deployment Configs',
    path: `${clusterDashboardFullyQualified}/deploymentconfigs`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deploymentConfig',
        getWorkloadControllers$: getOpenShiftDeploymentConfigs,
        getWorkloadControllerDashboard: getDeploymentConfigDashboard,
        pathSegment: '/deploymentconfigs',
        entityName: 'deployment configs'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deploymentConfigs)
  },
  {
    label: 'DaemonSets',
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
    label: 'StatefulSets',
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
    label: 'Cron Jobs',
    path: `${clusterDashboardFullyQualified}/cronjobs`,
    component: CronJobs,
    header: props => getCounterComponent(props, v => v.cronJobs)
  },
  {
    label: 'K8s Services',
    path: `${clusterDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: 'Pods',
    path: `${clusterDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.workloads.pods),
    stickToBottom: true
  },
  persistentVolumeSupportEnabled && {
    label: 'Persistent Volumes',
    path: `${clusterDashboardFullyQualified}/persistentvolumes`,
    component: PersistentVolumes,
    header: props => getCounterComponent(props, v => v.persistentVolumes),
    stickToBottom: true
  },
  {
    label: 'Infrastructure',
    path: `${clusterDashboardFullyQualified}/hosts`,
    component: Infrastructure,
    header: props => getCounterComponent(props, v => v.nodes)
  }
].filter(Boolean);

function getCounterComponent({ clusterId, tab, timeConfig }, valueExtractor) {
  return <ClusterTab clusterId={clusterId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />;
}
