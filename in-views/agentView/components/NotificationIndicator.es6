import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { emptyList } from 'in-services/fixedImmutables';
import Tooltip from 'in-components/Tooltip';

import './NotificationIndicator.less';

const block = 'in-agent-view-table-notification-indicator';

export default function NotificationIndicator({ row }) {
  const notifications = row.snapshot.getIn(['data', 'notifications'], emptyList);
  return (
    <Tooltip content={getTooltipText(notifications)} align={'rightMiddle'}>
      <div
        className={evaluateClassNames({
          [`${block}`]: true,
          [`${block}__active-notifications`]: notifications.size > 0
        })}
      >
        {notifications.size}
      </div>
    </Tooltip>
  );
}

function getTooltipText(notifications) {
  return notifications.size === 0 ? 'There are no notifications for this agent. Great job!' : 'Notifications ahead';
}
