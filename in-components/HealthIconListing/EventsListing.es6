import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import EventDescription from 'in-components/EventDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import getEvents from 'in-hoc/getEvents';

import './EventsListing.less';


const block = 'in-health-listing-events';
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
        <div className={block}>
          <TooltipFrame>
            {events.map(event =>
              <EventDescription className={block + '__item'}
                                key={event.get('id')}
                                event={event}
                                snapshotId={event.getIn(['problem', 'snapshotId'])}/>)
            }
          </TooltipFrame>
        </div>
      );
    }
  })
);
