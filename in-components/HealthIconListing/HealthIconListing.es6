import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import EventDescription from 'in-components/EventDescription';
import {getColorForEvent} from 'in-services/issueTracker';
import getEvents from 'in-hoc/getEvents';

import Tooltip from '../Tooltip';
import './HealthIconListing.less';


const block = 'in-health-listing';
const rpt = React.PropTypes;

export default getEvents(
               React.createClass({

  displayName: 'HealthIconListing',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    className: rpt.string,
    events: rpt.array
  },

  render() {
    const events = this.props.events;
    if (!events) {
      return null;
    }

    return (
      <Tooltip content={
        <div>
          {events.map(event =>
            <EventDescription key={event.get('id')}
                              event={event}
                              snapshotId={this.props.snapshotId}/>)}
        </div>
      }>
        <div className={block}
             style={{background: getColorForEvent(events[0])}}>
          {events.length}
        </div>
      </Tooltip>
    );
  }
}));
