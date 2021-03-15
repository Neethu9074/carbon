/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import AwsMqBrokerDashboard from './MqBroker';

export default function AwsMqDashboard({ snapshot, timeConfig }) {
  const deployment = snapshot.getIn(['data', 'deployment']);
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <AwsMqBrokerDashboard snapshot={snapshot} timeConfig={timeConfig} type={''} />
      {deployment === 'ACTIVE_STANDBY_MULTI_AZ' && (
        <AwsMqBrokerDashboard snapshot={snapshot} timeConfig={timeConfig} type={'2'} />
      )}
    </div>
  );
}
