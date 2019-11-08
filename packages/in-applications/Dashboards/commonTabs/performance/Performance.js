import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import React from 'react';

import DatabaseStatementDetail from 'in-applications/Dashboards/commonComponents/database/DatabaseStatementDetail';
import InboundOrAllCallsChoice from 'in-applications/Dashboards/commonComponents/InboundOrAllCallsChoice';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import HttpSections from 'in-applications/Dashboards/commonComponents/http/HttpSections';
import CommonPerformanceSections from './common/CommonPerformanceSections';

export default function PerformanceTab({ boundaryScope, onBoundaryStateChange, ...props }) {
  return (
    <Switch>
      <Route
        path={`*/performance/database/statements/:statementId`}
        render={routeProps => {
          return <DatabaseStatementDetail {...props} {...routeProps} />;
        }}
      />
      <Route
        path={`*/performance`}
        render={() => {
          return (
            <div>
              {boundaryScope &&
                onBoundaryStateChange && (
                  <InboundOrAllCallsChoice
                    boundaryScope={boundaryScope}
                    onBoundaryStateChange={onBoundaryStateChange}
                  />
                )}
              <CommonPerformanceSections boundaryScope={boundaryScope} {...props} />
              <DatabaseSections boundaryScope={boundaryScope} {...props} />
              <HttpSections boundaryScope={boundaryScope} {...props} />
            </div>
          );
        }}
      />
    </Switch>
  );
}
