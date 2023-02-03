/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ConfigFromDataSeries, Metric } from 'in-custom-dashboards/widgets/Chart/types';

declare const all: { [name: string]: DataSource };
export default all;

interface DataSource {
  source: string;
  label: string;
  disabled: boolean;
  visible: boolean;
  Form: React.ReactElement;
  configureChart?: (previous: ConfigFromDataSeries, timeConfig: TimeConfig, metric: Metric) => ConfigFromDataSeries;
}
