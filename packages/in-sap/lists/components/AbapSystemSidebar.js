/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import getAbapSystemSidebar from 'in-sap/subscriptions/getAbapSystemSidebar';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    snapshotIds: timeConfig$.flatMap(timeConfig =>
      getAbapSystemSidebar({
        filter: {
          hostId: props.snapshotId,
          timeConfig
        }
      })
    )
  }),
  function getAbapSidebar({ snapshotIds }) {
    if (!snapshotIds) {
      return null;
    }
    return <RelatedSnapshotList snapshotIds={snapshotIds} />;
  }
);
