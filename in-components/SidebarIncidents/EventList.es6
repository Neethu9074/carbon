import PureRenderMixin from 'react-addons-pure-render-mixin';
import {combineLatest} from 'reactive-observables';
import React from 'react';

import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import Event from './Event';


const rpt = React.PropTypes;

export default connectTo(
  props => {
    return {
      events: combineLatest(props.eventIds.map(id => getEvent(id, props.to)))
    };
  },
  React.createClass({

    displayName: 'EventList',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      eventIds: rpt.array.isRequired,
      to: rpt.number.isRequired,
      events: rpt.array
    },

    render() {
      const events = this.props.events;
      if (!events) {
        return null;
      }

      return (
        <div>
          {events.sort((a, b) => b.get('start') - a.get('start'))
                 .map(event =>
                   <Event key={event.get('id')}
                          event={event} />
          )}
        </div>
      );
    }
  })
);
