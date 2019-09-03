import React from 'react';

import getVersionsForLambdaFunction from 'in-subscription/getVersionsForLambdaFunction';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsLambdaFunction/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsLambdaFunctionSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Lambda Function Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <SidebarSnapshotItemList
        snapshotId={snapshot.get('id')}
        subscription={getVersionsForLambdaFunction}
        label="Versions"
      />
    </div>
  );
}
