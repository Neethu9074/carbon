import React from 'react';

import {ClickableKeyValuePopupListItem, ClickableList} from 'in-sdk/components/sidebar/ClickableList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';


export default function SpringbootSidebar({snapshot}) {
  const data = snapshot.get('data');
  const applicationConfig = data.get('applicationConfig');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Application Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>


      { applicationConfig ?
        <div>
          <Separator />

          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>Application Configs</Collapsible.Header>
            <Collapsible.Content>
              <ClickableList>
                {applicationConfig.map((applicationConfigData, applicationConfigPath) =>
                  <ClickableKeyValuePopupListItem title={applicationConfigPath}
                                                  key={applicationConfigPath}
                                                  data={applicationConfigData}>
                    {applicationConfigPath}
                  </ClickableKeyValuePopupListItem>
                ).valueSeq().toArray()}
              </ClickableList>
            </Collapsible.Content>
          </Collapsible>
        </div>
        : null }

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
