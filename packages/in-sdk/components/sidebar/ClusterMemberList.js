/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { emptySet } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      snapshotIds: getClusterMembers(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .startWith(emptySet)
    };
  },
  function ClusterMemberList({ snapshotIds }) {
    if (!snapshotIds) {
      return null;
    }

    return <RelatedSnapshotList snapshotIds={snapshotIds} />;
  }
);
