/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import AwsElbClassicDashboard from './AwsElbClassicDashboard';
import AwsElbAppDashboard from './AwsElbAppDashboard';
import AwsElbNetDashboard from './AwsElbNetDashboard';

export default function AwsElbDashboard({ snapshot, timeConfig }) {
  const type = snapshot.getIn(['data', 'type'], '');
  let dashboard = null;
  if (type === 'application') {
    dashboard = <AwsElbAppDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  } else if (type === 'network') {
    dashboard = <AwsElbNetDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  } else {
    dashboard = <AwsElbClassicDashboard snapshot={snapshot} timeConfig={timeConfig} />;
  }
  return (
    <div>
      <GetMetricStatisticsInUse snapshot={snapshot} />
      {dashboard}
    </div>
  );
}
