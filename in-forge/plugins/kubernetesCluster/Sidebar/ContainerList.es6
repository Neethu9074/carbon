import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function ContainerList({ snapshot }) {
  const containers = snapshot.getIn(['data', 'spec', 'containers'], emptyList);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Containers</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {containers.map(c => (
              <DescriptionItem key={c.get('image')}>
                {c.get('name')} ({c.get('image')})
              </DescriptionItem>
            ))}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
