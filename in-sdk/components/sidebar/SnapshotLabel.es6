import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function SnapshotLabel({ snapshot }) {
    if (!snapshot) {
      return (
        <LoadingIndicator
          type="dark"
          inline
          style={{
            height: '12px'
          }}
        />
      );
    }
    return (
      <span>
        {getLabel(snapshot)}
      </span>
    );
  }
);
