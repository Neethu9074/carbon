import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

const formatBoolean = value => (value ? 'Yes' : 'No');

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>Info</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionItem title="Process ID">
          {data.get('pid')}
        </DescriptionItem>
        <DescriptionList>
          <DescriptionItem title="Version">
            {data.get('version')}
          </DescriptionItem>
          <DescriptionItem title="Start Time">
            {data.get('startTime')}
          </DescriptionItem>
          <DescriptionItem title="Initialised">
            {formatBoolean(data.get('initialised'))}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
