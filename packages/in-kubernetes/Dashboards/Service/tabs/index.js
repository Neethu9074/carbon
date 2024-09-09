/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  useDaemonSetDashboard,
  useDeploymentDashboard,
  useDeploymentConfigDashboard,
  useStatefulSetDashboard
} from 'in-kubernetes/navigation/paths';
import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Service/tabs/Summary/SummaryWithoutTimeShift';
import WorkloadControllers from 'in-kubernetes/Dashboards/commonComponents/commonTabs/WorkloadControllers';
import getOpenShiftDeploymentConfigs from 'in-kubernetes/subscriptions/getOpenShiftDeploymentConfigs';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import getKubernetesStatefulSets from 'in-kubernetes/subscriptions/getKubernetesStatefulSets';
import getKubernetesDeployments from 'in-kubernetes/subscriptions/getKubernetesDeployments';
import getKubernetesDaemonSets from 'in-kubernetes/subscriptions/getKubernetesDaemonSets';
import { serviceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import { ServiceTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Summary from 'in-kubernetes/Dashboards/Service/tabs/Summary/Summary';
import Details from 'in-kubernetes/Dashboards/Service/tabs/Details';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${serviceDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
  },
  {
    label: t('in-kubernetes:dashboards.details'),
    path: `${serviceDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: t('in-kubernetes:dashboards.events'),
    path: `${serviceDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: t('in-kubernetes:dashboards.deployments'),
    path: `${serviceDashboardFullyQualified}/deployments`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deployment',
        getWorkloadControllers$: getKubernetesDeployments,
        getWorkloadControllerDashboard: useDeploymentDashboard,
        pathSegment: '/deployments',
        entityName: 'deployments'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deployments)
  },
  {
    label: t('in-kubernetes:dashboards.deploymentConfigs'),
    path: `${serviceDashboardFullyQualified}/deploymentconfigs`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deploymentConfig',
        getWorkloadControllers$: getOpenShiftDeploymentConfigs,
        getWorkloadControllerDashboard: useDeploymentConfigDashboard,
        pathSegment: '/deploymentconfigs',
        entityName: 'deploymentConfigs'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deploymentConfigs)
  },
  {
    label: t('in-kubernetes:dashboards.daemonSets'),
    path: `${serviceDashboardFullyQualified}/daemonsets`,
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
    path: `${serviceDashboardFullyQualified}/statefulsets`,
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
    label: t('in-kubernetes:dashboards.pods'),
    path: `${serviceDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.workloads.pods)
  }
].filter(Boolean);

function getCounterComponent({ result, tab, location }, valueExtractor) {
  const serviceId = result?.data?.id;
  const timeConfig = getTimeConfig(location);
  return <ServiceTab serviceId={serviceId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />;
}
