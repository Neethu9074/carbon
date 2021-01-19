/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  getDaemonSetDashboard,
  getDeploymentDashboard,
  getDeploymentConfigDashboard,
  getStatefulSetDashboard
} from 'in-kubernetes/navigation/paths';
import WorkloadControllers from 'in-kubernetes/Dashboards/commonComponents/commonTabs/WorkloadControllers';
import getOpenShiftDeploymentConfigs from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { ServiceTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import getKubernetesDaemonSets from 'in-subscription/kubernetes/getKubernetesDaemonSets';
import getKubernetesStatefulSets from 'in-subscription/kubernetes/getKubernetesStatefulSets';
import { serviceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Service/tabs/Summary/Summary';
import Details from 'in-kubernetes/Dashboards/Service/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${serviceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${serviceDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${serviceDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: 'Deployments',
    path: `${serviceDashboardFullyQualified}/deployments`,
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
    path: `${serviceDashboardFullyQualified}/deploymentconfigs`,
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
    path: `${serviceDashboardFullyQualified}/daemonsets`,
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
    path: `${serviceDashboardFullyQualified}/statefulsets`,
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
    label: 'Pods',
    path: `${serviceDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.workloads.pods)
  }
].filter(Boolean);

function getCounterComponent({ serviceId, tab, timeConfig }, valueExtractor) {
  return <ServiceTab serviceId={serviceId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />;
}
