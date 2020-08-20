import React from 'react';

import Info from 'in-forge/plugins/googleCloudRunServiceRevision/Info';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function GoogleCloudRunServiceRevisionSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Google Cloud Run Service Revision Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      {/*
      TODO list the docker containers that are running in this service revision
      <SidebarSnapshotItemList
        snapshotId={snapshot.get('id')}
        subscription={getDockerContainersForGoogleCloudRunServiceRevision}
        label="Containers"
      />
      */}
    </div>
  );
}
