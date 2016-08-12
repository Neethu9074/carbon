import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';


export default function MemcachedSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Memcached
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
