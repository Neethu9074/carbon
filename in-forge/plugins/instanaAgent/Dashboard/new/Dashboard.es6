import { Switch, Route } from 'react-router-dom';
import React from 'react';

import AgentViewBreadcrumb from 'in-forge/plugins/instanaAgent/Dashboard/new/breadcrumbs/AgentViewBreadcrumb';
import BreadcrumbForSnapshot from 'in-sdk/components/dashboard/breadcrumb/BreadcrumbForSnapshot';
import BreadcrumbHeader from 'in-sdk/components/dashboard/TabView/components/BreadcrumbHeader';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';

export default function InstanaAgentDashboard(props) {
  const breadcrumbs = [<AgentViewBreadcrumb />, <BreadcrumbForSnapshot snapshot={props.snapshot} />];

  return (
    <Switch>
      <Route
        path={`*/dashboard/notification/:notificationId`}
        render={() => {
          return (
            <div>
              <Breadcrumbs items={breadcrumbs} />
              <BreadcrumbHeader />

              notification dashboard here
            </div>
          );
        }}
      />
      <Route
        path={`*/dashboard*`}
        render={() => {
          return (
            <div>
              <Breadcrumbs items={breadcrumbs} />
              <BreadcrumbHeader />

              agent dashboard here
            </div>
          );
        }}
      />
    </Switch>
  );
}
