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
import React, { Fragment } from 'react';

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
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

export default (
  <Fragment>
    <Route path={serviceDashboardFullyQualified} component={createAsyncViewComponent(ServiceDashboard)} />
    <Route path={clusterDashboardFullyQualified} component={createAsyncViewComponent(ClusterDashboard)} />
    <Route path={namespaceDashboardFullyQualified} component={createAsyncViewComponent(NamespaceDashboard)} />
    <Route path={nodeDashboardFullyQualified} component={createAsyncViewComponent(NodeDashboard)} />
    <Route path={podDashboardFullyQualified} component={createAsyncViewComponent(PodDashboard)} />
    <Route path={daemonSetDashboardFullyQualified} component={createAsyncViewComponent(DaemonSetDashboard)} />
    <Route path={deploymentDashboardFullyQualified} component={createAsyncViewComponent(DeploymentDashboard)} />
    <Route path={statefulSetDashboardFullyQualified} component={createAsyncViewComponent(StatefulSetDashboard)} />
    <Route path={cronJobDashboardFullyQualified} component={createAsyncViewComponent(CronJobDashboard)} />
    <Route
      path={deploymentConfigDashboardFullyQualified}
      component={createAsyncViewComponent(DeploymentConfigDashboard)}
    />

    <Route path={kubernetes} component={createAsyncViewComponent(KubernetesMainView)} />
  </Fragment>
);
