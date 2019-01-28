import React from 'react';

import { DescriptionItem, DescriptionList } from '../../../in-components/DescriptionList';
import Separator from 'in-sdk/components/sidebar/Separator';
import Collapsible from '../../../in-components/Collapsible';

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
          {connectorNames.map((connectorName, i) => (
            <Collapsible initiallyOpen={false} key={i}>
              <Collapsible.Header>{connectorName}</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  <DescriptionItem title="Name">{connectorName}</DescriptionItem>
                  <DescriptionItem title="Protocol">
                    {data.get('ldap_connectors.data.' + connectorName + '.protocol')}
                  </DescriptionItem>
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          ))}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
