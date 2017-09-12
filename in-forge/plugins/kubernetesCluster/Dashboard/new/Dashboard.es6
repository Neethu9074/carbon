import { Switch, Route } from 'react-router-dom';
import React from 'react';

import KubernetesViewBreadcrumb from 'in-forge/plugins/kubernetesCluster/Dashboard/new/breadcrumbs/KubernetesViewBreadcrumb';
import BreadcrumbForSnapshot from 'in-sdk/components/dashboard/breadcrumb/BreadcrumbForSnapshot';
import { getTabs } from 'in-forge/plugins/kubernetesCluster/Dashboard/new/tabs/index';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import TabView from 'in-sdk/components/dashboard/TabView';

export default function BrowserLogicalServiceDashboard(props) {
  const breadcrumbs = [<KubernetesViewBreadcrumb />, <BreadcrumbForSnapshot snapshot={props.snapshot} />];

  return (
    <Switch>
      <Route
        path={`*/dashboard/kubernetescluster/:pageHash`}
        render={({ match }) => {
          const pageHash = match.params.pageHash;
          const hashes = props.snapshot.getIn(['data', 'service_endpoint_hashes']);
          const index = hashes.indexOf(pageHash);
          if (index === -1) {
            return <RedirectWithHash to={'/kubernetes/dashboard'} />;
          }
          const pageName = props.snapshot.getIn(['data', 'service_endpoints']).get(index);
          const pageBreadcrumb = <Breadcrumb href$={getSubDashboardLink(`/pages/${pageHash}`)}>{pageName}</Breadcrumb>;
          const metricPrefix = pageName == null ? '' : `endpoint.${pageName}.`;
          return (
            <TabView
              tabs={getTabs(props.snapshot, pageHash)}
              props={{ pageHash: match.params.pageHash, pageName, ...props, metricPrefix }}
              breadcrumbs={breadcrumbs.concat([pageBreadcrumb])}
            />
          );
        }}
      />
      <Route
        path={`*/dashboard*`}
        render={() =>
          <TabView tabs={getTabs(props.snapshot)} props={{ ...props, metricPrefix: '' }} breadcrumbs={breadcrumbs} />}
      />
    </Switch>
  );
}
