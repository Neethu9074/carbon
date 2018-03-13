import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import TagList from 'in-sdk/components/sidebar/TagList';
import Info from 'in-forge/plugins/awsElb/Info';

export default function AwsElbSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Elb Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />

          <TagList snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
