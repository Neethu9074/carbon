/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  beeInstanaInfraMetricsEnabled,
  persistentVolumeSupportEnabled,
  beeinstanaInfraMetricsWithTimeshiftEnabled,
  playwithEnabled
} from 'in-services/featureFlags';
import {
  useDaemonSetDashboard,
  useDeploymentDashboard,
  useDeploymentConfigDashboard,
  useStatefulSetDashboard
} from 'in-kubernetes/navigation/paths';
import WorkloadControllers from 'in-kubernetes/Dashboards/commonComponents/commonTabs/WorkloadControllers';
import getOpenShiftDeploymentConfigs$ from 'in-kubernetes/subscriptions/getOpenShiftDeploymentConfigs';
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Namespace/tabs/SummaryWithoutTimeShift';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import getKubernetesStatefulSets from 'in-kubernetes/subscriptions/getKubernetesStatefulSets';
import getKubernetesDeployments$ from 'in-kubernetes/subscriptions/getKubernetesDeployments';
import getKubernetesDaemonSets from 'in-kubernetes/subscriptions/getKubernetesDaemonSets';
import PersistentVolumes from 'in-kubernetes/Dashboards/Cluster/tabs/PersistentVolumes';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import CronJobs from 'in-kubernetes/Dashboards/commonComponents/commonTabs/CronJobs';
import { namespaceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import { NamespaceTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Summary from 'in-kubernetes/Dashboards/Namespace/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Namespace/tabs/Details';
import Pods from 'in-kubernetes/Dashboards/Namespace/tabs/Pods';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${namespaceDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
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
        getWorkloadControllerDashboard: useDeploymentDashboard,
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
        getWorkloadControllerDashboard: useDeploymentConfigDashboard,
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
        getWorkloadControllerDashboard: useDaemonSetDashboard,
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
        getWorkloadControllerDashboard: useStatefulSetDashboard,
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
  },
  persistentVolumeSupportEnabled &&
    !playwithEnabled && {
      label: t('in-kubernetes:dashboards.persistentVolumes'),
      path: `${namespaceDashboardFullyQualified}/persistentvolumes`,
      component: PersistentVolumes,
      header: props => getCounterComponent(props, v => v.volumes),
      stickToBottom: true
    }
].filter(Boolean);

function getCounterComponent({ result, tab, location }, valueExtractor) {
  const namespaceId = result?.data?.id;
  const timeConfig = getTimeConfig(location);

  return (
    <NamespaceTab namespaceId={namespaceId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />
  );
}
