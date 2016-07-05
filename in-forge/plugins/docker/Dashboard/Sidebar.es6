import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import KeyValuePopup from 'in-components/KeyValuePopup';
import Collapsible from 'in-components/Collapsible';

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

          <KeyValuePopup header='Container Labels'
                         data={labels} />
        </Collapsible.Content>
      </Collapsible>


      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

DockerSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
