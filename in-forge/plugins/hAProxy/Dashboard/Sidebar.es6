import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';

import HAProxyInfo from '../HAProxyInfo';


export default function HAProxySidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>HAProxy</Collapsible.Header>
        <Collapsible.Content>
          <HAProxyInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
