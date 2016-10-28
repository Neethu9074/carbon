import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info.es6';
import WebApps from '../WebApps.es6';
import ThreadPools from '../ThreadPools.es6';
import Datasources from '../Datasources.es6';


export default function WebSphereSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>WebSphere Server Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ThreadPools snapshot={snapshot} />
      <WebApps snapshot={snapshot} />
      <Datasources snapshot={snapshot} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
