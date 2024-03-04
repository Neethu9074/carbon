/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

//@ts-expect-error
import AgentCatalog from 'in-plg/pages/onboarding/AgentCatalog';
import AgentViewRouter from 'in-plg/pages/onboarding/AgentViewRouter';

const Portal = () => {
  return (
    <>
      <Switch>
        <Route
          exact
          path="/onboarding/agents/installation/:selectedservice"
          render={({ match }) => <AgentViewRouter selectedService={match.params.selectedservice} fromOnboarding />}
        />

        <Route path="/onboarding/agents/installation" render={() => <AgentCatalog fromOnboarding />} />

        <Route path="/" render={() => <AgentCatalog fromOnboarding />} />
      </Switch>
    </>
  );
};

export default Portal;
