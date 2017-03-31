import React from 'react';

import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function HumanReadablePluginName({ snapshot, fallback = null }) {
    return (
      <span>
        {snapshot ? getSingular(snapshot.get('plugin')) : fallback}
      </span>
    );
  }
);
