import React from 'react';

import WebsiteViewBreadcrumb from 'in-forge/plugins/browserLogicalService/Dashboard/new/breadcrumbs/WebsiteViewBreadcrumb';
import BreadcrumbForSnapshot from 'in-sdk/components/dashboard/breadcrumb/BreadcrumbForSnapshot';
import tabs from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/index';
import TabView from 'in-sdk/components/dashboard/TabView';

export default function BrowserLogicalServiceDashboard(props) {
  return (
    <TabView
      tabs={tabs}
      props={props}
      breadcrumbs={[<WebsiteViewBreadcrumb />, <BreadcrumbForSnapshot snapshot={props.snapshot} />]}
    />
  );
}
