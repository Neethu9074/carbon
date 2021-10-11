/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import { getItemsInAvailabilityZone } from 'in-sdk/getItemsInAvailabilityZone';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      hosts: getItemsInAvailabilityZone(props.snapshotId)
    };
  },
  function ZoneItemsList({ hosts }) {
    if (!hosts || hosts.length === 0) {
      return null;
    }
    return <RelatedSnapshotList snapshotIds={hosts} />;
  }
);
