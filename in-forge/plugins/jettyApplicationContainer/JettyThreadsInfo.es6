import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function JettyThreadsInfo({ snapshot }) {
  const data = snapshot.get('data');
  const minThreads = data.get('minThreads');
  if (!minThreads) {
    return null;
  }
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Queued Thread Pool</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Min Threads">
              {minThreads}
            </DescriptionItem>
            <DescriptionItem title="Max Threads">
              {data.get('maxThreads')}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
