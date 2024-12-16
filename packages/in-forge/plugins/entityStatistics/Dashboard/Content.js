/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import DefaultDashboard from 'in-infrastructure/Dashboard/components/DefaultDashboard';

export default function EntityStatisticsDashboard({ snapshot, timeConfig }) {
  return <DefaultDashboard snapshot={snapshot} timeConfig={timeConfig} />;
}
