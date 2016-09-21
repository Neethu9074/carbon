import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';

import InterfaceList from 'in-forge/plugins/host/InterfaceList';
import HostHardware from 'in-forge/plugins/host/HostHardware';

import Info from '../Info';


export default function HostSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>System</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <InterfaceList snapshot={snapshot} />

      <HostHardware snapshotId={snapshot.get('id')} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
