import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer/MaxWidthFullscreenContainer';
import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import AgentsPresenceChart from 'in-views/agentView/components/AgentsPresenceChart';
import SnapshotLabel from 'in-sdk/components/dashboard/summary/SnapshotLabel';
import AgentViewKpis from 'in-views/agentView/components/AgentViewKpis';
import AgentsTable from 'in-views/agentView/components/AgentsTable';
import SearchBar from 'in-components/SearchBar';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

import './AgentView.less';

const block = 'in-agent-view';

export default function AgentView() {
  return (
    <Fragment>
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
                </div>
              </MaxWidthFullscreenContainer>
            </Sticky>
          )}
        />
      </Switch>

      <Footer />
    </Fragment>
  );
}
