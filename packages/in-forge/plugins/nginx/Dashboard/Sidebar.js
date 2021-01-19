/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PhpSnapshot from 'in-forge/plugins/phpRuntimePlatform/PhpSnapshot.js';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function NginxSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Nginx</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
      <PhpSnapshot snapshotId={snapshot.get('id')} />
    </div>
  );
}
