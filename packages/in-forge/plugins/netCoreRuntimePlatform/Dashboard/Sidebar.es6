import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import Info from 'in-forge/plugins/netCoreRuntimePlatform/Info';

export default function NetCoreRuntimeSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>.NET Core</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshotId} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
