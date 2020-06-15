import React from 'react';

import getEcsTasksForEcsTaskDefinitionVersion from 'in-subscription/getEcsTasksForEcsTaskDefinitionVersion';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsEcsTaskDefinitionVersion/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsEcsTaskDefinitionVersionSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>AWS ECS Task Definition Version Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />
      <SidebarSnapshotItemList
        snapshotId={snapshot.get('id')}
        subscription={getEcsTasksForEcsTaskDefinitionVersion}
        label="Tasks"
      />
    </div>
  );
}
