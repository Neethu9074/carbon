import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import MarathonInfo from 'in-forge/plugins/docker/MarathonInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import NomadInfo from 'in-forge/plugins/docker/NomadInfo';

import Info from 'in-forge/plugins/docker/Info';
import Ports from 'in-forge/plugins/docker/Ports';

export default function DockerSidebar({ snapshot }) {
  const labels = snapshot.getIn(['data', 'Labels']);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>
          Docker Container
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {snapshot.getIn(['data', 'PortBindings']) || snapshot.getIn(['data', 'Ports'])
        ? <div>
            <Separator />
            <Collapsible>
              <Collapsible.Header>
                Ports
              </Collapsible.Header>
              <Collapsible.Content>
                <Ports snapshot={snapshot} />
              </Collapsible.Content>
            </Collapsible>
          </div>
        : null}

      <KeyValuePopup header="Container Labels" data={labels} />

      <MarathonInfo snapshot={snapshot} />

      <NomadInfo snapshot={snapshot} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
