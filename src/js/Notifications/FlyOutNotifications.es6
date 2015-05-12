'use strict';

import './FlyOutNotifications.less';

import Immutable from 'immutable';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import React from 'react/addons';
import {getActiveProblems} from 'instana-ui-services/notificationCenter';

import FlyOutNotification from './FlyOutNotification';


const Notifications = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  getInitialState() {
    return {
      hiddenNotifications: Immutable.Set(),
      notifications: Immutable.List()
    };
  },

  componentDidMount() {
    this.addSubscription(
      getActiveProblems().subscribe(notifications => {
        this.setState({
          notifications: notifications.reverse()
        });
      })
    );
  },

  render() {
    /*eslint-disable no-unused-vars*/
    const CSSTransitionGroup = React.addons.CSSTransitionGroup;
    /*eslint-enable no-unused-vars*/

    return (
      <div className="in-fly-out-notifications">
        <CSSTransitionGroup transitionName="in-fly-out-notification-"
                            component="div">
          {this.state.notifications
           .filter(n => !this.state.hiddenNotifications.contains(n.get('id')))
           .map(notification =>
            <FlyOutNotification key={notification.get('id')}
                                notification={notification}
                                onClick={this.onClick.bind(null, notification)}
                                />
          ).toJS()}
        </CSSTransitionGroup>
      </div>
    );
  },

  onClick(n) {
    this.setState({
      hiddenNotifications: this.state.hiddenNotifications.add(n.get('id'))
    });
  }
});

export default Notifications;
