import { Switch } from 'react-router-dom';
import React from 'react';

import ErrorOverview from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Errors/ErrorOverview';
import ErrorDetails from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Errors/ErrorDetails';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';

export default function ErrorsTab(props) {
  return (
    <MaxWidthFullscreenContainer>
      <Switch>
        {/* TODO error message in window title – helmet? */}
        <RouteWithTitle
          path={`*/errors/:errorHash`}
          component={ErrorDetails}
          windowTitle={'Error Details'}
          props={props}
        />
        <RouteWithTitle path={`*/errors`} component={ErrorOverview} windowTitle={'Error Overview'} props={props} />
      </Switch>
    </MaxWidthFullscreenContainer>
  );
}
