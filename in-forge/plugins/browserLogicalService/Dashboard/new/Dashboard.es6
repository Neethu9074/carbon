import React from 'react';

import WebsiteEntityBreadcrumb from 'in-forge/plugins/browserLogicalService/Dashboard/new/breadcrumbs/WebsiteEntityBreadcrumb';
import WebsiteViewBreadcrumb from 'in-forge/plugins/browserLogicalService/Dashboard/new/breadcrumbs/WebsiteViewBreadcrumb';
import navigationDefinition from 'in-forge/plugins/browserLogicalService/Dashboard/new/navigation/index';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import SwitchableView from 'in-sdk/components/dashboard/SwitchableView';

export default function BrowserLogicalServiceDashboard(props) {
  return (
    <SwitchableView {...props} navigation={navigationDefinition}>
      <Breadcrumbs items={[<WebsiteViewBreadcrumb />, <WebsiteEntityBreadcrumb snapshot={props.snapshot} />]} />
    </SwitchableView>
  );
}
