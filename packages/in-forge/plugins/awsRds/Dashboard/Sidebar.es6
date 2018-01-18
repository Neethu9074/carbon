import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import Info from 'in-forge/plugins/awsRds/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsRdsSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>RDS Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />
    </div>
  );
}
