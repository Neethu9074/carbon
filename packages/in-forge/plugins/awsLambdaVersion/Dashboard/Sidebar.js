/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getTriggersForLambdaVersion from 'in-subscription/getTriggersForLambdaVersion';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsLambdaVersion/Info';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsLambdaVersionSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Lambda Version Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <SidebarSnapshotItemList snapshotId={snapshotId} subscription={getTriggersForLambdaVersion} label="Triggers" />

      <KeyValueOverlay header="Runtime Versions" data={snapshot.getIn(['data', 'versions'])} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
