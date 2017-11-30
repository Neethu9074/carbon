import React from 'react';

import getHostsInAvailabilityZone from 'in-stores/graph/getHostsInAvailabilityZone';
import RelatedSnapshotList from 'in-sdk/components/sidebar/RelatedSnapshotList';
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
