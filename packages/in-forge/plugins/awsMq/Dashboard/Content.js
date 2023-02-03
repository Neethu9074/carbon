/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import ActiveMqBrokerDashboard from './ActiveMqBroker';
import RabbitMqBrokerDashboard from './RabbitMqBroker';

export default function AwsMqDashboard({ snapshot, timeConfig }) {
  const engine = snapshot.getIn(['data', 'engine_type'], '');
  const deployment = snapshot.getIn(['data', 'deployment']);
  const engineDashboard = getEngineDashboard(engine, deployment, snapshot, timeConfig);
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      {engineDashboard}
    </div>
  );
}

function getEngineDashboard(engine, deployment, snapshot, timeConfig) {
  let engineDashboard = null;
  if (engine === 'ActiveMQ') {
    engineDashboard = (
      <div>
        <ActiveMqBrokerDashboard snapshot={snapshot} timeConfig={timeConfig} type={''} />
        {deployment === 'ACTIVE_STANDBY_MULTI_AZ' && (
          <ActiveMqBrokerDashboard snapshot={snapshot} timeConfig={timeConfig} type={'2'} />
        )}
      </div>
    );
  } else if (engine === 'RabbitMQ') {
    engineDashboard = (
      <div>
        <RabbitMqBrokerDashboard snapshot={snapshot} timeConfig={timeConfig} />
      </div>
    );
  }
  return engineDashboard;
}
