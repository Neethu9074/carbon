/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

//@ts-expect-error
import AgentCatalog from 'in-plg/pages/onboarding/AgentCatalog';
import AgentViewRouterV2 from 'in-plg/pages/onboarding/AgentViewRouterV2';
import AgentViewRouter from 'in-plg/pages/onboarding/AgentViewRouter';
import AgentCatalogV2 from 'in-plg/pages/onboarding/AgentCatalogV2';
import { newOTelPageEnabled } from 'in-services/featureFlags';

interface PortalProps {
  agentKey: string;
  downloadKey: string;
}

const Portal = (props: PortalProps) => {
  return (
    <>
      {newOTelPageEnabled ? (
        <Switch>
          <Route
            exact
            path="/datasources/onboarding/installation/:selectedservice"
            render={({ match }) => (
              <AgentViewRouterV2
                selectedService={match.params.selectedservice}
                fromOnboarding
                agentKey={props.agentKey}
                downloadKey={props.downloadKey}
              />
            )}
          />

          <Route path="/datasources/onboarding/installation" render={() => <AgentCatalogV2 fromOnboarding />} />

          <Route path="/" render={() => <AgentCatalogV2 fromOnboarding />} />
        </Switch>
      ) : (
        <Switch>
          <Route
            exact
            path="/agents/onboarding/installation/:selectedservice"
            render={({ match }) => (
              <AgentViewRouter
                selectedService={match.params.selectedservice}
                fromOnboarding
                agentKey={props.agentKey}
                downloadKey={props.downloadKey}
              />
            )}
          />

          <Route path="/agents/onboarding/installation" render={() => <AgentCatalog fromOnboarding />} />

          <Route path="/" render={() => <AgentCatalog fromOnboarding />} />
        </Switch>
      )}
    </>
  );
};

export default Portal;
