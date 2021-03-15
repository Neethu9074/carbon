/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import AwsEcMemcachedDashboard from './AwsEcMemcachedDashboard';
import AwsEcGeneralDashboard from './AwsEcGeneralDashboard';
import AwsEcRedisDashboard from './AwsEcRedisDashboard';

export default function AwsEcDashboard({ snapshot, timeConfig }) {
  const engine = snapshot.getIn(['data', 'cache_engine'], '');
  let engineDashboard = null;
  if (engine === 'redis') {
    engineDashboard = <AwsEcRedisDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  } else if (engine === 'memcached') {
    engineDashboard = <AwsEcMemcachedDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  }

  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <AwsEcGeneralDashboard snapshot={snapshot} timeConfig={timeConfig} />
      {engineDashboard}
    </div>
  );
}
