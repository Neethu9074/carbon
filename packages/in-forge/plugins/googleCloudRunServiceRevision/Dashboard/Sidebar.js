import React from 'react';

import getDockerContainersForGoogleCloudRunServiceRevision from 'in-subscription/getDockerContainersForGoogleCloudRunServiceRevision';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import Info from 'in-forge/plugins/googleCloudRunServiceRevision/Info';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function GoogleCloudRunServiceRevisionSidebar({ snapshot }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Google Cloud Run Service Revision Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <SidebarSnapshotItemList
        snapshotId={snapshot.get('id')}
        subscription={getDockerContainersForGoogleCloudRunServiceRevision}
        label="Containers"
      />
      <ServiceInstancesList snapshot={snapshot} />
    </>
  );
}
