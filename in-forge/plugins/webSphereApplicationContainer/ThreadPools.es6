import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

const formatBoolean = value => value ? 'Yes' : 'No';

export default function JettyThreadsInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Web Container Thread Pool</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title='Min Threads'>
              {data.get('threadPools.webContainer.minimumSize')}
            </DescriptionItem>
            <DescriptionItem title='Max Threads'>
              {data.get('threadPools.webContainer.maximumSize')}
            </DescriptionItem>
            <DescriptionItem title='Inactivity Timeout'>
              {data.get('threadPools.webContainer.inactivityTimeout')}
            </DescriptionItem>
            <DescriptionItem title='Growable'>
              {formatBoolean(data.get('threadPools.webContainer.growable'))}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
