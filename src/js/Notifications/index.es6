'use strict';

import './index.less';

import Immutable from 'immutable';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import React from 'react/addons';
import {create} from 'instana-ui-services/conveyer';
import NotificationConveyer from 'instana-ui-services/conveyer/NotificationConveyer';

import FlyOutNotification from './FlyOutNotification';


const Notifications = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  getInitialState() {
    return {
      notifications: Immutable.List()
    };
  },

  componentDidMount() {
    this.addSubscription(
      create(NotificationConveyer).subscribe(notification =>
        this.setState({
          notifications: this.state.notifications.unshift(notification)
        })
      )
    );
  },

  render() {
    /*eslint-disable no-unused-vars*/
    const CSSTransitionGroup = React.addons.CSSTransitionGroup;
    /*eslint-enable no-unused-vars*/

    return (
      <div className="in-notifications">
        <CSSTransitionGroup transitionName="in-fly-out-notification-"
                                         component="div">
          {this.state.notifications.map(notification =>
            <FlyOutNotification key={notification.get('id')}
                                notification={notification}
                                onClick={this.onClick.bind(null, notification)}
                                />
          ).toJS()}
        </CSSTransitionGroup>
      </div>
    );
  },

  onClick(notification) {
    const filteredNotifications = this.state.notifications.filter(n =>
      n.get('id') !== notification.get('id')
    );
    this.setState({
      notifications: filteredNotifications
    });
  }
});

export default Notifications;
