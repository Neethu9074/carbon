import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Info from 'in-forge/plugins/dropwizardApplicationContainer/Info';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function DropwizardSidebar({snapshot}) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Dropwizard</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
