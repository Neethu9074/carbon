import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getEndpointTypes from 'in-subscription/application/getEndpointTypes';
import CommonPerformanceSections from './common/CommonPerformanceSections';
import DatabaseStatementDetail from './database/DatabaseStatementDetail';
import DatabaseSections from './database/DatabaseSections';
import LoggingSections from './logging/LoggingSections';
import HttpSections from './http/HttpSections';

export default class extends React.Component {
  static displayName = 'PerformanceTab';

  state = { types: [] };
  typeSubscription;

  componentDidMount() {
    this.typeSubscription = this.subscribeToTypes(this.props);
  }

  componentWillUnmount() {
    if (this.typeSubscription) {
      this.typeSubscription.dispose();
      this.typeSubscription = null;
    }
  }

  subscribeToTypes({ applicationId, serviceId, timeframe }) {
    return getEndpointTypes({
      filter: {
        application: applicationId,
        service: serviceId,
        timeframe
      }
    }).subscribe(
      result => {
        if (result.data) {
          this.setState({ types: result.data });
        } else {
          this.reset();
        }
      },
      () => this.reset()
    );
  }

  reset() {
    this.setState({ types: [] });
  }

  render() {
    const props = this.props;
    const types = this.state.types;
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
            render={routeProps => {
              return (
                <div>
                  <CommonPerformanceSections {...props} />
                  {hasHttpEndpoints(types) && <HttpSections {...props} />}
                  {hasDatabaseEndpoints(types) && <DatabaseSections {...props} {...routeProps} />}
                  <LoggingSections {...props} />
                </div>
              );
            }}
          />
        </Switch>
      </MaxWidthFullscreenContainer>
    );
  }
}

function hasHttpEndpoints(types) {
  return hasType('HTTP', types);
}

function hasDatabaseEndpoints(types) {
  return hasType('DATABASE', types);
}

function hasType(type, types) {
  return types.indexOf(type) >= 0;
}
