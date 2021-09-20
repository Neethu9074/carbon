/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ApplicationsHealthIndicatorBar from 'in-components/ApplicationHealthOverview/ApplicationsHealthIndicatorBar';

export default {
  component: ApplicationsHealthIndicatorBar
};

export function Indicator() {
  return <ApplicationsHealthIndicatorBar critical={5} warning={3} total={13} label="Health Status" />;
}
