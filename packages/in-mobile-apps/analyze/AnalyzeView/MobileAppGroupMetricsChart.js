/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withProps } from 'recompose';

import GroupMetricsChart, { metricsChartDefinitions } from 'in-analyze/components/MetricsChart/GroupMetricsChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const countChartDefinition = {
  label: t('in-mobile-apps:analyzeView.groupMetricsChart.countChartDefinitionLabel'),
  key: 'beaconCount_SUM',
  renderer: Renderer.stackedBar,
  aggregation: 'SUM',
  formatter: number.forcedCompact,
  min: 0
};

export default withProps(({ metrics, availableMetrics }) => ({
  groupNameProcessor: v => JSON.parse(v),
  chartDefinitions: [countChartDefinition].concat(metricsChartDefinitions(metrics, availableMetrics))
}))(GroupMetricsChart);
