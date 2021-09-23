/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
import { getHostsInAvailabilityZone } from 'in-sdk/getHostsInAvailabilityZone';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      hosts: getHostsInAvailabilityZone(props.snapshotId)
    };
  },
  function ZoneHostsList({ hosts }) {
    if (!hosts || hosts.length === 0) {
      return null;
    }
    return <RelatedSnapshotList snapshotIds={hosts} />;
  }
);
