import React from 'react';

import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot as loadSnapshot} from 'in-stores/snapshot';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';


/**
 * This function creates a composed higher-order component
 * which will:
 *
 *  1. Retrieve the currently selected snapshot and set it as a property
 *     called `snapshotId`.
 *  2. Retrieve the full snapshot for the selected snapshot id.
 *  3. Ensure that snapshotId and snapshot are always consistent, i.e. it
 *     can never happen that snapshotId !== snapshot.get('id').
 *  4. Clear the full snapshot whenever a new snapshot ID is selected.
 */
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
      this.snapshotIdSubscription = selectedSnapshotStore.selectedEntityId
        .subscribe(snapshotId => {
          this.setState(previousState => {
            const update = {snapshotId};

            if (previousState.snapshot &&
                previousState.snapshot.get('id') !== snapshotId) {
              update.snapshot = null;
            }

            return update;
          });
        });

      this.snapshotSubscription = selectedSnapshotStore.selectedEntityId
        .flatMap(snapshotId => {
          if (snapshotId) {
            return loadSnapshot(snapshotId);
          }
          return alwaysNull;
        })
        .subscribe(snapshot => {
          this.setState(previousState => {
            if (snapshot == null) {
              return {snapshot: null};
            } else if (snapshot.get('id') === previousState.snapshotId) {
              return {snapshot};
            }
            return {};
          });
        });
    },

    componentWillUnmount() {
      this.snapshotIdSubscription.dispose();
      this.snapshotSubscription.dispose();
    },

    render() {
      return (
        <ComposedComponent {...this.props}
                           {...this.state} />
      );
    }
  });
}
