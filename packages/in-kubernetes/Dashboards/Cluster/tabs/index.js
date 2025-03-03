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
  useStatefulSetDashboard,
  nodesDashboard,
  namespaceList,
  deploymentsDashboard,
  daemonSetsDashboard,
  statefulSetsDashboard,
  cronJobsDashboard,
  servicesDashboard,
  podsDashboard
} from 'in-kubernetes/navigation/paths';
import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import WorkloadControllers from 'in-kubernetes/Dashboards/commonComponents/commonTabs/WorkloadControllers';
import getOpenShiftDeploymentConfigs from 'in-kubernetes/subscriptions/getOpenShiftDeploymentConfigs';
import SummaryWithoutTimeShift from 'in-kubernetes/Dashboards/Cluster/tabs/SummaryWithoutTimeShift';
import getKubernetesStatefulSets from 'in-kubernetes/subscriptions/getKubernetesStatefulSets';
import getKubernetesDeployments from 'in-kubernetes/subscriptions/getKubernetesDeployments';
import { persistentVolumeSupportEnabled, playwithEnabled } from 'in-services/featureFlags';
import ControlPlane from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/ControlPlane';
import getKubernetesDaemonSets from 'in-kubernetes/subscriptions/getKubernetesDaemonSets';
import Namespaces from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Namespaces';
import PersistentVolumes from 'in-kubernetes/Dashboards/Cluster/tabs/PersistentVolumes';
import CronJobs from 'in-kubernetes/Dashboards/commonComponents/commonTabs/CronJobs';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import Infrastructure from 'in-kubernetes/Dashboards/Cluster/tabs/Infrastructure';
import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import { controlPlaneEnabled, kubecostEnabled } from 'in-services/featureFlags';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import { ClusterTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import KubeCost from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost';
import Details from 'in-kubernetes/Dashboards/Cluster/tabs/Details';
import Summary from 'in-kubernetes/Dashboards/Cluster/tabs/Summary';
import Pods from 'in-kubernetes/Dashboards/Cluster/tabs/Pods';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-kubernetes:dashboards.summary'),
    path: `${clusterDashboardFullyQualified}/summary`,
    component:
      beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled ? Summary : SummaryWithoutTimeShift
  },
  !controlPlaneEnabled && {
    label: t('in-kubernetes:dashboards.details'),
    path: `${clusterDashboardFullyQualified}/details`,
    component: Details
  },
  controlPlaneEnabled && {
    label: t('in-kubernetes:dashboards.controlPlane'),
    path: `${clusterDashboardFullyQualified}/controlplane`,
    component: ControlPlane
  },
  {
    label: t('in-kubernetes:dashboards.events'),
    path: `${clusterDashboardFullyQualified}/events`,
    component: Events
  },
  {
    label: t('in-kubernetes:dashboards.nodes'),
    path: `${clusterDashboardFullyQualified}${nodesDashboard}`,
    component: Nodes,
    header: props => getCounterComponent(props, v => v.nodes)
  },
  {
    label: t('in-kubernetes:dashboards.namespaces'),
    path: `${clusterDashboardFullyQualified}${namespaceList}`,
    component: Namespaces,
    header: props => getCounterComponent(props, v => v.namespaces)
  },
  {
    label: t('in-kubernetes:dashboards.deployments'),
    path: `${clusterDashboardFullyQualified}${deploymentsDashboard}`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'deployment',
        getWorkloadControllers$: getKubernetesDeployments,
        getWorkloadControllerDashboard: useDeploymentDashboard,
        pathSegment: deploymentsDashboard,
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
        getWorkloadControllerDashboard: useDeploymentConfigDashboard,
        pathSegment: '/deploymentconfigs',
        entityName: 'deploymentConfigs'
      }),
    header: props => getCounterComponent(props, v => v.workloads.deploymentConfigs)
  },
  {
    label: t('in-kubernetes:dashboards.daemonSets'),
    path: `${clusterDashboardFullyQualified}${daemonSetsDashboard}`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'daemonset',
        getWorkloadControllers$: getKubernetesDaemonSets,
        getWorkloadControllerDashboard: useDaemonSetDashboard,
        pathSegment: daemonSetsDashboard,
        entityName: 'daemonsets'
      }),
    header: props => getCounterComponent(props, v => v.workloads.daemonSets)
  },
  {
    label: t('in-kubernetes:dashboards.statefulSets'),
    path: `${clusterDashboardFullyQualified}${statefulSetsDashboard}`,
    component: props =>
      WorkloadControllers({
        ...props,
        workloadControllerType: 'statefulset',
        getWorkloadControllers$: getKubernetesStatefulSets,
        getWorkloadControllerDashboard: useStatefulSetDashboard,
        pathSegment: statefulSetsDashboard,
        entityName: 'statefulsets'
      }),
    header: props => getCounterComponent(props, v => v.workloads.statefulSets)
  },
  {
    label: t('in-kubernetes:dashboards.cronJobs'),
    path: `${clusterDashboardFullyQualified}${cronJobsDashboard}`,
    component: CronJobs,
    header: props => getCounterComponent(props, v => v.cronJobs)
  },
  {
    label: t('in-kubernetes:dashboards.k8SServices'),
    path: `${clusterDashboardFullyQualified}${servicesDashboard}`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: t('in-kubernetes:dashboards.pods'),
    path: `${clusterDashboardFullyQualified}${podsDashboard}`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.workloads.pods),
    stickToBottom: true
  },
  persistentVolumeSupportEnabled &&
    !playwithEnabled && {
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
    header: props => getCounterComponent(props, v => v.hosts)
  },
  kubecostEnabled && {
    label: t('in-kubernetes:dashboards.kubecost.kubeCost'),
    path: `${clusterDashboardFullyQualified}/kubecost`,
    component: KubeCost
  }
].filter(Boolean);

function getCounterComponent({ result, tab, location }, valueExtractor) {
  const clusterId = result?.data?.id;
  const timeConfig = getTimeConfig(location);
  return <ClusterTab clusterId={clusterId} label={tab.label} timeConfig={timeConfig} valueExtractor={valueExtractor} />;
}
