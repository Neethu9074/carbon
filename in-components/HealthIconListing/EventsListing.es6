import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import EventDescription from 'in-components/EventDescription';
import getEvents from 'in-hoc/getEvents';

import './HealthIconListing.less';


const rpt = React.PropTypes;

export default getEvents(
  React.createClass({

    displayName: 'EventsListing',

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

      events = events.sort((a, b) => a.getIn(['problem', 'severity']) < b.getIn(['problem', 'severity']));

      return (
        <div>
          {events.map(event =>
            <EventDescription className={'in-health-listing__item'}
                              key={event.get('id')}
                              event={event}
                              snapshotId={event.getIn(['problem', 'snapshotId'])}/>)
          }
        </div>
      );
    }
  })
);
