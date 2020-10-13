import React from 'react';

import getProcessesForGoogleCloudRunServiceRevision from 'in-subscription/getProcessesForGoogleCloudRunServiceRevision';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Info from 'in-forge/plugins/googleCloudRunServiceRevision/Info';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';
import { timeConfig$ } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
import { getSnapshot } from 'in-stores/snapshot';

export default function GoogleCloudRunServiceRevisionSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  // We need a snapshot of one of the instances to get hold of the service for this cloud run service revision.
  // (Calls are linked to the instances).
  const arbitraryInstanceSnapshot = useObservable(
    timeConfig$
      .flatMap(timeConfig => getProcessesForGoogleCloudRunServiceRevision({ snapshotId, timeConfig }))
      .map(instanceSnapshots => instanceSnapshots?.[0])
      .flatMap(getSnapshot),
    [snapshotId]
  );

  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Cloud Run Service Revision Info</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <KeyValueOverlay header="Labels" data={snapshot.getIn(['data', 'labels'])} />

      <SidebarSnapshotItemList
        snapshotId={snapshotId}
        subscription={getProcessesForGoogleCloudRunServiceRevision}
        label="Processes"
      />

      {arbitraryInstanceSnapshot && <ServiceInstancesList snapshot={arbitraryInstanceSnapshot} />}
    </>
  );
}
