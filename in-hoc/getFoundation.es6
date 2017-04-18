import rpt from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import { alwaysNull } from 'in-services/fixedStreams';
import { getFoundations } from 'in-stores/snapshot';
import { getSnapshot } from 'in-stores/snapshot';

export default function getFoundationHoc(ComposedComponent) {
  return createReactClass({
    displayName: 'getFoundation hoc for ' + ComposedComponent.displayName,

    propTypes: {
      snapshotId: rpt.string.isRequired
    },

    getInitialState() {
      return {
        foundationSnapshotId: null,
        foundationSnapshot: null
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
      this.disposeSubscription(this.foundationSnapshotIdSubscription);
      this.disposeSubscription(this.foundationSnapshotSubscription);

      // reset state
      this.setState(this.getInitialState());

      if (snapshotId) {
        const foundationSnapshotId$ = getFoundations(snapshotId).map(foundations => foundations.first());

        const foundationSnapshot$ = foundationSnapshotId$.flatMap(foundationsnapshotId => {
          if (foundationsnapshotId) {
            return getSnapshot(foundationsnapshotId);
          }
          return alwaysNull;
        });

        this.foundationSnapshotIdSubscription = foundationSnapshotId$.subscribe(foundationSnapshotId => {
          this.setState({ foundationSnapshotId });
        });

        this.foundationSnapshotSubscription = foundationSnapshot$.subscribe(foundationSnapshot => {
          this.setState({ foundationSnapshot });
        });
      }
    },

    componentWillUnmount() {
      this.disposeSubscription(this.foundationSnapshotSubscription);
      this.disposeSubscription(this.foundationSnapshotIdSubscription);
    },

    disposeSubscription(subscription) {
      if (subscription) {
        subscription.dispose();
        subscription = null;
      }
    },

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  });
}
