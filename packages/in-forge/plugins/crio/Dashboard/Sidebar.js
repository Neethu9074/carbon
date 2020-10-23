import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KubernetesInfo from 'in-infrastructure/Dashboard/components/KubernetesInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/crio/Info';

export default function CrioSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>CRI-O Container</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KubernetesInfo snapshot={snapshot} labels={snapshot.getIn(['data', 'labels'])} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
