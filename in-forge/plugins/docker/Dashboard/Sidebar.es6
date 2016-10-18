import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from 'in-forge/plugins/docker/Info';


export default function DockerSidebar({snapshot}) {
  const labels = snapshot.getIn(['data', 'Labels']);

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Docker Container
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValuePopup header='Container Labels'
                     data={labels} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
