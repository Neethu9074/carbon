import React from 'react';

import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';


export default function HttpdSidebar({snapshot}) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Apache Httpd</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValuePopup header='Modules'
                     data={snapshot.getIn(['data', 'modules'])} />
    </div>
  );
}
