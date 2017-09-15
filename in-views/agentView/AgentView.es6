import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer/MaxWidthFullscreenContainer';
import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import AgentNotificationsTable from 'in-views/agentView/components/AgentNotificationsTable';
import AgentsPresenceChart from 'in-views/agentView/components/AgentsPresenceChart';
import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import AgentsTable from 'in-views/agentView/components/AgentsTable';

import './AgentView.less';

const block = 'in-agent-view';

export default function AgentView({ agentSnapshots }) {
  return (
    <FullscreenOverlayView>
      <MaxWidthFullscreenContainer>
        <div className={block}>
          {DashboardNavigationRoute}

          <FullscreenViewHeading iconType="agent">Agents and Notifications</FullscreenViewHeading>
          <AgentsPresenceChart />
          <AgentsTable agentSnapshots={agentSnapshots} />
          <AgentNotificationsTable agentSnapshots={agentSnapshots} />
        </div>
      </MaxWidthFullscreenContainer>
    </FullscreenOverlayView>
  );
}
