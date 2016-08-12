import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';


export default function RedisSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Redis
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
