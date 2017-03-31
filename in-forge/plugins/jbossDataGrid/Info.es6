import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function JbossDataGridInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>Jboss Data Grid Info</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title="Jboss Data Grid Version">
            {data.get('version')}
          </DescriptionItem>
          <DescriptionItem title="JGroups Version">
            {data.get('jGroupsVersion')}
          </DescriptionItem>
          <DescriptionItem title="HotRod Max Worker Threads">
            {data.get('hotRod.numberOfWorkerThreads')}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
