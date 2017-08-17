import { Switch } from 'react-router-dom';
import React from 'react';

import AjaxOverview from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/AJAX/AjaxOverview';
import AjaxDetails from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/AJAX/AjaxDetails';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import RouteWithTitle from 'in-components/Navigation/RouteWithTitle';

export default function Resources(props) {
  // TODO ajax call target in window title – helmet?
  return (
    <MaxWidthFullscreenContainer>
      <Switch>
        <RouteWithTitle
          path={`*/dashboard/ajax/:ajaxCallTargetId`}
          component={AjaxDetails}
          windowTitle={'Call Target Details'}
          props={props}
        />
        <RouteWithTitle
          path={`*/dashboard/ajax`}
          component={AjaxOverview}
          windowTitle={'AJAX Overview'}
          props={props}
        />
      </Switch>
    </MaxWidthFullscreenContainer>
  );
}
