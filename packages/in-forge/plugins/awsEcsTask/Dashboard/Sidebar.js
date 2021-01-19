/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getEcsContainersForEcsTask from 'in-subscription/getEcsContainersForEcsTask';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsEcsTask/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsEcsTaskSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>AWS ECS Task Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <SidebarSnapshotItemList
        snapshotId={snapshot.get('id')}
        subscription={getEcsContainersForEcsTask}
        label="Containers"
      />
    </div>
  );
}
