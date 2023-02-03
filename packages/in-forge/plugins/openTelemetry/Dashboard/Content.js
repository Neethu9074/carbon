/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DefaultDashboard from 'in-infrastructure/Dashboard/components/DefaultDashboard';

export default function OpenTelemetryDashboard({ snapshot, timeConfig }) {
  return <DefaultDashboard snapshot={snapshot} timeConfig={timeConfig} />;
}
