import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Info from 'in-forge/plugins/finagleApplicationContainer/Info';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function FinagleSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Finagle</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
