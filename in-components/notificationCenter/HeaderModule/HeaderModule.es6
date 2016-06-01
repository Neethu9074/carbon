import React from 'react';

import {isOpen$, toggleMenu} from 'in-components/notificationCenter/notificationCenterStore';
import NotificationCenterFlyout from 'in-components/notificationCenter/Flyout';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {openEventsAtServerTime$} from 'in-stores/events';
import {emptyArray} from 'in-services/fixedObjects';
import {countEvents} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import './HeaderModule.less';


const block = 'in-notificationcenter-header-module';
const rpt = React.PropTypes;

export default connectTo({
    openIssues: openEventsAtServerTime$.map(events => events.issues),
    showNotificationCenter: isOpen$
  },
  React.createClass({

    displayName: 'HeaderModule',

    mixins: [
      SubscriptionMixin
    ],

    propTypes: {
      showNotificationCenter: rpt.bool,
      openIssues: rpt.array
    },

    getInitialState() {
      return {
        windowHeight: this.getWindowHeight()
      };
    },

    handleResize() {
      this.setState({ windowHeight: this.getWindowHeight() });
    },

    getWindowHeight() {
      // the sidebar is minumum 100px height but max fullWindowHeight - 350px.
      // 350 is the upper margin + headers for the sidebar + a little margin to the bottom
      return Math.max(100, window.innerHeight - 430);
    },

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    },

    render() {
      const events = this.props.openIssues || emptyArray;
      const showNotificationCenter = this.props.showNotificationCenter;

      let maxSeverity = 0;
      let count = 0;
      events.forEach(event => {
        count++;
        const severity = event.getIn(['problem', 'severity']);
        if (severity > maxSeverity) {
          maxSeverity = severity;
        }
      });

      const background = maxSeverity > 0 ? theme.health[maxSeverity] : '#6B8088';
      const counter = countEvents(events);

      return (
        <div className={block}>

          <div className={block + '__header-wrapper'}
               onClick={toggleMenu}
               style={{background}}>
            {this.icon('incidents')}
            {counter.incident}

            {this.icon('critical')}
            {counter.danger}

            {this.icon('warning')}
            {counter.warning}

            {this.icon(showNotificationCenter ? 'open' : 'close')}
          </div>

          {showNotificationCenter ?
            <div className={block + '__notification-center'}>
              <NotificationCenterFlyout toggleNotificationCenter={toggleMenu}
                                        style={{ maxHeight: this.state.windowHeight }}
                                        open={showNotificationCenter} />
            </div>
          : null}
        </div>
      );
    },

    icon(type) {
      return (
        <Icon type={type}
              className={block + '__icon'} />
      );
    }
  })
);
