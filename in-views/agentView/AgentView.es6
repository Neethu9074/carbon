import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer/MaxWidthFullscreenContainer';
import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import AgentNotificationsTable from 'in-views/agentView/components/AgentNotificationsTable';
import AgentsPresenceChart from 'in-views/agentView/components/AgentsPresenceChart';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import AgentViewKpis from 'in-views/agentView/components/AgentViewKpis';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { agentNotificationsEnabled } from 'in-services/featureFlags';
import AgentsTable from 'in-views/agentView/components/AgentsTable';

import './AgentView.less';

const block = 'in-agent-view';

export default function AgentView() {
  return (
    <FullscreenOverlayView>
      <MaxWidthFullscreenContainer>
        <div className={block}>
          {DashboardNavigationRoute}

          <SnapshotLabel actions={[]}>
            Agents and Notifications
          </SnapshotLabel>

          <AgentViewKpis />
          <AgentsPresenceChart />
          <AgentsTable />
          {agentNotificationsEnabled ? <AgentNotificationsTable /> : null}
        </div>
      </MaxWidthFullscreenContainer>
    </FullscreenOverlayView>
  );
}
