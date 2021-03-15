/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
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
            {applicationConfig
              .map((applicationConfigData, applicationConfigPath) => (
                <div>
                  <DescriptionList>
                    <DescriptionItem title="Config Path">{applicationConfigPath}</DescriptionItem>
                  </DescriptionList>
                  <KeyValueOverlay header="Properties" data={applicationConfigData} />
                </div>
              ))
              .valueSeq()
              .toArray()}
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
