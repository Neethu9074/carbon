import React from 'react';

import {toggleControl} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {CONTROL_TYPES} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {openEventsAtServerTime$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import './HeaderModule.less';


const block = 'in-notificationcenter-header-module';
const rpt = React.PropTypes;

export default connectTo({
    openEventsAtServerTime: openEventsAtServerTime$
  },
  React.createClass({

    displayName: 'HeaderModule',

    mixins: [
      SubscriptionMixin
    ],

    propTypes: {
      openEventsAtServerTime: rpt.object
    },

    getWindowHeight() {
      // the sidebar is minumum 100px height but max fullWindowHeight - 350px.
      // 350 is the upper margin + headers for the sidebar + a little margin to the bottom
      return Math.max(100, window.innerHeight - 430);
    },

    render() {
      const events = this.props.openEventsAtServerTime;

      let maxSeverity = 0;
      maxSeverity = this.getSeverity(maxSeverity, events.incidents);
      // maxSeverity = this.getSeverity(maxSeverity, events.issues);

      const background = maxSeverity > 0 ? theme.health[maxSeverity] : '#6B8088';

      return (
        <div className={block}
             onClick={() => toggleControl(CONTROL_TYPES.NOTIFICATIONS)}
             style={{background}}>
          {this.icon('incidents')}
          {events.incidents.length}

          {this.icon('critical')}
          {events.issues.filter(issue => getEventType(issue) === EVENT_TYPES.ISSUE_CRITICAL).length}

          {this.icon('warning')}
          {events.issues.filter(issue => getEventType(issue) === EVENT_TYPES.ISSUE_WARNING).length}
        </div>
      );
    },

    getSeverity(maxSeverity, events) {
      events.forEach(event => {
        const severity = event.getIn(['problem', 'severity']);
        if (severity > maxSeverity) {
          maxSeverity = severity;
        }
      });
      return maxSeverity;
    },

    icon(type) {
      return (
        <Icon type={type}
              className={block + '__icon'} />
      );
    }
  })
);
