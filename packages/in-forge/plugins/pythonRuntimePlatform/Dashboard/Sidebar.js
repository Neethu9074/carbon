/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function PythonDashboardSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Python</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValueOverlay header="Loaded Packages" data={snapshot.getIn(['data', 'snapshot.versions'])} />
      <KeyValueOverlay header="Django Middleware" data={snapshot.getIn(['data', 'snapshot.djmw'])} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
