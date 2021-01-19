/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function HazelcastClusterSidebar({ snapshot }) {
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>Hazelcast Cluster</Collapsible.Header>
      <Collapsible.Content>
        <Info snapshot={snapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
}
