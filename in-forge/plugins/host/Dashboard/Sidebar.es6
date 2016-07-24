import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import Separator from 'in-sdk/components/sidebar/Separator';
import Collapsible from 'in-components/Collapsible';

import InterfaceList from 'in-forge/plugins/host/InterfaceList';
import HostHardware from 'in-forge/plugins/host/HostHardware';
import HostInfo from 'in-forge/plugins/host/HostInfo';


export default function HostSidebar({snapshot}) {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>System</Collapsible.Header>
          <Collapsible.Content>
            <HostInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <Separator />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Interfaces</Collapsible.Header>
          <Collapsible.Content>
            <InterfaceList snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <Separator />

        <HostHardware snapshotId={snapshot.get('id')} />

        <Separator />

        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }

HostSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
