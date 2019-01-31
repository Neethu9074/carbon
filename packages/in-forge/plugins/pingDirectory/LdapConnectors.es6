import React from 'react';

import Separator from 'in-sdk/components/sidebar/Separator';
import Collapsible from '../../../in-components/Collapsible';
import List from 'in-sdk/components/sidebar/List';

export default function LdapConnectors({ snapshot }) {
  const data = snapshot.get('data');
  const connectorNames = data.get('ldap_connectors.names');
  if (!connectorNames) {
    return null;
  }
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Ldap Connectors</Collapsible.Header>
        <Collapsible.Content>
          <List>
            {connectorNames.map((name, i) => (
              <List.Item key={i}>
                {name + ' (' + data.get('ldap_connectors.data.' + name + '.protocol') + ')'}
              </List.Item>
            ))}
          </List>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
