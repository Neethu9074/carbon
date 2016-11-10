import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import JettyThreadsInfo from '../JettyThreadsInfo.es6';
import JettyConnectors from '../JettyConnectors.es6';
import JettyWebApps from '../JettyWebApps.es6';
import Info from '../Info.es6';


export default function JettySidebar({snapshot}) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Jetty Server Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <JettyThreadsInfo snapshot={snapshot} />
      <JettyConnectors snapshot={snapshot} />
      <JettyWebApps snapshot={snapshot} />
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
