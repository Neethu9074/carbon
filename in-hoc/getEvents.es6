import React from 'react';

import {getEventsById} from 'in-services/issueTracker';


export default function getEvents(ComposedComponent) {
  return React.createClass({

    displayName: 'getEvents hoc for ' + ComposedComponent.displayName,

    propTypes: {
      snapshotId: React.PropTypes.string.isRequired
    },

    getInitialState() {
      return {
        events: null
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
        this.subscription = getEventsById(snapshotId).subscribe(allEvents => {
          const events = allEvents && allEvents.size > 0 ?
            allEvents.toArray().sort((i1, i2) =>
              i1.getIn(['problem', 'severity']) > i2.getIn(['problem', 'severity'])) :
            null;
          this.setState({
            events
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
