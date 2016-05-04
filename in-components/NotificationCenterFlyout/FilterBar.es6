import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {emptyArray} from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

import {
  FILTER_TYPES,
  event$,
  selectedEventList$,
  EVENT_LISTS
} from './notificationCenterFlyoutStores';
import Filter from './Filter';

import './FilterBar.less';


const block = 'in-notificationcenter-filterbar';

export default connectTo({
    allEvents: event$,
    selectedEventList: selectedEventList$
  },
  React.createClass({

    displayName: 'NotificationFilterBar',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      allEvents: irpt.list,
      selectedEventList: React.PropTypes.string.isRequired
    },

    render() {
      const counter = this.getEventsCounter();

      return (
        <div className={block}>
          <Filter label={'All'}
                  filter = {FILTER_TYPES.ALL}/>

          <Filter label={'' + counter.incident}
                  filter={FILTER_TYPES.INCIDENT}/>

          <Filter label={'' + counter.danger}
                  filter={FILTER_TYPES.CRITICAL}/>

          <Filter label={'' + counter.warning}
                  filter={FILTER_TYPES.WARNING}/>

          {this.props.selectedEventList === EVENT_LISTS.HISTORICAL ?
            <Filter label={'' + counter.change}
                    filter={FILTER_TYPES.CHANGE}/>
          : null}
        </div>
      );
    },

    getEventsCounter() {
      const counter = {
        warning: 0,
        danger: 0,
        change: 0,
        incident: 0
      };

      const allEvents = this.props.allEvents || emptyArray;
      allEvents.forEach(event => {
        switch (getEventType(event)) {
          case EVENT_TYPES.ISSUE_WARNING:
            counter.warning++;
            break;
          case EVENT_TYPES.ISSUE_CRITICAL:
            counter.danger++;
            break;
          case EVENT_TYPES.CHANGE:
            counter.change++;
            break;
          case EVENT_TYPES.INCIDENT:
            counter.incident++;
            break;
          default:
        }
      });

      return counter;
    }
  })
);
