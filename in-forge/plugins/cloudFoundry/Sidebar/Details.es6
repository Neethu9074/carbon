import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import GeneralInfo from '../GeneralInfo';
import Info from '../Info';

export default function CloudFoundrySidebar({snapshot}) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>CloudFoundry</Collapsible.Header>
        <Collapsible.Content>
          <GeneralInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible>
        <Collapsible.Header>Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
