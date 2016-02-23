import React from 'react';

import {selectedSnapshotWithId} from 'in-stores/snapshot';

export default function getSelectedSnapshot(ComposedComponent) {
  return React.createClass({
    displayName: 'getSelectedSnapshot hoc for ' + ComposedComponent.displayName,

    getInitialState() {
      return {
        snapshotId: null,
        snapshot: null
      };
    },

    componentWillMount() {
      this.subscription = selectedSnapshotWithId
        .subscribe(this.setState.bind(this));
    },

    componentWillUnmount() {
      this.subscription.dispose();
    },

    render() {
      return (
        <ComposedComponent {...this.props}
                           {...this.state} />
      );
    }
  });
}
