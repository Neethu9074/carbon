/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { yesOrNo } from 'in-services/formatters/boolean';

export default function JettyThreadsInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Web Container Thread Pool</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Min Threads">{data.get('threadPools.webContainer.minimumSize')}</DescriptionItem>
            <DescriptionItem title="Max Threads">{data.get('threadPools.webContainer.maximumSize')}</DescriptionItem>
            <DescriptionItem title="Inactivity Timeout">
              {data.get('threadPools.webContainer.inactivityTimeout')}
            </DescriptionItem>
            <DescriptionItem title="Growable">{yesOrNo(data.get('threadPools.webContainer.growable'))}</DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
