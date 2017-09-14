import { Switch } from 'react-router-dom';
import React from 'react';

import DeploymentDetails from 'in-forge/plugins/kubernetesCluster/Dashboard/new/tabs/deployments/DeploymentDetails';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DeploymentList from 'in-forge/plugins/kubernetesCluster/Dashboard/new/tabs/deployments/DeploymentList';

import { Route } from 'react-router-dom';

export default function DeploymentRoutes(props) {
  return (
    <MaxWidthFullscreenContainer>
      <Switch>
        <Route
          path={`*/dashboard/deployments/:deploymentId`}
          render={routeprops => {
            return <DeploymentDetails {...routeprops} {...props} />;
          }}
          props={props}
        />
        <Route
          path={`*/dashboard/deployments`}
          render={routeprops => {
            return <DeploymentList {...routeprops} {...props} />;
          }}
          props={props}
        />
      </Switch>
    </MaxWidthFullscreenContainer>
  );
}
