import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';


export default function MsSqlSidebar({snapshot}) {
  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen>
        <Collapsible.Header>MS SQL-Server</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
