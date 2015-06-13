'use strict';

import React from 'react';
import FlyOutNotifications from './FlyOutNotifications';
import NotificationCenter from './NotificationCenter';

const Notifications = React.createClass({

  render() {
    return (
      <div>
        <FlyOutNotifications />
        <NotificationCenter />
      </div>
    );
  }

});

export default Notifications;
