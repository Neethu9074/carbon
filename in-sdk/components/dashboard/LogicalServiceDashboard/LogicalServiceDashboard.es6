import React from 'react';

import ApplicationViewBreadcrumb from 'in-sdk/components/dashboard/LogicalServiceDashboard/ApplicationViewBreadcrumb';
import ServiceInstances from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/ServiceInstances';
import BreadcrumbForSnapshot from 'in-sdk/components/dashboard/breadcrumb/BreadcrumbForSnapshot';
import Connections from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections';
import Endpoints from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Endpoints';
import Summary from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Summary';
import Calls from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Calls';
import { getClusterMembers } from 'in-stores/clusterMembers';
import TabView from 'in-sdk/components/dashboard/TabView';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      hasServiceInstances: getClusterMembers(props.snapshot.get('id')).map(m => m.size > 0).startWith(true)
    };
  },
  function LogicalServiceDashboard(props) {
    const breadcrumbs = [<ApplicationViewBreadcrumb />, <BreadcrumbForSnapshot snapshot={props.snapshot} />];
    return (
      <TabView tabs={getTabs(props.snapshot, props.hasServiceInstances)} props={props} breadcrumbs={breadcrumbs} />
    );
  }
);

function getTabs(snapshot, hasServiceInstances) {
  const tabs = [
    {
      label: 'Summary',
      path: '/',
      component: Summary
    },
    {
      label: 'Calls',
      path: '/calls',
      component: Calls
    },
    {
      label: 'Connections',
      path: '/connections',
      component: Connections
    },
    {
      label: 'Endpoints',
      path: '/endpoints',
      component: Endpoints
    }
  ];

  if (hasServiceInstances) {
    tabs.push({
      label: 'Instances',
      path: '/instances',
      component: ServiceInstances
    });
  }

  return tabs;
}
