import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/containerd/Info';

export default function ContainerdSidebar({ snapshot }) {
  const labels = snapshot.getIn(['data', 'labels']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Containerd Container</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValueOverlay header="Container Labels" data={labels} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
