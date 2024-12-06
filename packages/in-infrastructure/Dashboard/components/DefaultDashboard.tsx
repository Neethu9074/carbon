/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';

export default function DefaultDashboard({ snapshot, timeConfig }) {
  return <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} specs={[AVAILABLE_SPECS.GENERIC]} />;
}
