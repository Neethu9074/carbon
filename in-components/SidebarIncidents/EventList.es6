import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import getEventsWithinTimerange from 'in-hoc/getEventsWithinTimerange';

import Event from './Event';


const rpt = React.PropTypes;

export default getEventsWithinTimerange(
  React.createClass({

    displayName: 'EventList',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
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
