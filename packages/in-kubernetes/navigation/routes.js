/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// the following components are all part of the same bundle (kubernetes)
import DeploymentConfigDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/DeploymentConfig/DeploymentConfigDashboard';
import PersistentVolumeDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/PersistentVolume/PersistentVolumeDashboard';
import StatefulSetDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/StatefulSet/StatefulSetDashboard';
import DeploymentDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Deployment/DeploymentDashboard';
import OtelClusterDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Cluster/OtelClusterDashboard';
import DaemonSetDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/DaemonSet/DaemonSetDashboard';
import NamespaceDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Namespace/NamespaceDashboard';
import CronJobDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/CronJob/CronJobDashboard';
import ClusterDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Cluster/ClusterDashboard';
import ServiceDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Service/ServiceDashboard';
import OtelNodeDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Node/OtelNodeDashboard';
import NodeDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Node/NodeDashboard';
import PodDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Pod/PodDashboard';
import KubernetesMainView from 'promise-loader?global,kubernetes!in-kubernetes/KubernetesMainView';
import { Route } from 'react-router-dom';
import React from 'react';

import {
  kubernetes,
  serviceDashboardFullyQualified,
  clusterDashboardFullyQualified,
  namespaceDashboardFullyQualified,
  podDashboardFullyQualified,
  nodeDashboardFullyQualified,
  persistentVolumeDashboardFullyQualified,
  nodeOtelDashboardFullyQualified,
  daemonSetDashboardFullyQualified,
  deploymentDashboardFullyQualified,
  deploymentConfigDashboardFullyQualified,
  statefulSetDashboardFullyQualified,
  cronJobDashboardFullyQualified,
  clusterOtelDashboardFullyQualified
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
  <Route key="kubernetesMainView" path={kubernetes}>
    {renderAsyncRouteChildren(KubernetesMainView)}
  </Route>
];
