import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KeyValuePopup from 'in-components/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import SpringbootInfo from '../SpringbootInfo';


export default function SpringbootSidebar({snapshot}) {
  const data = snapshot.get('data');
  const applicationConfig = data.get('applicationConfig');

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Application Info</Collapsible.Header>
        <Collapsible.Content>
          <SpringbootInfo snapshot={snapshot}/>
        </Collapsible.Content>
      </Collapsible>

      { applicationConfig ?
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Application Config</Collapsible.Header>
          <Collapsible.Content>
            {applicationConfig.map((applicationConfigData, applicationConfigPath) =>
                <KeyValuePopup key={applicationConfigPath} header={applicationConfigPath}
                               data={applicationConfigData}/>
            ).valueSeq().toArray()}
          </Collapsible.Content>
        </Collapsible>
        : null }
      <RunningComponentsList snapshotId={snapshot.get('id')}/>
    </div>
  );
}

SpringbootSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
