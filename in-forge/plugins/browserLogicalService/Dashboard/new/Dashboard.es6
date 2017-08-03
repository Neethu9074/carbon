import React from 'react';

import navigationDefinition from 'in-forge/plugins/browserLogicalService/Dashboard/new/navigation/index';
import BreadcrumbHelmet from 'in-sdk/components/dashboard/SwitchableView/components/BreadcrumbHelmet';
import SwitchableView from 'in-sdk/components/dashboard/SwitchableView';

export default function BrowserLogicalServiceDashboard(props) {
  return (
    <SwitchableView {...props} navigation={navigationDefinition}>
      <BreadcrumbHelmet
        context={{
          label: null,
          snapshot: props.snapshot,
          path: '/website/dashboard'
        }}
      />
    </SwitchableView>
  );
}
