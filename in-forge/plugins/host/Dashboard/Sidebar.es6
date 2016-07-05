import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import Collapsible from 'in-components/Collapsible';

import InterfaceList from '../InterfaceList';
import HostHardware from '../HostHardware';
import HostInfo from '../HostInfo';


export default function HostSidebar({snapshot}) {
    return (
      <div>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>System</Collapsible.Header>
          <Collapsible.Content>
            <HostInfo snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Interfaces</Collapsible.Header>
          <Collapsible.Content>
            <InterfaceList snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>

        <HostHardware snapshotId={snapshot.get('id')} />
        <RunningComponentsList snapshotId={snapshot.get('id')} />
      </div>
    );
  }

HostSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
