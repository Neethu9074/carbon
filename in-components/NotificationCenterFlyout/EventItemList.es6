import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';
import moment from 'moment';

import connectTo from 'in-hoc/connectTo';

import {
  event$,
  selectedNotificationFilter
} from 'in-components/NotificationCenterFlyout/notificationCenterFlyoutStores';
import EventDescription from 'in-components/EventDescription';

import './EventItemList.less';


const block = 'in-notificationcenter-eventitemlist';
const rpt = React.PropTypes;

export default connectTo({
    selectedNotificationFilter,
    allEvents: event$
  },
  React.createClass({

    displayName: 'NotificationCenterEventItemList',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedNotificationFilter: rpt.object,
      allEvents: irpt.list,
      style: rpt.object
    },

    render() {
      const allEvents = this.props.allEvents;
      if (!allEvents) {
        return null;
      }

      const sortedEvent = allEvents
                            .filter(event => this.props.selectedNotificationFilter.predicate(event))
                            .sort((a, b) => b.get('start') - a.get('start'));
      const days = this.getEventsPerDay(sortedEvent);
      const dailyEvents = Object.keys(days);

      return (
        <ul className={block}
            style={this.props.style}>
          {dailyEvents.map(key => {
            const events = days[key];
            return (
              <li key={key}
                  className={block + '__list-item'}>

                <div className={block + '__header-label'}>
                  {this.getDayStringForDate(key)}
                </div>
                {events.map(event => <EventDescription key={event.get('id')}
                                                       event={event}
                                                       snapshotId={event.getIn(['problem', 'snapshotId'], '')}
                                                       className={block + '__item'}/>)}
              </li>
            );
          })}
       </ul>
      );
    },

    getDayStringForDate(dateString) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (dateString === this.getDateString(today)) {
        return 'Today';
      } else if (dateString === this.getDateString(yesterday)) {
        return 'Yesterday';
      }
      return dateString;
    },

    getEventsPerDay(events) {
      const days = {};

      events.forEach(event => {
        const eventStartingDate = new Date(event.get('start'));
        const dateString = this.getDateString(eventStartingDate);
        if (!days[dateString]) {
          days[dateString] = [];
        }
        days[dateString].push(event);
      });

      return days;
    },

    getDateString(date) {
      return moment(date).format('YYYY-MM-DD');
    }
  })
);
