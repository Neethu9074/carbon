/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withKnobs } from '@storybook/addon-knobs/react';
import React from 'react';

import demoCase from './PageLoadView/demoCase.json';

import OverviewChart from 'in-websites/analyze/PageLoadView/tabs/Summary/OverviewChart.js';

export default {
  title: 'Templates|website/OverviewChart',
  component: OverviewChart,
  decorators: [withKnobs]
};

export function Default() {
  return <OverviewChart beacons={demoCase} />;
}
