import React from 'react';

import WebsiteEntityBreadcrumb from 'in-forge/plugins/browserLogicalService/Dashboard/new/breadcrumbs/WebsiteEntityBreadcrumb';
import WebsiteViewBreadcrumb from 'in-forge/plugins/browserLogicalService/Dashboard/new/breadcrumbs/WebsiteViewBreadcrumb';
import tabs from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/index';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import TabView from 'in-sdk/components/dashboard/TabView';

export default function BrowserLogicalServiceDashboard(props) {
  return (
    <TabView tabs={tabs} props={props}>
      <Breadcrumbs items={[<WebsiteViewBreadcrumb />, <WebsiteEntityBreadcrumb snapshot={props.snapshot} />]} />
    </TabView>
  );
}
