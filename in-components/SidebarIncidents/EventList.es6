import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getEventsWithinTimerange} from 'in-stores/eventsWithinTimerange';
import {emptyList} from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

import Event from './Event';


const rpt = React.PropTypes;

export default connectTo(
  props => {
    return {
      events: getEventsWithinTimerange({
        from: props.incident.get('start'),
        to: props.incident.get('end'),
        eventIds: props.incident.get('recentEvents', emptyList).toArray()
      })
    };
  },
  React.createClass({

    displayName: 'EventList',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      incident: irpt.map.isRequired,
      events: rpt.array
    },

    render() {
      const events = this.props.events;
      if (!events) {
        return null;
      }

      return (
        <div>
          {events.sort((a, b) => a.get('start') - b.get('start'))
                 .map(event =>
                   <Event key={event.get('id')}
                          event={event} />
          )}
        </div>
      );
    }
  })
);
