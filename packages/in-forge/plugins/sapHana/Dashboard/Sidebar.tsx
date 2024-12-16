/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible } from '@instana/components';

// @ts-expect-error needs TS migration
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Info from '../Info';

export default function Sidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>SAP HANA</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
