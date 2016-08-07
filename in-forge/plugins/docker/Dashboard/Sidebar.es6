import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import DockerInfo from 'in-forge/plugins/docker/DockerInfo';


export default function DockerSidebar({snapshot}) {
  const labels = snapshot.getIn(['data', 'Labels']);

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Docker Container
        </Collapsible.Header>
        <Collapsible.Content>
          <DockerInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <KeyValuePopup header='Container Labels'
                     data={labels} />

      <Separator />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
