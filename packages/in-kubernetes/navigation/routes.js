/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// the following components are all part of the same bundle (kubernetes)
import DeploymentConfigDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/DeploymentConfig/DeploymentConfigDashboard';
import StatefulSetDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/StatefulSet/StatefulSetDashboard';
import DeploymentDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Deployment/DeploymentDashboard';
import DaemonSetDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/DaemonSet/DaemonSetDashboard';
import NamespaceDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Namespace/NamespaceDashboard';
import CronJobDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/CronJob/CronJobDashboard';
import ClusterDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Cluster/ClusterDashboard';
import ServiceDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Service/ServiceDashboard';
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
  daemonSetDashboardFullyQualified,
  deploymentDashboardFullyQualified,
  deploymentConfigDashboardFullyQualified,
  statefulSetDashboardFullyQualified,
  cronJobDashboardFullyQualified
} from 'in-kubernetes/navigation/paths';
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';

export default [
  <Route
    key="kubernetesServiceDashboard"
    path={serviceDashboardFullyQualified}
    children={renderAsyncRouteChildren(ServiceDashboard)}
  />,
  <Route
    key="kubernetesClusterDashboard"
    path={clusterDashboardFullyQualified}
    children={renderAsyncRouteChildren(ClusterDashboard)}
  />,
  <Route
    key="kubernetesNamespaceDashboard"
    path={namespaceDashboardFullyQualified}
    children={renderAsyncRouteChildren(NamespaceDashboard)}
  />,
  <Route
    key="kubernetesNodeDashboard"
    path={nodeDashboardFullyQualified}
    children={renderAsyncRouteChildren(NodeDashboard)}
  />,
  <Route
    key="kubernetesPodDashboard"
    path={podDashboardFullyQualified}
    children={renderAsyncRouteChildren(PodDashboard)}
  />,
  <Route
    key="kubernetesDaemonSetDashboard"
    path={daemonSetDashboardFullyQualified}
    children={renderAsyncRouteChildren(DaemonSetDashboard)}
  />,
  <Route
    key="kubernetesDeploymentDashboard"
    path={deploymentDashboardFullyQualified}
    children={renderAsyncRouteChildren(DeploymentDashboard)}
  />,
  <Route
    key="kubernetesStatefulSetDashboard"
    path={statefulSetDashboardFullyQualified}
    children={renderAsyncRouteChildren(StatefulSetDashboard)}
  />,
  <Route
    key="kubernetesCroneJobDashboard"
    path={cronJobDashboardFullyQualified}
    children={renderAsyncRouteChildren(CronJobDashboard)}
  />,
  <Route
    key="kubernetesDeploymentConfigDashboard"
    path={deploymentConfigDashboardFullyQualified}
    children={renderAsyncRouteChildren(DeploymentConfigDashboard)}
  />,

  <Route key="kubernetesMainView" path={kubernetes} children={renderAsyncRouteChildren(KubernetesMainView)} />
];
