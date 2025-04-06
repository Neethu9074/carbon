/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import OverviewChart from 'in-websites/analyze/PageLoadView/tabs/Summary/OverviewChart.js';
import demoCase from 'in-websites/analyze/PageLoadView/tabs/Summary/stories/demoCase.json';

export default {
  component: OverviewChart
};

export function Default() {
  return <OverviewChart beacons={demoCase} />;
}
