'use strict';

import './FlyOutNotifications.less';

import Immutable from 'immutable';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import React from 'react/addons';
import {getStatusMessages} from 'in-services/notificationCenter';
import {extractId} from 'in-services/util/snapshots';
import eventBus from 'in-services/eventbus';

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
      getStatusMessages().subscribe(notifications => {
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

  onClick(notification) {
    eventBus.emit('focus', {
      snapshot: extractId(notification),
      zoom: true
    });
  }
});

export default Notifications;
