import React from 'react';

import {
  getDaemonSetDashboard,
  getDeploymentDashboard,
  getDeploymentConfigDashboard,
  getStatefulSetDashboard
} from 'in-kubernetes/navigation/paths';
import WorkloadControllers from 'in-kubernetes/Dashboards/commonComponents/commonTabs/WorkloadControllers';
import getOpenShiftDeploymentConfigs$ from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { NamespaceTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import getKubernetesDeployments$ from 'in-subscription/kubernetes/getKubernetesDeployments';
import getKubernetesDaemonSets from 'in-subscription/kubernetes/getKubernetesDaemonSets';
import getKubernetesStatefulSets from 'in-subscription/kubernetes/getKubernetesStatefulSets';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { namespaceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Summary from 'in-kubernetes/Dashboards/Namespace/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Namespace/tabs/Details';
import Pods from 'in-kubernetes/Dashboards/Namespace/tabs/Pods';
import CronJobs from 'in-kubernetes/Dashboards/commonComponents/commonTabs/CronJobs';

export default [
  {
    label: 'Summary',
    path: `${namespaceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${namespaceDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${namespaceDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: 'Deployments',
    path: `${namespaceDashboardFullyQualified}/deployments`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deployment',
        getWorkloadControllers$: getKubernetesDeployments$,
        getWorkloadControllerDashboard: getDeploymentDashboard,
        pathSegment: '/deployments',
        entityName: 'deployments'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deployments)
  },
  {
    label: 'Deployment Configs',
    path: `${namespaceDashboardFullyQualified}/deploymentconfigs`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deploymentConfig',
        getWorkloadControllers$: getOpenShiftDeploymentConfigs$,
        getWorkloadControllerDashboard: getDeploymentConfigDashboard,
        pathSegment: '/deploymentconfigs',
        entityName: 'deployment configs'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deploymentConfigs)
  },
  {
    label: 'DaemonSets',
    path: `${namespaceDashboardFullyQualified}/daemonsets`,
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
    path: `${namespaceDashboardFullyQualified}/statefulsets`,
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
    path: `${namespaceDashboardFullyQualified}/cronjobs`,
    component: CronJobs,
    header: props => getCounterComponent(props, v => v.cronJobs)
  },
  {
    label: 'K8s Services',
    path: `${namespaceDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: 'Pods',
    path: `${namespaceDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.workloads.pods),
    stickToBottom: true
  }
].filter(Boolean);

function getCounterComponent({ namespaceId, tab, timeConfig }, valueExtractor) {
  return (
    <NamespaceTab namespaceId={namespaceId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />
  );
}
