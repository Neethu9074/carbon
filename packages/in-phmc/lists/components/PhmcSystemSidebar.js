/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import { Fragment } from 'react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import getPhmcSystemSidebar from 'in-phmc/subscriptions/getPhmcSystemSidebar';
import { timeConfig$ } from 'in-stores/time/config';

export default function PhmcSidebar({ snapshotId }) {
  const snapshotIds = useObservable(
    timeConfig$.flatMap(timeConfig =>
      getPhmcSystemSidebar({
        filter: {
          systemId: snapshotId,
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
