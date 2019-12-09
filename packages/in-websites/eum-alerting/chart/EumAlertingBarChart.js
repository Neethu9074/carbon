import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import EumAlertingBarChartWrapper from 'in-websites/eum-alerting/chart/EumAlertingBarChartWrapper';
import { percentage, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import theme from 'in-themes';

const errorCount = selectOptions[fieldNames.ruleMetricName][0].value;
const errorRate = selectOptions[fieldNames.ruleMetricName][1].value;

export default function EumAlertingBarChart({
  threshold,
  timeConfig,
  tagFilters,
  errorFilter,
  metricName,
  granularity
}) {
  return (
    <EumAlertingBarChartWrapper
      alignLegendToLeftSideOfChart
      releaseMarkersDisabled
      metricName={metricName}
      timeConfig={timeConfig}
      granularity={granularity}
      y1={{
        threshold,
        getMax: metricsMaxValue => {
          return threshold >= metricsMaxValue
            ? Math.max(metricsMaxValue, (metricName === errorCount ? Math.trunc(threshold) : threshold) * 1.2)
            : metricsMaxValue;
        },
        colors: [
          theme.lib.colors.blue800,
          theme.lib.colors.pink800,
          theme.lib.colors.red800,
          theme.lib.colors.lightBlue800
        ],
        icons: {
          types: ['lib_bar_chart', 'lib_threshold', 'lib_actions_stop', 'lib_actions_stop'],
          colors: [
            theme.lib.colors.blue800,
            theme.lib.colors.red800,
            theme.lib.colors.pink800,
            theme.lib.colors.lightBlue800
          ]
        },
        renderer: Renderer.errorsBarWithBaseline,
        formatter: metricName === errorCount ? number.forcedCompact : percentage.detailed,
        labels: ['Historical data', 'Threshold', 'Expected Range', 'Violations'],
        excludedLabelsFromTooltip: ['Expected Range', 'Violations'],
        metricIds: ['errors', 'threshold'],
        nonToggleableSeries: new Map([['errors', null], ['threshold', null]])
      }}
      metricsConfiguration={{
        timeConfig,
        tagFilters: metricName === errorCount ? [...tagFilters, errorFilter] : tagFilters,
        metrics: {
          errors: getMetricConfig(metricName, granularity, errorFilter)
        }
      }}
    />
  );
}

EumAlertingBarChart.propTypes = {
  errorFilter: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  metricName: PropTypes.oneOf(selectOptions[fieldNames.ruleMetricName].map(({ value }) => value)).isRequired,
  tagFilters: PropTypes.array.isRequired,
  threshold: PropTypes.number.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getMetricConfig(metricName, granularity, errorFilter = null) {
  const metricConfigs = {
    [errorRate]: {
      metric: 'specificJsErrorRate',
      granularity: granularity,
      aggregation: 'MEAN',
      numeratorFilter: errorFilter
    },
    [errorCount]: {
      metric: 'errors',
      granularity: granularity,
      aggregation: 'SUM'
    }
  };
  return metricConfigs[metricName];
}
