/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function MarathonInfo({ snapshot }) {
  const marathon = snapshot.getIn(['data', 'Marathon']);
  if (!marathon || marathon.size === 0) {
    return null;
  }

  const labels = marathon.get('labels');

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Marathon</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="App ID">{marathon.get('appId')}</DescriptionItem>
            <DescriptionItem title="App Version">{marathon.get('appVersion')}</DescriptionItem>
            <DescriptionItem title="CPU Resources">{marathon.get('cpuResources')}</DescriptionItem>
            <DescriptionItem title="Memory Resources">
              {marathon.get('memoryResources') ? `${marathon.get('memoryResources')} MB` : null}
            </DescriptionItem>
            <DescriptionItem title="Disk Resources">
              {marathon.get('diskResources') ? `${marathon.get('diskResources')} MB` : null}
            </DescriptionItem>
          </DescriptionList>

          {labels && labels.size > 0 ? <KeyValueOverlay header="Marathon Labels" data={labels} /> : null}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
