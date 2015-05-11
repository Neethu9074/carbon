'use strict';

import './index.less';

import Immutable from 'immutable';
import React from 'react/addons';

import FlyOutNotification from './FlyOutNotification';


const Notifications = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState() {
    return {
      notifications: Immutable.fromJS([
        {
          id: '1',
          title: 'Running out of Disk Space',
          msg: 'Host ip-10-69-178-6 is running out of disk space in two hours.',
          severity: 'danger',
          snapshotId: {
            hostId: 'h1',
            pluginId: 'p1',
            steadyId: 's1'
          }
        },
        {
          id: '2',
          title: 'High Load',
          msg: 'Host ip-192-168-0-1 is continuously under very high load.',
          severity: 'warning',
          snapshotId: {
            hostId: 'h2',
            pluginId: 'p2',
            steadyId: 's2'
          }
        },
        {
          id: '3',
          title: 'High Load',
          msg: 'Host ip-192-168-0-1 is continuously under very high load.',
          severity: 'warning',
          snapshotId: {
            hostId: 'h2',
            pluginId: 'p2',
            steadyId: 's2'
          }
        },
        {
          id: '4',
          title: 'High Load',
          msg: 'Host ip-192-168-0-1 is continuously under very high load.',
          severity: 'warning',
          snapshotId: {
            hostId: 'h2',
            pluginId: 'p2',
            steadyId: 's2'
          }
        },
        {
          id: '5',
          title: 'High Load',
          msg: 'Host ip-192-168-0-1 is continuously under very high load.',
          severity: 'ok',
          snapshotId: {
            hostId: 'h2',
            pluginId: 'p2',
            steadyId: 's2'
          }
        },
        {
          id: '6',
          title: 'High Load',
          msg: 'Host ip-192-168-0-1 is continuously under very high load.',
          severity: 'warning',
          snapshotId: {
            hostId: 'h2',
            pluginId: 'p2',
            steadyId: 's2'
          }
        }
      ])
    };
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
