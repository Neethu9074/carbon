import { Switch, Route } from 'react-router-dom';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer/MaxWidthFullscreenContainer';
import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import AgentInstallationView from 'in-views/agentView/components/AgentInstallationView';
import AgentsPresenceChart from 'in-views/agentView/components/AgentsPresenceChart';
import AgentViewKpis from 'in-views/agentView/components/AgentViewKpis';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AgentsTable from 'in-views/agentView/components/AgentsTable';
import DashboardHeader from 'in-new-components/DashboardHeader';
import SearchBar from 'in-components/SearchBar';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function AgentView() {
  return (
    <>
      <Switch>
        {DashboardNavigationRoute}

        <Route
          path="/agents/installation"
          render={() => (
            <MaxWidthFullscreenContainer>
              <AgentInstallationView />
            </MaxWidthFullscreenContainer>
          )}
        />

        <Route
          path="/agents"
          render={() => (
            <Sticky
              header={
                <>
                  <DashboardHeader
                    title="Agents"
                    contextConfigurations={[{ renderContext: () => 'Agents', contextIcon: 'lib_actions_settings' }]}
                  />
                  <DashboardHeaderModule withBottomBorder>
                    <SearchBar theme="light" />
                  </DashboardHeaderModule>
                </>
              }
            >
              <LeftRightPadding>
                <AgentViewKpis />
                <AgentsPresenceChart />
                <AgentsTable />
              </LeftRightPadding>
            </Sticky>
          )}
        />
      </Switch>

      <Footer />
    </>
  );
}
