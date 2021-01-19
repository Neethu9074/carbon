/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function JettyThreadsInfo({ snapshot }) {
  const data = snapshot.get('data');
  const minThreads = data.get('minThreads');
  if (!minThreads) {
    return null;
  }
  return (
    <Collapsible initiallyOpen={false}>
      <Collapsible.Header>Queued Thread Pool</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title="Min Threads">{minThreads}</DescriptionItem>
          <DescriptionItem title="Max Threads">{data.get('maxThreads')}</DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
