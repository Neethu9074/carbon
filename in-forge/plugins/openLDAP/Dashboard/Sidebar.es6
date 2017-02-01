import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';
import ConfigInfo from '../Config';

export default function OpenLDAPSidebar({snapshot}) {

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>
          OpenLDAP
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />
      
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          Config
        </Collapsible.Header>
        <Collapsible.Content>
          <ConfigInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
