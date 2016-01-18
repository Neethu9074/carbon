import React from 'react';

import {health as healthStates} from 'in-services/health';
import {getHealth as loadHealth} from 'in-stores/health';


export default function getHealth(ComposedComponent) {
  return React.createClass({
    displayName: 'getHealth hoc for ' + ComposedComponent.displayName,

    propTypes: {
      snapshotId: React.PropTypes.string.isRequired
    },

    getInitialState() {
      return {
        health: healthStates.unknown
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

      if (snapshotId) {
        this.subscription = loadHealth(snapshotId).subscribe(health => {
          this.setState({
            health
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
      return (
        <ComposedComponent {...this.props}
                           {...this.state} />
      );
    }
  });
}
