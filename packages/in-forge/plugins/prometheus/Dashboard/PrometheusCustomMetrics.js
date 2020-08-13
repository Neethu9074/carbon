import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';

export default function PrometheusCustomMetrics({ snapshot, timeConfig, titlePrefix }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} specs={SPECS} />;
}

export const SPECS = [
  AVAILABLE_SPECS.COUNTER,
  AVAILABLE_SPECS.GAUGE,
  AVAILABLE_SPECS.HISTOGRAM,
  AVAILABLE_SPECS.SUMMARY
];
