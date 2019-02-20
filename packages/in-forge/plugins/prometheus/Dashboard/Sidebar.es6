import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function PrometheusSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
