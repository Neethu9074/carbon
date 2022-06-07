/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  Config,
  MetricData,
  UnifiedMetricsChartProps,
  Axis,
  ConfigFromDataSeries,
  Metric
} from 'in-custom-dashboards/widgets/Chart/types';
import {
  defaultRenderer,
  renderer as availableRenderers,
  enforceSingleNumberResult
} from 'in-custom-dashboards/widgets/Chart/renderer';
import {
  MetricsConfiguration,
  AxisConfiguration as ChartAxis,
  Metric as ChartMetric,
  AxisColor
} from 'in-components/Chart/types';
import {
  Grouping,
  LabeledMetricResult,
  MetricResult,
  Result,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from 'in-types';
import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import { colors } from 'in-custom-dashboards/widgets/Chart/FormComponent/colors';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { getChartGranularity } from 'in-stores/metric/metric';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { getFormatter } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export const defaultNumberOfSuggestedDatapoints = 80;

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
  forceLoadingIndicator,
  ...props
}: UnifiedMetricsChartProps & { forceLoadingIndicator?: boolean }) {
  const timeConfig = useTimeConfig();

  // In some cases the parent component needs to signal to this component that it is loading data needed for the chart
  // configuration, e.g. list of groups for group charts. While this flag is set, no back-end queries should be executed
  // and a loading indicator should be displayed.
  if (forceLoadingIndicator) {
    return (
      <ChartWrapper
        timeConfig={timeConfig}
        primaryContextMenuAction={props.config?.primaryContextMenuAction}
        additionalContextMenuButtons={props.config?.additionalContextMenuButtons}
        result={pendingResult}
        {...props}
      />
    );
  }

  return <DataLoadingWrapper timeConfig={timeConfig} {...props} />;
}

function DataLoadingWrapper({
  config: incomingConfig,
  timeConfig,
  onApproximateDataChange = noop,
  ...props
}: UnifiedMetricsChartProps & { timeConfig: TimeConfig }) {
  const config = useMemo(() => duplicateTimeShiftComparedMetrics(incomingConfig), [incomingConfig]);

  // timeConfigExtendedForLiveMode will be used as a hook dependency, therefore the same object must be reused unless some of its fields changes
  const [timeConfigExtendedForLiveMode, setTimeConfigExtendedForLiveMode] = useState(
    extendWindowSizeOnLiveMode(timeConfig)
  );
  useEffect(() => setTimeConfigExtendedForLiveMode(extendWindowSizeOnLiveMode(timeConfig)), [timeConfig]);

  const resolvedConfig = configureChart(config, timeConfig);
  const suggestedNumberOfDataPoints = resolvedConfig?.suggestedNumberOfDataPoints || defaultNumberOfSuggestedDatapoints;
  const configuredGranularity =
    config.granularity ?? getChartGranularity(timeConfigExtendedForLiveMode, suggestedNumberOfDataPoints);
  const minimumGranularity = resolvedConfig.minGranularity;
  const granularity = Math.max(minimumGranularity, configuredGranularity);
  const result: Result<LabeledMetricResult[]> | undefined | null =
    useResultData(config, granularity, timeConfigExtendedForLiveMode) ?? pendingResult;
  const renderErrorDetail = resolvedConfig.renderErrorDetail;

  // Transform result data structure into the structure expected by the chart
  let resultDataAsList = result?.data;
  let remappedResult: Result<MetricData> = pendingResult;
  if (result?.data) {
    remappedResult = {
      ...result,
      // Turn the list of metric results into a map of metric results.
      data: result.data.reduce((agg, { id, label, values }) => {
        // The backend can send multiple results for the same ID. In that case we will be talking about grouped metrics.
        if (label) {
          id = getMetricIdForGroup(id, label);
        }
        agg[id] = values as [number, number][];
        return agg;
      }, {} as MetricData)
    };

    if (config.y1?.colorMapper || config.y2?.colorMapper) {
      const axisColors: { [axis: string]: (AxisColor | undefined | null)[] } = {};
      for (const item in result.data) {
        const [axis, id, ...labelParts] = item.split('-');
        const label = labelParts.join('-');
        const colors = axisColors[axis] ?? [];
        const colorMapper = axis === 'y1' ? config.y1.colorMapper : config.y2?.colorMapper;
        axisColors[axis] = [...colors, colorMapper?.(id, label)];
      }

      for (const axis in axisColors) {
        const targetAxis = axis === 'y1' ? config.y1 : config.y2;
        if (targetAxis) {
          targetAxis.colors = axisColors[axis].filter(Boolean) as AxisColor[];
        }
      }
    }
  }

  const hasApproximateData =
    !!resultDataAsList &&
    resultDataAsList.filter(elem => elem?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE').length >
      0;

  useEffect(() => {
    onApproximateDataChange(hasApproximateData);
  }, [hasApproximateData, onApproximateDataChange]);

  return (
    <ChartWrapper
      timeConfig={timeConfig}
      y1={toAxisConfiguration(config, 'y1', config.y1, resultDataAsList)}
      y2={toAxisConfiguration(config, 'y2', config.y2, resultDataAsList)}
      metricsConfiguration={toMetricsConfiguration(config, resultDataAsList)}
      result={remappedResult}
      granularity={granularity}
      renderErrorDetail={renderErrorDetail}
      hasApproximateData={hasApproximateData}
      primaryContextMenuAction={config?.primaryContextMenuAction}
      additionalContextMenuButtons={config?.additionalContextMenuButtons}
      {...props}
    />
  );
}

function useResultData(
  config: Config,
  granularity: number,
  timeConfig: TimeConfig
): Result<MetricResult[]> | undefined | null {
  const metrics: { [id: string]: UnifiedMetricConfigurationUnion } = {};
  const resultType = enforceSingleNumberResult.find(({ id }) => id === config?.y1.renderer)
    ? 'SINGLE_NUMBER'
    : config?.type;
  const adjustedGranularity = resultType === 'SINGLE_NUMBER' ? undefined : granularity;

  config?.y1?.metrics.forEach(
    (metricConfiguration, i) =>
      (metrics[getMetricId('y1', i)] = {
        ...metricConfiguration,
        resultType,
        granularity: adjustedGranularity,
        timeConfig: timeConfig,
        timeShift: metricConfiguration.timeShift
          ? translateOffsetToTimeShiftConfig(metricConfiguration.timeShift, timeConfig)
          : { offset: 0 }
      } as UnifiedMetricConfigurationUnion)
  );

  config?.y2?.metrics?.forEach(
    (metricConfiguration, i) =>
      (metrics[getMetricId('y2', i)] = {
        ...metricConfiguration,
        resultType,
        granularity: adjustedGranularity,
        timeConfig: timeConfig,
        timeShift: metricConfiguration.timeShift
          ? translateOffsetToTimeShiftConfig(metricConfiguration.timeShift, timeConfig)
          : { offset: 0 }
      } as UnifiedMetricConfigurationUnion)
  );

  const stableConfig = useStableObjectInstance(config);

  // do not execute the query while the parent component is still loading data for the chart configuration
  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig, stableConfig]);
}

