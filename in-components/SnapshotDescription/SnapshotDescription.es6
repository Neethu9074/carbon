import React from 'react';

import {getIcon, getLabel} from 'in-sdk/snapshot';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import './SnapshotDescription.less';


const block = 'in-snapshot-description';

export default connectTo(props => {
    if (!props.snapshotId) {
      return {};
    }

    return {
      snapshot: getSnapshot(props.snapshotId, props.time)
        .startWith(null)
    };
  }, function SnapshotDescription({snapshot}) {
    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        <img src={getIcon(snapshot)}
             alt='Snapshot icon'
             className={block + '__icon'} />
        <span className={block + '__label'}>
          {getLabel(snapshot)}
        </span>
      </div>
    );
});
