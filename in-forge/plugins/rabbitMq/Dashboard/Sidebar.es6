import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';

import Info from '../Info';


export default function RabbitMqSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          RabbitMq
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <KeyValuePopup header='Queues'
                     data={snapshot.getIn(['data', 'queues'])} />
    </div>
  );
}
