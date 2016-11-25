import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import EventDescription from 'in-components/EventDescription';
import getEvents from 'in-hoc/getEvents';

import './EventListing.less';


const block = 'in-event-listing';
const rpt = React.PropTypes;

export default getEvents(
  React.createClass({

    displayName: 'EventListing',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      snapshotId: rpt.string.isRequired,
      events: rpt.array
    },

    render() {
      let events = this.props.events;
      if (!events) {
        return null;
      }

      events = events.sort((a, b) => a.get('severity') < b.get('severity'));

      return (
        <div className={block}>
            {events.map(event =>
              <EventDescription className={block + '__item'}
                                key={event.get('id')}
                                event={event}
                                snapshotId={event.getIn(['problem', 'snapshotId'])} />)
            }
        </div>
      );
    }
  })
);
