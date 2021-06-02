/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  renderer as availableRenderers,
  defaultRenderer,
  enforceSingleNumberResult
} from 'in-custom-dashboards/widgets/Chart/renderer';
import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import { colors } from 'in-custom-dashboards/widgets/Chart/FormComponent/colors';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { getChartGranularity } from 'in-stores/metric/metric';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getFormatter } from 'in-stores/metric/formatters';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

const defaultNumberOfSuggestedDatapoints = 80;

// The unified metrics chart supports advanced data retrieval use cases, e.g., grouped metrics, charting
// data series from different product areas and more.
//
// The main function of this component is to take a configuration option, gather all the required data and
// to map this data onto the existing charting components. Through this pattern the existing charting
// components do not need to be aware of the advanced capabilities. Instead, the existing charting components
// can continue to focus on presentation of data series (no matter the source or complexity of the queries).
//
// A note on grouped metrics:
// A grouped metric is a single configured metric which gets expanded in the backend into multiple data series.
// For example, one might request the call rate of the top 5 services. In this case, a single configured data
// series in the UI is expanded in the backend into 0..5 result data series. It is the job of this component,
// among others, to handle this result expansion and to adapt the metric configurations accordingly.
// By handling the expansion logic in UnifiedMetricsChart, we can realize even more advanced use cases. For example,
// one by place a grouped metric and a regular metric on the same axis. Thus creating 1..N data series on a
// single axis. Handling this expansion is non-trivial. Whereever this happens, you can be sure to find a call to
// getMetricIdForGroup – at least as long as this comment is up to date :-)
export default function UnifiedMetricsChart({
  config,
  title,
  cardHeader,
  customHeight,
  automaticallySize,
  shareMaxAxisDomain,
  reverseLegendOrder,
  reverseTooltipOrder,
  tooltipTimeFormatter,
  renderPostChartContent,
  cardUseMaxAvailableHeight,
  excludedContextMenuActions,
  renderLegend = true,
  // In some cases the parent component needs to signal to this component that it is loading data needed for the chart
  // configuration, e.g. list of groups for group charts. While this flag is set, no back-end queries should be executed
  // and a loading indicator should be displayed.
  forceLoadingIndicator = false
}) {
  config = useMemo(() => (forceLoadingIndicator ? null : duplicateTimeShiftComparedMetrics(config)), [
    config,
    forceLoadingIndicator
  ]);

  const timeConfig = useTimeConfig();
  // timeConfigExtendedForLiveMode will be used as a hook dependency, therefore the same object must be reused unless some of its fields changes
  const [timeConfigExtendedForLiveMode, setTimeConfigExtendedForLiveMode] = useState(
    extendWindowSizeOnLiveMode(timeConfig)
  );
  useEffect(() => setTimeConfigExtendedForLiveMode(extendWindowSizeOnLiveMode(timeConfig)), [timeConfig]);

  const suggestedNumberOfDataPoints =
    (forceLoadingIndicator ? null : getSuggestedNumberOfDataPoints(config)) || defaultNumberOfSuggestedDatapoints;
  const configuredGranularity = forceLoadingIndicator
    ? null
    : config.granularity ?? getChartGranularity(timeConfigExtendedForLiveMode, suggestedNumberOfDataPoints);
  const minimumGranularity = forceLoadingIndicator ? null : getMinGranularity(config, timeConfig);
  const granularity = forceLoadingIndicator ? null : Math.max(minimumGranularity, configuredGranularity);
  let result =
    useResultData(config, granularity, timeConfigExtendedForLiveMode, forceLoadingIndicator) ?? pendingResult;

  // Transform result data structure into the structure expected by the chart
  let resultDataAsList = result?.data;
  if (result?.data) {
    result = {
      ...result,
      // Turn the list of metric results into a map of metric results.
      data: result.data.reduce((agg, { id, label, values }) => {
        // The backend can send multiple results for the same ID. In that case we will be talking about grouped metrics.
        if (label) {
          id = getMetricIdForGroup(id, label);
        }
        agg[id] = values;
        return agg;
      }, {})
    };
  }

  return (
    <ChartWrapper
      cardTitle={title}
      timeConfig={timeConfig}
      y1={forceLoadingIndicator ? null : toAxisConfiguration('y1', config?.y1, resultDataAsList, config)}
      y2={forceLoadingIndicator ? null : toAxisConfiguration('y2', config?.y2, resultDataAsList, config)}
      metricsConfiguration={forceLoadingIndicator ? null : toMetricsConfiguration(config, resultDataAsList)}
      primaryContextMenuAction={config?.primaryContextMenuAction}
      additionalContextMenuButtons={config?.additionalContextMenuButtons}
      result={result}
      granularity={granularity}
      // pass through props
      cardHeader={cardHeader}
      customHeight={customHeight}
      automaticallySize={automaticallySize}
      shareMaxAxisDomain={shareMaxAxisDomain}
      reverseLegendOrder={reverseLegendOrder}
      renderLegend={renderLegend}
      reverseTooltipOrder={reverseTooltipOrder}
      tooltipTimeFormatter={tooltipTimeFormatter}
      renderPostChartContent={renderPostChartContent}
      cardUseMaxAvailableHeight={cardUseMaxAvailableHeight}
      excludedContextMenuActions={excludedContextMenuActions}
    />
  );
}

