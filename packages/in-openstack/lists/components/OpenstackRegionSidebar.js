/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Fragment } from 'react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import getOpenstackRegionSidebar from 'in-openstack/subscriptions/getOpenstackRegionSidebar';
import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import { timeConfig$ } from 'in-stores/time/config';

export default function OpenstackSidebar({ snapshotId }) {
  const snapshotIds = useObservable(
    timeConfig$.flatMap(timeConfig =>
      getOpenstackRegionSidebar({
        filter: {
          regionId: snapshotId,
          timeConfig
        }
      })
    ),
    [snapshotId]
  );
  if (!snapshotIds) {
    return null;
  }
  return (
    <Fragment>
      <RelatedSnapshotList snapshotIds={snapshotIds} />
    </Fragment>
  );
}
