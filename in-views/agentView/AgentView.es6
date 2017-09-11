import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer/MaxWidthFullscreenContainer';
import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import AgentViewBreadcrumb from 'in-forge/plugins/instanaAgent/Dashboard/new/breadcrumbs/AgentViewBreadcrumb';
import BreadcrumbHeader from 'in-sdk/components/dashboard/TabView/components/BreadcrumbHeader';
import AgentNotificationsTable from 'in-views/agentView/components/AgentNotificationsTable';
import AgentsPresenceChart from 'in-views/agentView/components/AgentsPresenceChart';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import AgentsTable from 'in-views/agentView/components/AgentsTable';

import './AgentView.less';

const breadcrumbs = [<AgentViewBreadcrumb />];

const block = 'in-agent-view';

export default function AgentView({ agentSnapshots }) {
  return (
    <FullscreenOverlayView>
      <Breadcrumbs items={breadcrumbs} />
      <BreadcrumbHeader />

      <MaxWidthFullscreenContainer>
        <div className={block}>
          {DashboardNavigationRoute}

          <AgentsPresenceChart />
          <AgentsTable agentSnapshots={agentSnapshots} />
          <AgentNotificationsTable agentSnapshots={agentSnapshots} />
        </div>
      </MaxWidthFullscreenContainer>
    </FullscreenOverlayView>
  );
}
