import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import TagList from 'in-sdk/components/sidebar/TagList';

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

        <TagList snapshot={snapshot} />

        <Separator />

        <InterfaceList snapshot={snapshot} />

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
