import React from 'react';

import ApplicationViewBreadcrumb from 'in-sdk/components/dashboard/LogicalServiceDashboard/ApplicationViewBreadcrumb';
import BreadcrumbForSnapshot from 'in-sdk/components/dashboard/breadcrumb/BreadcrumbForSnapshot';
import Summary from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Summary';
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
    }
  ];
}
