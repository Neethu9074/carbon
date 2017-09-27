import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { getTabs as getNotificationTabs } from 'in-forge/plugins/instanaAgent/Dashboard/new/tabs/notification/index';
import AgentViewBreadcrumb from 'in-forge/plugins/instanaAgent/Dashboard/new/breadcrumbs/AgentViewBreadcrumb';
import { getTabs as getAgentTabs } from 'in-forge/plugins/instanaAgent/Dashboard/new/tabs/agent/index';
import { getPhysicalHierarchyBreadcrumbChain$ } from 'in-components/breadcrumb/stores/breadcrumbs';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import TabView from 'in-sdk/components/dashboard/TabView';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      chain: getPhysicalHierarchyBreadcrumbChain$(props.snapshot.get('id'))
    };
  },
  function InstanaAgentDashboard(props) {
    let breadcrumbs = [<AgentViewBreadcrumb />];
    if (props.chain) {
      breadcrumbs = breadcrumbs.concat(props.chain);
    }

    return (
      <Switch>
        <Route
          path={`*/dashboard/notification/:notificationId`}
          render={({ match }) => {
            const notificationId = match.params.notificationId;
            const notificationBreadcrumb = (
              <Breadcrumb href$={getSubDashboardLink(`/notification/${notificationId}`)}>{notificationId}</Breadcrumb>
            );
            return (
              <TabView
                tabs={getNotificationTabs(props.snapshot, notificationId)}
                props={{ ...props, notificationId }}
                breadcrumbs={breadcrumbs.concat([notificationBreadcrumb])}
              />
            );
          }}
        />
        <Route
          path={`*/dashboard*`}
          render={() => {
            return <TabView tabs={getAgentTabs()} props={{ ...props }} breadcrumbs={breadcrumbs} />;
          }}
        />
      </Switch>
    );
  }
);
