import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import KubernetesInfo from 'in-forge/plugins/docker/KubernetesInfo';
import MarathonInfo from 'in-forge/plugins/docker/MarathonInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import NomadInfo from 'in-forge/plugins/docker/NomadInfo';
import Ports from 'in-forge/plugins/docker/Ports';
import Info from 'in-forge/plugins/docker/Info';

export default function DockerSidebar({ snapshot }) {
  const labels = snapshot.getIn(['data', 'Labels']);
  const ports = snapshot.getIn(['data', 'PortBindings']) || snapshot.getIn(['data', 'Ports']);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Docker Container</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {ports && ports.size > 0 ? (
        <div>
          <Separator />
          <Collapsible>
            <Collapsible.Header>Ports</Collapsible.Header>
            <Collapsible.Content>
              <Ports snapshot={snapshot} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      ) : null}

      <KeyValueOverlay header="Container Labels" data={labels} />

      <MarathonInfo snapshot={snapshot} />

      <NomadInfo snapshot={snapshot} />

      <KubernetesInfo snapshot={snapshot} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
