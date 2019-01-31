import React from 'react';

import Collapsible from 'in-components/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import List from 'in-sdk/components/sidebar/List';

export default function Databases({ snapshot }) {
  const databases = snapshot.getIn(['data', 'recent_changes.names']);
  if (!databases) {
    return null;
  }
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Databases</Collapsible.Header>
        <Collapsible.Content>
          <List>
            {databases.map((database, i) => (
              <List.Item key={i}>{database}</List.Item>
            ))}
          </List>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
