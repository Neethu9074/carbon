import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getEventsWithinTimerange as getEventsWithinTimerangeFromIssueTracker} from 'in-stores/eventsWithinTimerange';
import {emptyList} from 'in-services/fixedImmutables';


export default function getEventsWithinTimerange(ComposedComponent) {
  return React.createClass({

    displayName: 'getEventsWithinTimerange hoc for ' + ComposedComponent.displayName,

    propTypes: {
      incident: irpt.map.isRequired
    },

    getInitialState() {
      return {
        events: null
      };
    },

    componentWillMount() {
      this.subscribe(this.props.incident);
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.incident !== nextProps.incident) {
        this.subscribe(nextProps.incident);
      }
    },

    subscribe(incident) {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }

      // reset state
      this.setState(this.getInitialState());

      if (incident) {
        const recentEvents = incident.get('recentEvents');
        if (!recentEvents || recentEvents.size === 0) {
          return emptyList;
        }
        this.subscription = getEventsWithinTimerangeFromIssueTracker({
          eventIds: recentEvents.toArray(),
          from: incident.get('start'),
          to: incident.get('end')
        }).subscribe(events => this.setState({ events }));
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