export function parseMetricId(metricId: string) {
  const [axis, index] = metricId.split('-');
  return { axis: axis, index: index };
}

// For charts in custom dashboards we support a feature called "Display Current Values".
// With this option is selected, the data series must be duplicated. One time with enabled time
// shifting and one time without.
export function duplicateTimeShiftComparedMetrics(config: Config): Config {
  return {
    ...config,
    y1: duplicateTimeShiftComparedMetricsForAxis(config.y1),
    y2: config.y2 ? duplicateTimeShiftComparedMetricsForAxis(config.y2) : undefined
  };
}

export function duplicateTimeShiftComparedMetricsForAxis(axis: Axis): Axis {
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

export function configureChart(config: Config, timeConfig: TimeConfig): ConfigFromDataSeries {
  const metrics = getAllMetrics(config);
  return metrics.reduce((acc, metric) => {
    return sources[metric.source]?.configureChart?.(acc, timeConfig, metric) ?? acc;
  }, initialChartConfig);
}

const initialChartConfig: ConfigFromDataSeries = {
  renderErrorDetail: false,
  suggestedNumberOfDataPoints: defaultNumberOfSuggestedDatapoints,
  minGranularity: 0
};

function getAllMetrics(config: Config) {
  if (!config) {
    return [];
  }
  return config.y1?.metrics.concat(config.y2?.metrics ?? []);
}

export function toMetricsConfiguration(
  config: Config,
  resultDataAsList?: LabeledMetricResult[]
): MetricsConfiguration | undefined {
  if (!resultDataAsList) {
    return;
  }

  const metricsConfiguration: MetricsConfiguration = {
    metrics: {}
  };

  addForAxis(metricsConfiguration, config.y1, 'y1', resultDataAsList);
  addForAxis(metricsConfiguration, config.y2, 'y2', resultDataAsList);

  if (config.reverseOrder) {
    metricsConfiguration.reverseOrder = config.reverseOrder;
  }

  return metricsConfiguration;
}

function addForAxis(
  metricsConfiguration: MetricsConfiguration,
  axis: Axis | undefined,
  axisName: string,
  resultDataAsList: LabeledMetricResult[]
) {
  axis?.metrics?.forEach(({ metric, aggregation, timeShift, grouping }, i) => {
    const metricId = getMetricId(axisName, i);
    const config: ChartMetric = {
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

export function getMetricId(axis: string, index: number) {
  return `${axis}-${index}`;
}

export function isGroupedMetric(grouping?: Grouping[]) {
  if (!grouping) {
    return false;
  }
  return grouping.length > 0;
}

export function getMetricIdForGroup(metricId: string, groupLabel: string) {
  return `${metricId}-${groupLabel}`;
}

export function toAxisConfiguration(
  chartConfig: Config,
  name: string,
  axis?: Axis,
  resultDataAsList?: LabeledMetricResult[]
): ChartAxis | undefined {
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
    labels: axis.metrics.flatMap((metric: Metric, i: number): string[] => {
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
          .map(({ label: groupLabel }): string => {
            // 'other_group' is a special marker within the labels that should be replaced with 'Other'.
            // Eventually we might wanna teach the backend to return the correct string right away.
            if (groupLabel === 'other_group') {
              return 'Other';
            }
            //disambiguate multi-metric, multi-series charts by prefixing the group label with the metric label
            if (!groupLabel) {
              return metricLabel ?? t('in-custom-dashboards:widgets.util.unnamMetric');
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
    calculateStackDifferences: axis.calculateStackDifferences,
    metrics: []
  };
}
