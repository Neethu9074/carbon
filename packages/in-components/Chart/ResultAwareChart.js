import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Chart from 'in-components/Chart/ChartReactComponent';
import Card from 'in-new-components/Card';

export default function ResultAwareChart({ result, config, renderLegend = true }) {
  let { timeConfig, y1, y2, frontBufferWidth, customHeight, cardTitle, showNoDataInfoWhenEmpty = true } = config;
  let content;
  let withoutPadding = false;

  const height = customHeight || 160;
  if (result.errors.length > 0) {
    content = <NoDataAvailable width={frontBufferWidth} height={height} />;
  } else if (result.progress.loading) {
    // First time progress received, percentage seems to be empty, so start with 0.2 to have a small arc
    content = <LoadingIndicator height={height} width={frontBufferWidth} />;
    withoutPadding = true;
  } else {
    //If there are specifically mapped labels, there must be a grouping result.
    if (y1 && y1.metrics && result.data && result.y1Labels) {
      y1 = mapMultiResult(result, y1, false);
    }
    if (y2 && y2.metrics && result.data && result.y2Labels) {
      y2 = mapMultiResult(result, y2, true);
    }
    if (!timeConfig || !y1 || !y1.metrics || (showNoDataInfoWhenEmpty && containsOnlyEmptyData(y1.metrics))) {
      content = <NoDataAvailable width={frontBufferWidth} height={height} />;
    } else {
      const CustomChartComponent = config.customChartComponent;
      config = normalizeTimeShiftedTimestamps(result, config);
      content = CustomChartComponent ? (
        <CustomChartComponent renderLegend={renderLegend} {...config} />
      ) : (
        <Chart renderLegend={renderLegend} {...config} />
      );
    }
  }

  if (cardTitle == null) {
    return content;
  }

  return (
    <Card
      title={cardTitle}
      useMaxAvailableHeight={config.cardUseMaxAvailableHeight}
      withoutPadding={withoutPadding}
      header={config.cardHeader}
    >
      {content}
    </Card>
  );
}

/**
 * Function to map grouped results to the chart.
 * Applies the incoming metric IDs, their values, as well as their labels and aggregation types.
 * @param {object} result The result object.
 * @param {object} y Part of the given configuration.
 * @param {boolean} isY2 Whether the given part of the configuration is for the secondary axis.
 */
function mapMultiResult(result, y, isY2) {
  const metricIds = y.metricIds;
  const prefix = isY2 ? 'y2' : 'y1';
  y.metricIds = Object.keys(result.data).filter(metricId => metricId.startsWith(prefix));
  y.metrics = y.metricIds.map(metricId => result.data[metricId]);
  if (result.labels) {
    y.labels = result.labels;
  }
  //Labels may be overwritten if there are grouping results.
  if (result.y1Labels && !isY2) {
    y.labels = result.y1Labels;
  }
  if (result.y2Labels && isY2) {
    y.labels = result.y2Labels;
  }
  y.aggregations = Object.keys(result.data)
    .filter(metricId => metricId.startsWith(prefix))
    .map(key => {
      const originalMetricId = key.split(':')[0];
      const indexOfOriginalMetricID = metricIds.indexOf(originalMetricId);
      const originalAggregation = y.aggregations[indexOfOriginalMetricID];
      return originalAggregation;
    });
  return y;
}

function containsOnlyEmptyData(metrics) {
  const keys = Object.keys(metrics);
  for (let i = 0; i < keys.length; i++) {
    if (metrics[keys[i]] && metrics[keys[i]].length > 0) {
      return false;
    }
  }
  return true;
}

function normalizeTimeShiftedTimestamps(result, config) {
  const copiedConfig = {
    ...config
  };
  copiedConfig.y1 = normalizeTimeShiftedTimestampsForAxis(result, config.y1);
  if (config.y2) {
    copiedConfig.y2 = normalizeTimeShiftedTimestampsForAxis(result, config.y2);
  }

  return copiedConfig;
}

function normalizeTimeShiftedTimestampsForAxis(result, axis) {
  if (!axis.timeShifts) {
    return axis;
  }

  const copiedAxis = {
    ...axis
  };

  copiedAxis.metrics = axis.timeShifts.map(({ offset }, i) => {
    if (offset === 0) {
      return axis.metrics[i];
    }

    return axis.metrics[i].map(([ts, v]) => [ts - offset, v]);
  });

  return copiedAxis;
}
