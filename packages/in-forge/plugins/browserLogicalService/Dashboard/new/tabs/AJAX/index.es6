import { Route, Switch } from 'react-router-dom';
import React from 'react';

import AjaxOverview from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/AJAX/AjaxOverview';
import AjaxDetails from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/AJAX/AjaxDetails';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';

export default function Resources(props) {
  return (
    <MaxWidthFullscreenContainer>
      <Switch>
        <Route
          path={`*/dashboard/ajax/:ajaxCallTargetId`}
          render={routerprops => {
            return <AjaxDetails {...routerprops} {...props} />;
          }}
          {...props}
        />
        <Route
          path={`*/dashboard/ajax`}
          render={routeprops => {
            //if we want to parse in props, we need to do it this way
            return <AjaxOverview {...routeprops} {...props} />;
          }}
        />
      </Switch>
    </MaxWidthFullscreenContainer>
  );
}
