import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

// the following components are all part of the same bundle (kubernetes)
import NamespaceDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Namespace/NamespaceDashboard';
import ClusterDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Cluster/ClusterDashboard';
import ServiceDashboard from 'promise-loader?global,kubernetes!in-kubernetes/Dashboards/Service/ServiceDashboard';
import KubernetesMainView from 'promise-loader?global,kubernetes!in-kubernetes/KubernetesMainView';

import { kubernetes, serviceDashboard, clusterDashboard, namespaceDashboard } from 'in-kubernetes/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';

export default (
  <Fragment>
    <Route path={serviceDashboard} component={createAsyncViewComponent(ServiceDashboard)} />
    <Route path={clusterDashboard} component={createAsyncViewComponent(ClusterDashboard)} />
    <Route path={namespaceDashboard} component={createAsyncViewComponent(NamespaceDashboard)} />

    <Route path={kubernetes} component={createAsyncViewComponent(KubernetesMainView)} />
  </Fragment>
);
