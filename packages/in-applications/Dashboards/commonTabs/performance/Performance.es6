import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import React from 'react';

import DatabaseStatementDetail from 'in-applications/Dashboards/commonComponents/database/DatabaseStatementDetail';
import DatabaseSections from 'in-applications/Dashboards/commonComponents/database/DatabaseSections';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import CommonPerformanceSections from './common/CommonPerformanceSections';

export default function PerformanceTab(props) {
  return (
    <MaxWidthFullscreenContainer>
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
                <CommonPerformanceSections {...props} />
                <DatabaseSections {...props} />
              </div>
            );
          }}
        />
      </Switch>
    </MaxWidthFullscreenContainer>
  );
}
