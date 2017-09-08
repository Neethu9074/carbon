import { fromJS } from 'immutable';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import AgentsPresenceChart from 'in-views/agentView/components/AgentsPresenceChart';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import TableHeader from 'in-views/agentView/components/TableHeader';
import { getSnapshotsInTimeframe } from 'in-stores/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  () => {
    const agentSnapshots = getSnapshotsInTimeframe('entity.selfType:agent');
    return {
      agentSnapshots,
      notifications: agentSnapshots.map(extractNotifications)
    };
  },
  function AgentBaseView({ agentSnapshots, notifications, View, CustomHeaderComponent }) {
    return (
      <FullscreenOverlayView>
        {DashboardNavigationRoute}
        <AgentsPresenceChart />
        <TableHeader
          agentSnapshots={agentSnapshots}
          notifications={notifications}
          CustomHeaderComponent={CustomHeaderComponent}
        />
        <View agentSnapshots={agentSnapshots} notifications={notifications} />
      </FullscreenOverlayView>
    );
  }
);

function extractNotifications(agentSnapshots) {
  const notifications = {};
  agentSnapshots.get('online', emptyList).forEach(snapshot => {
    snapshot.getIn(['data', 'notifications'], emptyList).forEach(notification => {
      const notificationId = notification.get('id');
      if (!notifications[notificationId]) {
        notifications[notificationId] = [];
      }
      notifications[notificationId].push(snapshot);
    });
  });
  return fromJS(notifications);
}
