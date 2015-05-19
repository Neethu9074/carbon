'use strict';

import React from 'react';

import SnapshotIcon from '../../SnapshotIcon';

const SnapshotIconDemo = React.createClass({
  render() {
    return (
      <div>
        <h1>OK:</h1>
        <SnapshotIcon snapshot={this.withSeverity(0)} />

        <h1>Warning:</h1>
        <SnapshotIcon snapshot={this.withSeverity(5)} />

        <h1>Danger:</h1>
        <SnapshotIcon snapshot={this.withSeverity(10)} />
      </div>
    );
  },

  withSeverity(severity) {
    return this.props.snapshot.setIn(
      [
       'snapshot', 'status', 'memory', 'stream_merger_70',
       'problems', '0', 'severity'
      ],
      severity
    );
  }
});

export default SnapshotIconDemo;
