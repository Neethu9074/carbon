import { Switch } from 'react-router-dom';
import React from 'react';

import ErrorOverview from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Errors/ErrorOverview';
import ErrorDetails from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Errors/ErrorDetails';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { Route } from 'react-router-dom';

export default function ErrorsTab(props) {
  return (
    <MaxWidthFullscreenContainer>
      <Switch>
        <Route
          path={`*/errors/:errorHash`}
          render={routeprops => {
            return <ErrorDetails {...routeprops} {...props} />;
          }}
        />
        <Route path={`*/errors`} component={ErrorOverview} props={props} />
      </Switch>
    </MaxWidthFullscreenContainer>
  );
}
