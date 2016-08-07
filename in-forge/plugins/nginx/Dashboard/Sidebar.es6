import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import NginxInfo from '../NginxInfo';


export default function NginxSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Nginx</Collapsible.Header>
        <Collapsible.Content>
          <NginxInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
