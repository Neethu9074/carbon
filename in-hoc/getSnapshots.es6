import { combineLatest } from 'reactive-observables';
import rpt from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import { getSnapshot as loadSnapshot } from 'in-stores/snapshot';

export default function getSnapshots(ComposedComponent) {
  return createReactClass({
    displayName: 'getSnapshots hoc for ' + ComposedComponent.displayName,

    propTypes: {
      snapshotIds: rpt.array.isRequired
    },

    getInitialState() {
      return {
        snapshots: null
      };
    },

    componentWillMount() {
      this.subscribe(this.props.snapshotIds);
    },

    componentWillReceiveProps(nextProps) {
      let areEqual = true;
      if (this.props.snapshotIds.length !== nextProps.snapshotIds.length) {
        areEqual = false;
      } else {
        for (let i = 0, len = this.props.snapshotIds.length; i < len; i++) {
          if (this.props.snapshotIds[i] !== nextProps.snapshotIds[i]) {
            areEqual = false;
            break;
          }
        }
      }

      if (!areEqual) {
        this.subscribe(nextProps.snapshotIds);
      }
    },

    subscribe(snapshotIds) {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }

      // reset state
      this.setState(this.getInitialState());

      if (snapshotIds) {
        this.subscription = combineLatest(snapshotIds.map(id => loadSnapshot(id))).subscribe(snapshots => {
          this.setState({ snapshots });
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
