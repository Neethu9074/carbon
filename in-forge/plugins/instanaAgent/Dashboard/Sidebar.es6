import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function InstanaAgentSidebar({snapshot}) {
  return (
    <div>
      <Separator />
      {
        // TODO: Need to have a dropdown to switch between on / off
        // After new licensing is out also off / Infrastructure / Application
      }
      Agent {snapshot.getIn(['data', 'mode']) ? 'active' : 'inactive'}
      <Separator />
      <Collapsible initiallyOpen>
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
