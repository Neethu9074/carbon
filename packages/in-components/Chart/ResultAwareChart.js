import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Chart from 'in-components/Chart/ChartReactComponent';
import Card from 'in-new-components/Card';

export default function ResultAwareChart({ result, config, renderLegend = true }) {
  let { timeConfig, y1, frontBufferWidth, customHeight, cardTitle, showNoDataInfoWhenEmpty = true } = config;
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
    //If there are more results than configured metrics, there must be a grouped result.
    if (y1 && y1.metrics && Object.keys(result.data).length !== y1.metrics.length) {
      y1 = mapMultiResult(result, y1);
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
 * The label contains both the overarching metric label as well as the returned label (depending on the group).
 * @param {object} result The result object.
 * @param {object} y1 Part of the given configuration.
 */
function mapMultiResult(result, y1) {
  y1.metricIds = Object.keys(result.data);
  y1.metrics = Object.values(result.data);
  if (result.labels) {
    y1.labels = result.labels;
  }
  if (y1.aggregations) {
    y1.aggregations = Object.keys(result.data).map(key => {
      const originalMetricId = key.split(':')[0];
      const indexOfOriginalMetricID = y1.metricIds.indexOf(originalMetricId);
      const originalAggregation = y1.aggregations[indexOfOriginalMetricID];
      return originalAggregation;
    });
  }
  return y1;
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
