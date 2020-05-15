import React from 'react';

import getEcsTaskDefinitionVersionsForEcsTaskDefinition from 'in-subscription/getEcsTaskDefinitionVersionsForEcsTaskDefinition';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsEcsTaskDefinition/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsEcsTaskDefinitionSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>AWS ECS Task Definition Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <SidebarSnapshotItemList
        snapshotId={snapshot.get('id')}
        subscription={getEcsTaskDefinitionVersionsForEcsTaskDefinition}
        label="Versions"
      />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
