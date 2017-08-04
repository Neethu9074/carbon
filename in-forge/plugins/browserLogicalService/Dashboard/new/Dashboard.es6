import React from 'react';

import navigationDefinition from 'in-forge/plugins/browserLogicalService/Dashboard/new/navigation/index';
import Breadcrumb from 'in-sdk/components/dashboard/Breadcrumbs';
import WebsiteEntityBreadcrumb from 'in-forge/plugins/browserLogicalService/Dashboard/new/breadcrumbs/WebsiteEntityBreadcrumb';
import WebsiteViewBreadcrumb from 'in-forge/plugins/browserLogicalService/Dashboard/new/breadcrumbs/WebsiteViewBreadcrumb';
import SwitchableView from 'in-sdk/components/dashboard/SwitchableView';

export default function BrowserLogicalServiceDashboard(props) {
  return (
    <SwitchableView {...props} navigation={navigationDefinition}>
      <Breadcrumb items={[<WebsiteViewBreadcrumb />, <WebsiteEntityBreadcrumb snapshot={props.snapshot} />]} />
    </SwitchableView>
  );
}
