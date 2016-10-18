import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValuePopup from 'in-sdk/components/sidebar/KeyValuePopup';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';


export default function SpringbootSidebar({snapshot}) {
  const data = snapshot.get('data');
  const applicationConfig = data.get('applicationConfig');

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Application Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot}/>
        </Collapsible.Content>
      </Collapsible>


      { applicationConfig ?
        <div>
          <Separator />
          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Application Config</Collapsible.Header>
            <Collapsible.Content>
              {applicationConfig.map((applicationConfigData, applicationConfigPath) =>
                  <KeyValuePopup key={applicationConfigPath} header={applicationConfigPath}
                                 data={applicationConfigData}/>
              ).valueSeq().toArray()}
            </Collapsible.Content>
          </Collapsible>
        </div>
        : null }

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
