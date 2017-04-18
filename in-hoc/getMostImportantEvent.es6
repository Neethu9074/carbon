import rpt from 'prop-types';
import React from 'react';

import { getMostImportantEventAtFocusedMoment } from 'in-stores/events';

export default function getMostImportantEvent(ComposedComponent) {
  return React.createClass({
    displayName: 'getMostImportantEvent hoc for ' + ComposedComponent.displayName,

    propTypes: {
      snapshotId: rpt.string.isRequired
    },

    getInitialState() {
      return {
        mostImportantEvent: null
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
        this.subscription = getMostImportantEventAtFocusedMoment(snapshotId).subscribe(mostImportantEvent =>
          this.setState({
            mostImportantEvent
          })
        );
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
