import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyList } from 'in-services/fixedImmutables';
import List from 'in-sdk/components/sidebar/List';

export default function ServiceEndpointsList({ snapshot }) {
  const endpoints = snapshot.getIn(['data', 'service_endpoints'], emptyList);
  if (endpoints.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          Endpoints ({endpoints.size})
        </Collapsible.Header>
        <Collapsible.Content>
          <List>
            {endpoints.toArray().map(endpointName => (
              <List.Item key={endpointName}>
                {endpointName}
              </List.Item>
            ))}
          </List>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
