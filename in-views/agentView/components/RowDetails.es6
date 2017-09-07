import React from 'react';

import { getAgentNotificationsForHost } from 'in-stores/agentNotification';
import connectTo from 'in-hoc/connectTo';

import './RowDetails.less';

const block = 'in-agent-view-table-row-details';

export default function RowDetails({ row }) {
  const notifications = row.snapshot.getIn(['data', 'notifications']);
  if (!notifications) {
    return (
      <div className={block}>
        There are no notifications for this agent. Great job!
        <AgentNotifications snapshot={row.snapshot} />
      </div>
    );
  }
}

const AgentNotifications = connectTo(
  props => {
    return {
      notifications: getAgentNotificationsForHost(props.snapshot)
    };
  },
  function({ notifications }) {
    if (!notifications) {
      return null;
    }

    return (
      <ul>
        {notifications.map(notification => <Notification key={notification.get('id')} notification={notification} />)}
      </ul>
    );
  }
);

function Notification({ notification }) {
  if (!notification) {
    return null;
  }

  return (
    <li>
      notification
    </li>
  );
}
