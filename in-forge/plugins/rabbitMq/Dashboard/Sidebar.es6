import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';


export default function RabbitMqSidebar({snapshot}) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          RabbitMq
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValuePopup header='Queues'
                     data={snapshot.getIn(['data', 'queues'])} />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
