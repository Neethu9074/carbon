import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function InstanaAgentSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Instana Agent
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
