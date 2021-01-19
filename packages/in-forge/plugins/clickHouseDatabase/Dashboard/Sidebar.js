/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from '../Info';

export default function ClickHouseSidebar({ snapshot }) {
  const settings = snapshot.getIn(['data', 'settings']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>ClickHouse Server</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <KeyValueOverlay header="Settings" data={settings} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
