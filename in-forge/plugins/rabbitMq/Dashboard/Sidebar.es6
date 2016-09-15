import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
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

      <KeyValuePopup header='Queues'
                     data={snapshot.getIn(['data', 'queues'])} />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
