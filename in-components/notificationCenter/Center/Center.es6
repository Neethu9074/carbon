import React from 'react';

import {isOpen$} from 'in-components/notificationCenter/Center/stores/notificationCenterVisibilityStore';
import EventList from 'in-components/notificationCenter/Center/components/EventList';
import connectTo from 'in-hoc/connectTo';

import 'in-components/notificationCenter/Center/Center.less';


const block = 'in-notification-center';

export default connectTo({
    isOpen: isOpen$
  },
  function Center({isOpen}) {
    if (!isOpen) {
      return null;
    }

    return (
      <div className={block}>
        <EventList />
      </div>
    );
  }
);
