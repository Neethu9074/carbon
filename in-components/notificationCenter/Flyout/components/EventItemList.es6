import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {event$, selectedNotificationFilter} from 'in-components/notificationCenter/Flyout/stores/flyoutStore';
import EventDescription from 'in-components/EventDescription';
import {formatDate} from 'in-services/formatters/date';
import {selectedEventId$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventItemList.less';


const block = 'in-notificationcenter-eventitemlist';
const rpt = React.PropTypes;

export default connectTo({
    selectedEventId: selectedEventId$,
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
      selectedEventId: rpt.string,
      allEvents: rpt.array,
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
                                                       className={this.getEventClass(event.get('id'))}/>)}
              </li>
            );
          })}
       </ul>
      );
    },

    getEventClass(id) {
      const baseClass = block + '__item';
      return id === this.props.selectedEventId ? baseClass + '__selected' : baseClass;
    },

    getDayStringForDate(dateString) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (dateString === formatDate(today)) {
        return 'Today';
      } else if (dateString === formatDate(yesterday)) {
        return 'Yesterday';
      }
      return dateString;
    },

    getEventsPerDay(events) {
      const days = {};

      events.forEach(event => {
        const dateString = formatDate(event.get('start'));
        if (!days[dateString]) {
          days[dateString] = [];
        }
        days[dateString].push(event);
      });

      return days;
    }
  })
);
