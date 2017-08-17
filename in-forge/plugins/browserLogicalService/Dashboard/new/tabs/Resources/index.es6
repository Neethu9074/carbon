import { Switch } from 'react-router-dom';
import React from 'react';

import ResourceHostsList from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Resources/ResourceHostsList';
import ResourceDetails from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Resources/ResourceDetails';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';

export default function Resources(props) {
  // TODO resource host in window title – helmet?
  return (
    <MaxWidthFullscreenContainer>
      <Switch>
        <RouteWithTitle
          path={`*/dashboard/resources/:resourceHostId`}
          component={ResourceDetails}
          windowTitle={'Resource Details'}
          props={props}
        />
        <RouteWithTitle
          path={`*/dashboard/resources`}
          component={ResourceHostsList}
          windowTitle={'Resource Overview'}
          props={props}
        />
      </Switch>
    </MaxWidthFullscreenContainer>
  );
}
