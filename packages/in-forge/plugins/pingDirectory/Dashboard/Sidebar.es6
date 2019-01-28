import React from 'react';

import Collapsible from '../../../../in-components/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import LdapConnectors from '../LdapConnectors';
import Databases from '../Databases';
import Info from '../Info';

export default function PingDirectorySidebar({ snapshot }) {
  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>PingIdentity Directory Server</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <LdapConnectors snapshot={snapshot} />
      <Databases snapshot={snapshot} />
    </div>
  );
}
