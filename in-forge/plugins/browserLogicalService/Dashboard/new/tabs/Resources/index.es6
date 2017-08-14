import { Switch } from 'react-router-dom';
import React from 'react';

import ResourceHostsList from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Resources/ResourceHostsList';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';

export default function Resources(props) {
  return (
    <MaxWidthFullscreenContainer>
      <Switch>
        {/* TODO error message in window title – helmet? */}
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
