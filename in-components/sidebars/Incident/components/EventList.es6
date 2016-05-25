import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getEventsWithinTimerange from 'in-hoc/getEventsWithinTimerange';

import Event from 'in-components/sidebars/incident/components/Event';


export default getEventsWithinTimerange(
  React.createClass({

    displayName: 'EventList',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      events: irpt.list
    },

    render() {
      const events = this.props.events;
      if (!events || events.size === 0) {
        return null;
      }

      return (
        <div>
          {events.map(event =>
            <Event key={event.get('id')}
                   event={event} />
          )}
        </div>
      );
    }
  })
);
