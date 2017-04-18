import rpt from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import { getSnapshot as loadSnapshot } from 'in-stores/snapshot';

export default function getSnapshot(ComposedComponent) {
  return createReactClass({
    displayName: 'getSnapshot hoc for ' + (ComposedComponent.displayName || ComposedComponent.name),

    propTypes: {
      snapshotId: rpt.string.isRequired
    },

    getInitialState() {
      return {
        snapshot: null
      };
    },

    componentWillMount() {
      this.subscribe(this.props.snapshotId);
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.snapshotId !== nextProps.snapshotId) {
        this.subscribe(nextProps.snapshotId);
      }
    },

    subscribe(snapshotId) {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }

      // reset state
      this.setState(this.getInitialState());

      if (snapshotId) {
        this.subscription = loadSnapshot(snapshotId).subscribe(snapshot => {
          this.setState({
            snapshot
          });
        });
      }
    },

    componentWillUnmount() {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }
    },

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  });
}
