import React from 'react';

import {getSnapshot as loadSnapshot} from 'in-stores/snapshot';
import {getZone as loadZone} from 'in-stores/zone';
import {alwaysNull} from 'in-services/fixedStreams';


export default function getZone(ComposedComponent) {
  return React.createClass({
    displayName: 'getZoneSnapshot hoc for ' + ComposedComponent.displayName,

    propTypes: {
      snapshotId: React.PropTypes.string.isRequired
    },

    getInitialState() {
      return {
        zoneSnapshot: null
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
      this.disposeSubscription(this.subscription);

      // reset state
      this.setState(this.getInitialState());

      if (snapshotId) {
        this.subscription = loadZone(snapshotId)
          .flatMap(zoneId => {
            if (zoneId) {
              return loadSnapshot(zoneId);
            }
            return alwaysNull;
          })
          .subscribe(zoneSnapshot => {
            this.setState({
              zoneSnapshot
            });
          });
      }
    },

    componentWillUnmount() {
      this.disposeSubscription(this.subscription);
    },

    disposeSubscription(subscription) {
      if (subscription) {
        subscription.dispose();
        subscription = null;
      }
    },

    render() {
      return (
        <ComposedComponent {...this.props}
                           {...this.state} />
      );
    }
  });
}
