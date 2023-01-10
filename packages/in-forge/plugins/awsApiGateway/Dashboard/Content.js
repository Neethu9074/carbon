/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import AwsApiGatewayWebsocketDashboard from './AwsApiGatewayWebsocketDashboard';
import AwsApiGatewayHttpDashboard from './AwsApiGatewayHttpDashboard';
import AwsApiGatewayRestDashboard from './AwsApiGatewayRestDashboard';

export default function AwsApiGatewayDashboard({ snapshot, timeConfig }) {
  const type = snapshot.getIn(['data', 'api_protocol'], '');
  let dashboard = null;

  if (type === 'HTTP') {
    dashboard = <AwsApiGatewayHttpDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  } else if (type === 'WEBSOCKET') {
    dashboard = <AwsApiGatewayWebsocketDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  } else {
    // REST
    dashboard = <AwsApiGatewayRestDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  }

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      {dashboard}
    </div>
  );
}
