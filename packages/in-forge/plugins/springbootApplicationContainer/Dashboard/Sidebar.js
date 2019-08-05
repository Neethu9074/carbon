import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { ClickableList } from 'in-sdk/components/sidebar/ClickableList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function SpringbootSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const applicationConfig = data.get('applicationConfig');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Application Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {applicationConfig ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Application Configs</Collapsible.Header>
          <Collapsible.Content>
            <ClickableList>
              {applicationConfig
                .map((applicationConfigData, applicationConfigPath) => (
                  <KeyValueOverlay header={applicationConfigPath} data={applicationConfigData} />
                ))
                .valueSeq()
                .toArray()}
            </ClickableList>
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
