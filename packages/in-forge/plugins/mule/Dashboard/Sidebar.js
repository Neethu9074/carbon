/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Info from 'in-forge/plugins/mule/Info';

export default function MuleSidebar({ snapshot }) {
  return (
    <div>
      <Info snapshot={snapshot} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
