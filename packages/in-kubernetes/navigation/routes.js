/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// the following components are all part of the same bundle (kubernetes)
const DeploymentConfigDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/DeploymentConfig/DeploymentConfigDashboard');
const PersistentVolumeClaimDashboard = () =>
  import(
    /* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/PersistentVolumeClaim/PersistentVolumeClaimDashboard'
  );
const PersistentVolumeDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/PersistentVolume/PersistentVolumeDashboard');
const StatefulSetDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/StatefulSet/StatefulSetDashboard');
const OtelClusterDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/OtelCluster/OtelClusterDashboard');
const DeploymentDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Deployment/DeploymentDashboard');
const DaemonSetDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/DaemonSet/DaemonSetDashboard');
const NamespaceDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Namespace/NamespaceDashboard');
const ContainerDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Container/ContainerDashboard');
const CronJobDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/CronJob/CronJobDashboard');
const ClusterDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Cluster/ClusterDashboard');
const ServiceDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Service/ServiceDashboard');
const OtelNodeDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Node/OtelNodeDashboard');
const OtelPodDashboard = () =>
  import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Pod/OtelPodDashboard');
const NodeDashboard = () => import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Node/NodeDashboard');
const PodDashboard = () => import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/Dashboards/Pod/PodDashboard');
const KubernetesMainView = () => import(/* webpackChunkName: "kubernetes" */ 'in-kubernetes/KubernetesMainView');
import { Route } from 'react-router-dom';
import React from 'react';

import {
  kubernetes,
  serviceDashboardFullyQualified,
  clusterDashboardFullyQualified,
  namespaceDashboardFullyQualified,
  podDashboardFullyQualified,
  podOtelDashboardFullyQualified,
  nodeDashboardFullyQualified,
  persistentVolumeDashboardFullyQualified,
  persistentVolumeClaimDashboardFullyQualified,
  nodeOtelDashboardFullyQualified,
  daemonSetDashboardFullyQualified,
  deploymentDashboardFullyQualified,
  deploymentConfigDashboardFullyQualified,
  statefulSetDashboardFullyQualified,
  cronJobDashboardFullyQualified,
  clusterOtelDashboardFullyQualified,
  containerDashboardFullyQualified
} from 'in-kubernetes/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route key="kubernetesServiceDashboard" path={serviceDashboardFullyQualified}>
    {renderAsyncRouteChildren(ServiceDashboard)}
  </Route>,
  <Route key="kubernetesOtelClusterDashboard" path={clusterOtelDashboardFullyQualified}>
    {renderAsyncRouteChildren(OtelClusterDashboard)}
  </Route>,
  <Route key="kubernetesClusterDashboard" path={clusterDashboardFullyQualified}>
    {renderAsyncRouteChildren(ClusterDashboard)}
  </Route>,
  <Route key="kubernetesNamespaceDashboard" path={namespaceDashboardFullyQualified}>
    {renderAsyncRouteChildren(NamespaceDashboard)}
  </Route>,
  <Route key="kubernetesOtelNodeDashboard" path={nodeOtelDashboardFullyQualified}>
    {renderAsyncRouteChildren(OtelNodeDashboard)}
  </Route>,
  <Route key="kubernetesNodeDashboard" path={nodeDashboardFullyQualified}>
    {renderAsyncRouteChildren(NodeDashboard)}
  </Route>,
  <Route key="kubernetesPersistentVolumeDashboard" path={persistentVolumeDashboardFullyQualified}>
    {renderAsyncRouteChildren(PersistentVolumeDashboard)}
  </Route>,
  <Route key="kubernetesPersistentVolumeClaimDashboard" path={persistentVolumeClaimDashboardFullyQualified}>
    {renderAsyncRouteChildren(PersistentVolumeClaimDashboard)}
  </Route>,
  <Route key="kubernetesOtelPodDashboard" path={podOtelDashboardFullyQualified}>
    {renderAsyncRouteChildren(OtelPodDashboard)}
  </Route>,
  <Route key="kubernetesPodDashboard" path={podDashboardFullyQualified}>
    {renderAsyncRouteChildren(PodDashboard)}
  </Route>,
  <Route key="kubernetesDaemonSetDashboard" path={daemonSetDashboardFullyQualified}>
    {renderAsyncRouteChildren(DaemonSetDashboard)}
  </Route>,
  <Route key="kubernetesDeploymentDashboard" path={deploymentDashboardFullyQualified}>
    {renderAsyncRouteChildren(DeploymentDashboard)}
  </Route>,
  <Route key="kubernetesStatefulSetDashboard" path={statefulSetDashboardFullyQualified}>
    {renderAsyncRouteChildren(StatefulSetDashboard)}
  </Route>,
  <Route key="kubernetesCroneJobDashboard" path={cronJobDashboardFullyQualified}>
    {renderAsyncRouteChildren(CronJobDashboard)}
  </Route>,
  <Route key="kubernetesDeploymentConfigDashboard" path={deploymentConfigDashboardFullyQualified}>
    {renderAsyncRouteChildren(DeploymentConfigDashboard)}
  </Route>,
  <Route key="kubernetesContainerDashboard" path={containerDashboardFullyQualified}>
    {renderAsyncRouteChildren(ContainerDashboard)}
  </Route>,
  <Route key="kubernetesMainView" path={kubernetes}>
    {renderAsyncRouteChildren(KubernetesMainView)}
  </Route>
];
