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
import getOpenShiftDeploymentConfigs$ from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import getKubernetesStatefulSets from 'in-subscription/kubernetes/getKubernetesStatefulSets';
import getKubernetesDeployments$ from 'in-subscription/kubernetes/getKubernetesDeployments';
import getKubernetesDaemonSets from 'in-subscription/kubernetes/getKubernetesDaemonSets';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import CronJobs from 'in-kubernetes/Dashboards/commonComponents/commonTabs/CronJobs';
import { namespaceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import { NamespaceTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Summary from 'in-kubernetes/Dashboards/Namespace/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Namespace/tabs/Details';
import Pods from 'in-kubernetes/Dashboards/Namespace/tabs/Pods';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${namespaceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${namespaceDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.events'),
    path: `${namespaceDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: t('in-kubernetes:dashboards.deployments'),
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
    label: t('in-kubernetes:dashboards.deploymentConfigs'),
    path: `${namespaceDashboardFullyQualified}/deploymentconfigs`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deploymentConfig',
        getWorkloadControllers$: getOpenShiftDeploymentConfigs$,
        getWorkloadControllerDashboard: getDeploymentConfigDashboard,
        pathSegment: '/deploymentconfigs',
        entityName: 'deploymentConfigs'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deploymentConfigs)
  },
  {
    label: t('in-kubernetes:dashboards.daemonSets'),
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
    label: t('in-kubernetes:dashboards.statefulSets'),
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
    label: t('in-kubernetes:dashboards.cronJobs'),
    path: `${namespaceDashboardFullyQualified}/cronjobs`,
    component: CronJobs,
    header: props => getCounterComponent(props, v => v.cronJobs)
  },
  {
    label: t('in-kubernetes:dashboards.k8SServices'),
    path: `${namespaceDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: t('in-kubernetes:dashboards.pods'),
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
