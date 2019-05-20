import React from 'react';

import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';

export default function FinagleDashboard({ snapshot, timeConfig }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} />;
}
