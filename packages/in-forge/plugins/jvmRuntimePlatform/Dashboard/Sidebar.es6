import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import AppInfo from '../AppInfo';
import Info from '../Info';

export default function JvmRuntimeSidebar({ snapshot }) {
  const args = snapshot.getIn(['data', 'jvm.args']);

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>App</Collapsible.Header>
        <Collapsible.Content>
          <AppInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen>
        <Collapsible.Header>JVM</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {args ? <KeyValueOverlay header="JVM Arguments" data={args} /> : null}

      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
