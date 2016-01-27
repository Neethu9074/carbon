import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getIcon, getLabel} from 'in-sdk/snapshot';

import './SnapshotDescription.less';

const block = 'in-snapshot-description';

export default React.createClass({

  displayName: 'SnapshotDescription',

  propTypes: {
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        <img src={getIcon(snapshot)}
             alt='Snapshot icon'
             className={block + '__icon'}/>
        <span className={block + '__label'}>
          {getLabel(snapshot)}
        </span>
      </div>
    );
  }
});