function useResultData(config, granularity, timeConfig, forceLoadingIndicator) {
  const metrics = {};
  const resultType = forceLoadingIndicator
    ? null
    : enforceSingleNumberResult.find(({ id }) => id === config.y1.renderer)
    ? 'SINGLE_NUMBER'
    : config.type;
  if (resultType === 'SINGLE_NUMBER') {
    granularity = null;
  }

  if (!forceLoadingIndicator) {
    config.y1.metrics.forEach(
      (metricConfiguration, i) =>
        (metrics[getMetricId('y1', i)] = {
          ...metricConfiguration,
          resultType,
          granularity,
          timeConfig: timeConfig,
          timeShift: translateOffsetToTimeShiftConfig(metricConfiguration.timeShift, timeConfig)
        })
    );

    config.y2?.metrics?.forEach(
      (metricConfiguration, i) =>
        (metrics[getMetricId('y2', i)] = {
          ...metricConfiguration,
          resultType,
          granularity,
          timeConfig: timeConfig,
          timeShift: translateOffsetToTimeShiftConfig(metricConfiguration.timeShift, timeConfig)
        })
    );
  }

  // do not execute the query while the parent component is still loading data for the chart configuration
  return useObservable(() => (forceLoadingIndicator ? null : getUnifiedMetrics({ metrics })), [
    timeConfig,
    config,
    forceLoadingIndicator
  ]);
}

function toAxisConfiguration(name, axis, resultDataAsList, chartConfig) {
  if (!axis || axis.metrics.length === 0 || !resultDataAsList) {
    return;
  }

  // Overwrite colors using configuration in the form of what is supported by custom dashboards.
  // For plain metrics: Either use the value received from the `color` prop or use `undefined`
  //                    (which means use a random color)
  // For grouped metrics: Always use a random color
  if (!axis.colors) {
    axis.colors = axis.metrics.flatMap(({ grouping, color }, i) => {
      if (isGroupedMetric(grouping)) {
        const metricId = getMetricId(name, i);
        return resultDataAsList.filter(({ id }) => id === metricId).map(() => null);
      } else if (!color) {
        return [null];
      }

      return [colors.find(c => c.id === color)?.color ?? null];
    });
  }

  return {
    renderer: (availableRenderers.find(({ id }) => id === axis.renderer) || defaultRenderer).renderer,
    formatter: getFormatter(axis.formatter),
    tooltipFormatter: axis.tooltipFormatter,
    labels: axis.metrics.flatMap((metric, i) => {
      let { label: metricLabel, grouping } = metric;
      if (!metricLabel) {
        metricLabel = getMetricLabel(metric);
      }
      // For grouped metrics one metric configuration will result in
      // multiple data series and hence in multiple labels.
      if (isGroupedMetric(grouping)) {
        const metricId = getMetricId(name, i);
        // console.log('name=', name, 'metricId', metricId, axis);
        return resultDataAsList
          .filter(({ id }) => id === metricId)
          .map(({ label: groupLabel }) => {
            // 'other_group' is a special marker within the labels that should be replaced with 'Other'.
            // Eventually we might wanna teach the backend to return the correct string right away.
            if (groupLabel === 'other_group') {
              return 'Other';
            }
            //disambiguate multi-metric, multi-series charts by prefixing the group label with the metric label
            if (!groupLabel) {
              return metricLabel;
            }
            const isAMultiSeriesChart =
              (chartConfig.y1.metrics.length && chartConfig.y2?.metrics?.length) || axis.metrics.length > 1;
            return isAMultiSeriesChart ? `${metricLabel} ${groupLabel}` : groupLabel;
          });
      }
      return [metricLabel];
    }),
    colors: axis.colors,
    metricIds: axis.metrics.flatMap(({ grouping }, i) => {
      // For grouped metrics one metric configuration will result in
      // multiple data series and hence in multiple metric IDs.
      if (isGroupedMetric(grouping)) {
        const metricId = getMetricId(name, i);
        return resultDataAsList
          .filter(({ id }) => id === metricId)
          .map(({ label }) => getMetricIdForGroup(metricId, label));
      }
      return [getMetricId(name, i)];
    }),
    defaultDisabledMetrics: axis.metrics
      .map((m, i) => (m.defaultDisabled === true ? getMetricId(name, i) : null))
      .filter(Boolean),
    min: axis.min,
    max: axis.max,
    calculateStackDifferences: axis.calculateStackDifferences
  };
}

