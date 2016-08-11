import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';


export default function JbossDataGridInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <Collapsible initiallyOpen={true}>
      <Collapsible.Header>Jboss Data Grid Info</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title='Version'>
            {data.get('version')}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}
