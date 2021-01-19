/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import { emptySet } from 'in-services/fixedImmutables';
import { getDeployedUnits } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      snapshotIds: getDeployedUnits(props.snapshotId)
        // Always start with an empty set to avoid inconsistent view,
        // displaying deployed units for a previously selected snapshot.
        .startWith(emptySet)
    };
  },
  function DeployedUnitList({ snapshotIds }) {
    if (!snapshotIds) {
      return null;
    }
    return <RelatedSnapshotList snapshotIds={snapshotIds} />;
  }
);
