/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';

export default function StatsdDashboard({ snapshot, timeConfig }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} specs={SPECS} />;
}

export const SPECS = [
  AVAILABLE_SPECS.GAUGE,
  AVAILABLE_SPECS.COUNTER,
  AVAILABLE_SPECS.METER,
  AVAILABLE_SPECS.HISTOGRAM,
  AVAILABLE_SPECS.TIMER
];
