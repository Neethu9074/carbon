import React from 'react';

import ApplicationViewBreadcrumb from 'in-sdk/components/dashboard/LogicalServiceDashboard/ApplicationViewBreadcrumb';
import ServiceInstances from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/ServiceInstances';
import BreadcrumbForSnapshot from 'in-sdk/components/dashboard/breadcrumb/BreadcrumbForSnapshot';
import Connections from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections';
import Endpoints from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Endpoints';
import Summary from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Summary';
import Calls from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Calls';
import TabView from 'in-sdk/components/dashboard/TabView';

export default function LogicalServiceDashboard(props) {
  const breadcrumbs = [<ApplicationViewBreadcrumb />, <BreadcrumbForSnapshot snapshot={props.snapshot} />];
  return <TabView tabs={getTabs(props.snapshot)} props={props} breadcrumbs={breadcrumbs} />;
}

function getTabs() {
  return [
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
    },
    {
      label: 'Instances',
      path: '/instances',
      component: ServiceInstances
    }
  ];
}
