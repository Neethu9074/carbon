import React from 'react';

import navigationDefinition from 'in-forge/plugins/browserLogicalService/Dashboard/new/navigation/index';
import Breadcrumb from 'in-sdk/components/dashboard/Breadcrumbs';
import WebsiteEntityBreadcrumb from 'in-sdk/components/dashboard/Breadcrumbs/components/WebsiteEntityBreadcrumb';
import WebsiteViewBreadcrumb from 'in-sdk/components/dashboard/Breadcrumbs/components/WebsiteViewBreadcrumb';
import SwitchableView from 'in-sdk/components/dashboard/SwitchableView';

export default function BrowserLogicalServiceDashboard(props) {
  return (
    <SwitchableView {...props} navigation={navigationDefinition}>
      <Breadcrumb
        items={[
          <WebsiteViewBreadcrumb key={`WebsiteView_${props.snapshot.get('id')}`} />,
          <WebsiteEntityBreadcrumb key={`WebsiteEntity_${props.snapshot.get('id')}`} snapshot={props.snapshot} />
        ]}
      />
    </SwitchableView>
  );
}
