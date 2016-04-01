import irpt from 'react-immutable-proptypes';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {emptyList} from 'in-services/fixedImmutables';
import {openEvents$} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import NotificationCenterFlyout from '../NotificationCenterFlyout';

import './NotificationCounter.less';


const block = 'in-notification-counter';

export default connectTo({
    openEvents: openEvents$
  },
  React.createClass({

    displayName: 'NotificationCounter',

    mixins: [
      SubscriptionMixin
    ],

    propTypes: {
      className: React.PropTypes.string,
      openEvents: irpt.list
    },

    getInitialState() {
      return {
        showNotificationCenter: true,
        windowHeight: this.getWindowHeight()
      };
    },

    handleResize() {
      this.setState({ windowHeight: this.getWindowHeight() });
    },

    getWindowHeight() {
      // the sidebar is minumum 100px height but max fullWindowHeight - 350px.
      // 350 is the upper margin + headers for the sidebar + a little margin to the bottom
      return Math.max(100, window.innerHeight - 350);
    },

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    },

    render() {
      const events = this.props.openEvents || emptyList;
      const showNC = this.state.showNotificationCenter;

      let maxSeverity = 0;
      events.forEach(event => {
        const severity = event.getIn(['problem', 'severity']);
        if (severity > maxSeverity) {
          maxSeverity = severity;
        }
      });

      const color = theme.health[maxSeverity];

      return (
        <div className={this.props.className}>
          <div className={block}
               style={{background: color}}
               onClick={this.toggleNotificationCenter}>
            {events.size}
          </div>

          {showNC ?
            <div className={block + '__notification-center'}>
              <NotificationCenterFlyout toggleNotificationCenter={this.toggleNotificationCenter}
                                        style={{ maxHeight: this.state.windowHeight }}
                                        open={showNC}/>
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
