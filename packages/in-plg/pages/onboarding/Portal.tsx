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
          path="/agents/installation/:selectedservice"
          render={({ match }) => <AgentViewRouter selectedService={match.params.selectedservice} />}
        />

        <Route path="/" component={AgentCatalog} />
      </Switch>
    </>
  );
};

export default Portal;
