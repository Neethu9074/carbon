import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import React from 'react';

import InboundOrAllCallsChoiceHorizontal from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceHorizontal';
import DatabaseStatementDetail from 'in-applications/Dashboards/commonComponents/database/DatabaseStatementDetail';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import CommonPerformanceSections from './common/CommonPerformanceSections';

export default function PerformanceTab({ onBoundaryStateChange, urlBoundaryScope, data: application, ...props }) {
  const boundaryScope = urlBoundaryScope || application.boundaryScope;

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
              {onBoundaryStateChange && (
                <InboundOrAllCallsChoiceHorizontal
                  boundaryScope={boundaryScope}
                  onBoundaryStateChange={onBoundaryStateChange}
                  defaultBoundaryScope={application.boundaryScope}
                />
              )}
              <CommonPerformanceSections boundaryScope={boundaryScope} {...props} />
              <DatabaseSections boundaryScope={boundaryScope} {...props} />
            </div>
          );
        }}
      />
    </Switch>
  );
}
