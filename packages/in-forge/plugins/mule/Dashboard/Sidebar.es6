import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Separator from 'in-sdk/components/sidebar/Separator';
import Info from 'in-forge/plugins/mule/Info';

export default function MuleSidebar({ snapshot }) {
  return (
    <div>
      <Separator />
      <Info snapshot={snapshot} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