function isGroupedMetric(grouping) {
  return grouping?.length > 0;
}

function getMetricId(axis, index) {
  return `${axis}-${index}`;
}

function getMetricIdForGroup(metricId, groupLabel) {
  return `${metricId}-${groupLabel}`;
}

export function parseMetricId(metricId) {
  const [axis, index] = metricId.split('-');
  return { axis: axis, index: index };
}

function toMetricsConfiguration(config, resultDataAsList) {
  if (!resultDataAsList) {
    return null;
  }

  const metricsConfiguration = {
    metrics: {}
  };

  addForAxis('y1');
  addForAxis('y2');

  if (config.reverseOrder) {
    metricsConfiguration.reverseOrder = config.reverseOrder;
  }

  return metricsConfiguration;

  function addForAxis(axisName) {
    config[axisName]?.metrics?.forEach(({ metric, aggregation, timeShift, grouping }, i) => {
      const metricId = getMetricId(axisName, i);
      const config = {
        metric,
        aggregation,
        timeShift
      };

      // For grouped metrics one metric configuration will result in multiple data series and
      // each needs to be represented within the metric configuration object so that we stick to
      // the ChartWrapper and ResultAwareChart contracts.
      if (isGroupedMetric(grouping)) {
        resultDataAsList.forEach(({ id, label }) => {
          if (id === metricId) {
            metricsConfiguration.metrics[getMetricIdForGroup(metricId, label)] = config;
          }
        });
      } else {
        metricsConfiguration.metrics[metricId] = config;
      }
    });
  }
}

function getSuggestedNumberOfDataPoints(config) {
  return getAllMetricSources(config)
    .map(source => source.suggestedNumberOfDataPoints ?? defaultNumberOfSuggestedDatapoints)
    .reduce((a, m) => Math.max(a, m), 0);
}

function getMinGranularity(config, timeConfig) {
  return getAllMetricSources(config)
    .map(source => source.getMinGranularity?.(timeConfig) ?? 0)
    .reduce((a, m) => Math.max(a, m), 0);
}

function getAllMetricSources(config) {
  return config.y1.metrics
    .concat(config.y2?.metrics ?? [])
    .map(c => sources[c.source])
    .filter(Boolean);
}

// For charts in custom dashboards we support a feature called "Display Current Values".
// With this option is selected, the data series must be duplicated. One time with enabled time
// shifting and one time without.
function duplicateTimeShiftComparedMetrics(config) {
  return {
    ...config,
    y1: duplicateTimeShiftComparedMetricsForAxis(config.y1),
    y2: duplicateTimeShiftComparedMetricsForAxis(config.y2)
  };
}

function duplicateTimeShiftComparedMetricsForAxis(axis) {
  if (!axis) {
    return axis;
  }

  return {
    ...axis,
    metrics: axis.metrics.flatMap(metric => {
      if (!metric.timeShift || !metric.compareToTimeShifted) {
        return [metric];
      }

      return [
        {
          ...metric,
          timeShift: 0,
          compareToTimeShifted: false
        },
        metric
      ];
    })
  };
}
