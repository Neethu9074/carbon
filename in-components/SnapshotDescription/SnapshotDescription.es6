import React from 'react';

import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './SnapshotDescription.less';

const block = 'in-snapshot-description';

export default connectTo(
  props => {
    if (!props.snapshotId) {
      return {};
    }

    return {
      snapshot: getSnapshot(props.snapshotId, props.time).startWith(null)
    };
  },
  function SnapshotDescription({ snapshot }) {
    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        <PluginIcon className={block + '__icon'} dimension={13} snapshot={snapshot} />
        <span className={block + '__label'}>
          {getLabel(snapshot)}
        </span>
      </div>
    );
  }
);
