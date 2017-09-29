import { Switch } from 'react-router-dom';
import React from 'react';

import ResourceHostsList from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Resources/ResourceHostsList';
import ResourceDetails from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Resources/ResourceDetails';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { Route } from 'react-router-dom';

export default function Resources(props) {
  return (
    <MaxWidthFullscreenContainer>
      <Switch>
        <Route
          path={`*/dashboard/resources/:resourceHostId`}
          render={routeprops => {
            return <ResourceDetails {...routeprops} {...props} />;
          }}
          props={props}
        />
        <Route
          path={`*/dashboard/resources`}
          render={routeprops => {
            return <ResourceHostsList {...routeprops} {...props} />;
          }}
          props={props}
        />
      </Switch>
    </MaxWidthFullscreenContainer>
  );
}
