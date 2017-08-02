import React from 'react';

import navigationDefinition from 'in-forge/plugins/browserLogicalService/Dashboard/new/navigation/index';
import SwitchableView from 'in-sdk/components/dashboard/SwitchableView';

export default function BrowserLogicalServiceDashboard(props) {
  return <SwitchableView {...props} navigation={navigationDefinition} />;
}
