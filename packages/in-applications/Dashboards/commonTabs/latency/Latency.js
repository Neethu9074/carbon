import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import React from 'react';

import CommonLatencySections from 'in-applications/Dashboards/commonTabs/latency/common/CommonLatencySections';

export default function LatencyTab(props) {
  return (
    <Switch>
      <Route
        path={`*/latency`}
        render={() => {
          return (
            <div>
              <CommonLatencySections {...props} />
            </div>
          );
        }}
      />
    </Switch>
  );
}
