import React from 'react';

import MemcachedInfo from 'in-forge/plugins/memcached/MemcachedInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';


export default function MemcachedSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Memcached
        </Collapsible.Header>
        <Collapsible.Content>
          <MemcachedInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
