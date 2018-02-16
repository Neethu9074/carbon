import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getEndpointTypes from 'in-subscription/application/getEndpointTypes';
import CommonPerformanceSections from './common/CommonPerformanceSections';
import MessagingSections from './messaging/MessagingSections';
import DatabaseSections from './database/DatabaseSections';
import LoggingSections from './logging/LoggingSections';
import HttpSections from './http/HttpSections';

export default class extends React.Component {
  static displayName = 'PerformanceTab';

  constructor(props) {
    super(props);
    this.state = { types: [] };
    this.subscribeToTypes(props);
  }

  subscribeToTypes({ applicationId, serviceId, timeframe }) {
    getEndpointTypes({
      filter: {
        application: applicationId,
        service: serviceId,
        timeframe
      }
    })
      .skipFirst()
      .subscribe(
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

  hasHttpEndpoints() {
    return this.hasType('HTTP');
  }

  hasDatabaseEndpoints() {
    return this.hasType('DATABASE');
  }

  hasMessagingEndpoints() {
    return this.hasType('MESSAGING');
  }

  hasType(type) {
    return this.state.types.includes(type);
  }

  render() {
    return (
      <MaxWidthFullscreenContainer>
        <CommonPerformanceSections
          applicationId={this.props.applicationId}
          serviceId={this.props.serviceId}
          timeframe={this.props.timeframe}
        />
        {this.hasHttpEndpoints() && (
          <HttpSections
            applicationId={this.props.applicationId}
            serviceId={this.props.serviceId}
            timeframe={this.props.timeframe}
          />
        )}
        {this.hasDatabaseEndpoints() && (
          <DatabaseSections
            applicationId={this.props.applicationId}
            serviceId={this.props.serviceId}
            timeframe={this.props.timeframe}
          />
        )}
        {this.hasMessagingEndpoints() && (
          <MessagingSections
            applicationId={this.props.applicationId}
            serviceId={this.props.serviceId}
            timeframe={this.props.timeframe}
          />
        )}
        <LoggingSections
          applicationId={this.props.applicationId}
          serviceId={this.props.serviceId}
          timeframe={this.props.timeframe}
        />
      </MaxWidthFullscreenContainer>
    );
  }
}
