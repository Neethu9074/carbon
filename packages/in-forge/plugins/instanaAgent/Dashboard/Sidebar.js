/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/instanaAgent/Info';

export default function InstanaAgentSidebar({ snapshot }) {
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>Configuration</Collapsible.Header>
      <Collapsible.Content>
        <Info snapshot={snapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
}
