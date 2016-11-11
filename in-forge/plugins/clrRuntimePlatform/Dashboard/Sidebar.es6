import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import Info from 'in-forge/plugins/clrRuntimePlatform/Info';


export default function ClrRuntimeSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>.NET CLR</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshotId} />
      <ServiceInstancesList snapshotId={snapshotId} />
    </div>
  );
}
