import { Switch, Route } from 'react-router-dom';
import React from 'react';

import WebsiteViewBreadcrumb from 'in-forge/plugins/browserLogicalService/Dashboard/new/breadcrumbs/WebsiteViewBreadcrumb';
import { websiteTabs, getTabs } from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/index';
import BreadcrumbForSnapshot from 'in-sdk/components/dashboard/breadcrumb/BreadcrumbForSnapshot';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import TabView from 'in-sdk/components/dashboard/TabView';

export default function BrowserLogicalServiceDashboard(props) {
  return (
    <Switch>
      <Route
        path={`*/dashboard/pages/:pageHash`}
        render={({ match }) => {
          const pageHash = match.params.pageHash;
          const hashes = props.snapshot.getIn(['data', 'service_endpoint_hashes']);
          const index = hashes.indexOf(pageHash);
          if (index === -1) {
            return <RedirectWithHash to={'/website/dashboard'} />;
          }
          const pageName = props.snapshot.getIn(['data', 'service_endpoints']).get(index);

          // TODO breadcrumb for page
          return (
            <TabView
              tabs={getTabs(pageHash)}
              props={{ pageHash: match.params.pageHash, pageName, ...props }}
              breadcrumbs={[<WebsiteViewBreadcrumb />, <BreadcrumbForSnapshot snapshot={props.snapshot} />]}
            />
          );
        }}
      />
      <Route
        path={`*/dashboard*`}
        render={() =>
          <TabView
            tabs={websiteTabs}
            props={props}
            breadcrumbs={[<WebsiteViewBreadcrumb />, <BreadcrumbForSnapshot snapshot={props.snapshot} />]}
          />}
      />
    </Switch>
  );
}
