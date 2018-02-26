import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import Info from 'in-forge/plugins/awsDynamoDb/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsDynamoDbSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>DynamoDb Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />

          <TagList snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
