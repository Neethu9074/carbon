import { Switch, Route } from 'react-router-dom';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer/MaxWidthFullscreenContainer';
import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import AgentNotificationsTable from 'in-views/agentView/components/AgentNotificationsTable';
import AgentsPresenceChart from 'in-views/agentView/components/AgentsPresenceChart';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import AgentViewKpis from 'in-views/agentView/components/AgentViewKpis';
import { agentNotificationsEnabled } from 'in-services/featureFlags';
import AgentsTable from 'in-views/agentView/components/AgentsTable';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';

import './AgentView.less';

const block = 'in-agent-view';

export default function AgentView() {
  return (
    <Switch>
      {DashboardNavigationRoute}

      <Route
        path="/agents"
        render={() => (
          <Sticky header={<SearchBar />}>
            <MaxWidthFullscreenContainer>
              <div className={block}>
                <SnapshotLabel actions={[]}>Agents</SnapshotLabel>

                <AgentViewKpis />
                <AgentsPresenceChart />
                <AgentsTable />
                {agentNotificationsEnabled ? <AgentNotificationsTable /> : null}
              </div>
            </MaxWidthFullscreenContainer>
          </Sticky>
        )}
      />
    </Switch>
  );
}
