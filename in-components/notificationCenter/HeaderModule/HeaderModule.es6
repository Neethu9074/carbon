import React from 'react';

import NotificationCenterFlyout from 'in-components/notificationCenter/Flyout';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {openEventsAtServerTime$} from 'in-stores/events';
import {emptyArray} from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './HeaderModule.less';


const block = 'in-notificationcenter-header-module';

export default connectTo({
    openIssues: openEventsAtServerTime$.map(events => events.issues)
  },
  React.createClass({

    displayName: 'HeaderModule',

    mixins: [
      SubscriptionMixin
    ],

    propTypes: {
      openIssues: React.PropTypes.array
    },

    getInitialState() {
      return {
        showNotificationCenter: false,
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
      const showNotificationCenter = this.state.showNotificationCenter;

      let maxSeverity = 0;
      let count = 0;
      events.forEach(event => {
        count++;
        const severity = event.getIn(['problem', 'severity']);
        if (severity > maxSeverity) {
          maxSeverity = severity;
        }
      });

      const color = maxSeverity > 0 ? theme.health[maxSeverity] : '#172429';

      return (
        <div className={block}
             style={{background: color}}>

          <div className={block + '__label'}>
            <span className={block + '__label__title'}>
              Event Center
            </span>
            <br />
            <span>
              {count + ' Events'}
            </span>
          </div>

          <div className={block + '__counter'}
               onClick={this.toggleNotificationCenter}>
            {count}
          </div>

          {showNotificationCenter ?
            <div className={block + '__notification-center'}>
              <NotificationCenterFlyout toggleNotificationCenter={this.toggleNotificationCenter}
                                        style={{ maxHeight: this.state.windowHeight }}
                                        open={showNotificationCenter}/>
            </div>
          : null}
        </div>
      );
    },

    toggleNotificationCenter() {
      this.setState({
        showNotificationCenter: !this.state.showNotificationCenter
      });
    }
  })
);
