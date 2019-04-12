import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';

export default function PrometheusSidebar({ snapshot }) {
  return (
    <div>
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
