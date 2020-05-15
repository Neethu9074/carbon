import React from 'react';
import { getRuntimeByKey } from 'in-forge/plugins/awsEcsContainer/runtimes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

export default function AwsEcsContainerDashboard({ snapshot }) {
  const runtimeKey = snapshot.getIn(['data', 'runtime']);
  const runtime = getRuntimeByKey(runtimeKey);
  return <DashboardSection title="Runtime">{runtime.label}</DashboardSection>;
}
