/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import { getRunningComponents } from 'in-stores/snapshot';
import { emptySet } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      snapshotIds: getRunningComponents(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptySet)
    };
  },
  function RunningComponentsList({ snapshotIds }) {
    if (!snapshotIds) {
      return null;
    }

    return <RelatedSnapshotList snapshotIds={snapshotIds} />;
  }
);
