import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import CloudfoundryInfo from 'in-forge/plugins/garden/CloudfoundryInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { pcfEnabled } from 'in-services/featureFlags';

import Info from 'in-forge/plugins/garden/Info';

export default function GardenSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Garden Container</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {pcfEnabled && <CloudfoundryInfo snapshot={snapshot} />}
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
