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
  }

  componentDidMount() {
    this.subscribeToTypes(this.props);
  }

  subscribeToTypes({ applicationId, serviceId, timeframe }) {
    getEndpointTypes({
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
    const { applicationId, serviceId, timeframe, data } = this.props;
    return (
      <MaxWidthFullscreenContainer>
        <CommonPerformanceSections applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        {this.hasHttpEndpoints() && (
          <HttpSections applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        )}
        {this.hasDatabaseEndpoints() && (
          <DatabaseSections applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        )}
        {this.hasMessagingEndpoints() && (
          <MessagingSections applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
        )}
        <LoggingSections applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} data={data} />
      </MaxWidthFullscreenContainer>
    );
  }
}
