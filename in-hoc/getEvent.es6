import React from 'react';

import {getEvent as getEventFromIssuetracker} from 'in-services/issueTracker';


export default function getEvent(ComposedComponent) {
  return React.createClass({
    displayName: 'getEvent hoc for ' + ComposedComponent.displayName,

    propTypes: {
      eventId: React.PropTypes.string.isRequired
    },

    getInitialState() {
      return {
        event: null
      };
    },

    componentWillMount() {
      this.subscribe(this.props.eventId);
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.eventId !== nextProps.eventId) {
        this.subscribe(nextProps.eventId);
      }
    },

    subscribe(eventId) {
      this.disposeSubscription(this.subscription);

      // reset state
      this.setState(this.getInitialState());

      if (eventId) {
        this.subscription = getEventFromIssuetracker(eventId).subscribe(event => {
          this.setState({
            event
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
