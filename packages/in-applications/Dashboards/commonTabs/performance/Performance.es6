import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import React from 'react';

import DatabaseSections from 'in-applications/Dashboards/commonTabs/performance/database/DatabaseSections';
import HttpSections from 'in-applications/Dashboards/commonTabs/performance/http/HttpSections';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getEndpointTypes from 'in-subscription/application/getEndpointTypes';
import CommonPerformanceSections from './common/CommonPerformanceSections';
import DatabaseStatementDetail from './database/DatabaseStatementDetail';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    types: getEndpointTypes({
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      }
    }).map(result => result.data || null)
  }),
  function PerformanceTab(props) {
    const types = props.types || [];

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
                  {hasHttpEndpoints(types) && <HttpSections {...props} />}
                  {hasDatabaseEndpoints(types) && <DatabaseSections {...props} />}
                </div>
              );
            }}
          />
        </Switch>
      </MaxWidthFullscreenContainer>
    );
  }
);

function hasHttpEndpoints(types) {
  return hasType('HTTP', types);
}

function hasDatabaseEndpoints(types) {
  return hasType('DATABASE', types);
}

function hasType(type, types) {
  return types.indexOf(type) >= 0;
}
