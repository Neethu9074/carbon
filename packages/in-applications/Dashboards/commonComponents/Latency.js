/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UnifiedMetricsChart, { parseMetricId } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { filterByEndpointType } from 'in-applications/Dashboards/commonComponents/includeEndpointTypes';
import { createChartedMetric, createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { timeShift, chartColors } from 'in-themes/chartColors';
import { getChartGranularity } from 'in-stores/metric/metric';
import { latencyFixed } from 'in-services/formatters/number';
import { integral, line } from 'in-stores/metric/renderer';
import { t } from 'in-i18n';

export default function Latency({
  timeConfig,
  timeShiftConfig,
  endpointId,
  applicationId,
  serviceId,
  boundaryScope,
  cardTitle,
  endpointTypes,
  timeShiftAggregation,
  tagFilters,
  groupBy,
  renderPostChartContent,
  rightHeaderContent,
  customChartSkeletonHeight,
  tableOpen,
  tableCloseHandler
}) {
  const granularity = getChartGranularity(timeConfig);
  const slownessBlueprintConfig = getBlueprintConfig('slowness');
  const aggregations = ['P90'];
  const alertRules = {};
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  for (const aggregation of aggregations) {
    alertRules[`slowness_${aggregation}`] = {
      rule: {
        alertType: slownessBlueprintConfig.type,
        aggregation,
        metricName: slownessBlueprintConfig.getMetricName()
      },
      seasonality: DAILY
    };
  }

  const defaultMetricConfig = {
    granularity,
    metric: 'latency',
    source: 'APPLICATION',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: { offset: 0 }
  };

  const latencyMetrics = [
    {
      config: defaultMetricConfig,
      aggregation: 'P50',
      label: t('in-mobile-apps:dashboard.tabs.50thLabel'),
      color: chartColors.strokeColors100[0]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P90',
      label: t('in-mobile-apps:dashboard.tabs.90thLabel'),
      color: chartColors.strokeColors100[1]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P95',
      label: t('in-mobile-apps:dashboard.tabs.95thLabel'),
      color: chartColors.strokeColors100[2]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'P99',
      label: t('in-mobile-apps:dashboard.tabs.99thLabel'),
      color: chartColors.strokeColors100[3]
    },
    {
      config: defaultMetricConfig,
      aggregation: 'MAX',
      label: t('in-mobile-apps:dashboard.tabs.maxLabel'),
      color: chartColors.strokeColors100[4],
      defaultDisabled: !timeShiftConfig.offset
    }
  ];

  let metricConfigs;
  let metricConfigsY2 = [];
  let renderer;
  let colors;
  let colorsY2;
  const latencyMetricsY2 = [
    {
      config: defaultMetricConfig,
      aggregation: 'MEAN',
      label: t('in-mobile-apps:dashboard.tabs.meanLabel'),
      color: chartColors.strokeColors100[5]
    }
  ];
  if (timeShiftConfig.offset) {
    const timeShiftChartMetric =
      latencyMetrics.find(m => m.aggregation === timeShiftAggregation) ??
      latencyMetricsY2.find(m => m.aggregation === timeShiftAggregation) ??
      latencyMetrics[0];
    const timeShiftMetricConfig = {
      label: timeShiftChartMetric.label,
      aggregation: timeShiftChartMetric.aggregation,
      defaultDisabled: timeShiftChartMetric.defaultDisabled,
      ...timeShiftChartMetric.config
    };
    metricConfigs = [
      {
        ...timeShiftMetricConfig,
        timeShift: timeShiftConfig.offset
      }, // make sure the main metric renders over the time shifted metric
      {
        ...timeShiftMetricConfig
      }
    ];
    colors = [timeShift, timeShiftChartMetric.color];
    renderer = line.id;
  } else {
    metricConfigs = latencyMetrics.map(m => ({
      label: m.label,
      aggregation: m.aggregation,
      defaultDisabled: m.defaultDisabled,
      ...m.config
    }));
    colors = latencyMetrics.map(m => m.color);
    colorsY2 = latencyMetricsY2.map(m => m.color);
    renderer = integral.id;
    metricConfigsY2 = latencyMetricsY2.map(m => ({
      label: m.label,
      aggregation: m.aggregation,
      defaultDisabled: m.defaultDisabled,
      ...m.config
    }));
  }
  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      tableOpen={tableOpen}
      tableCloseHandler={tableCloseHandler}
      customChartSkeletonHeight={customChartSkeletonHeight || 280}
      renderPostChartContent={props =>
        renderPostChartContent({
          chartName: cardTitle,
          alertRules,
          boundaryScope,
          ...props
        })
      }
      title={cardTitle}
      rightHeaderContent={rightHeaderContent}
      timeConfig={timeConfig}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset}
      reverseTooltipOrder
      shareMaxAxisDomain
      config={{
        y1: {
          renderer: renderer,
          formatter: 'millis.compact',
          tooltipFormatter: latencyFixed.compact,
          calculateStackDifferences: true,
          metrics: metricConfigs,
          colors: colors
        },
        y2: {
          metrics: metricConfigsY2,
          labels: t('in-mobile-apps:dashboard.tabs.meanLabel'),
          formatter: 'millis.compact',
          renderer: line.id,
          colors: colorsY2
        },
        type: 'TIME_SERIES',
        primaryContextMenuAction: 'analyze',
        additionalContextMenuButtons: [
          {
            name: 'analyze',
            icon: 'lib_analyze',
            label: t('in-applications:lineViewInAnalyze'),
            getHref$: (highlightedTime, metricsToAdd) =>
              getJumpToAnalyzeHref$(
                { applicationId, serviceId, endpointId },
                {
                  timeConfig: highlightedTime,
                  boundaryScope,
                  groupBy,
                  orderByGroups: createOrderBy('latency_P50', 'DESC'),
                  formModel: filterByEndpointType(endpointTypes),
                  fields: getFields(metricsToAdd.renderedMetrics, metricConfigs, timeShiftConfig),
                  chartedMetrics: getChartedMetrics(metricsToAdd.renderedMetrics, metricConfigs, timeShiftConfig)
                },
                getLinkToApplicationAnalyze
              )
          }
        ]
      }}
    />
  );
}

function getFields(renderedMetrics, metricConfigs, timeShiftConfig) {
  const fields = [];
  if (timeShiftConfig.offset) {
    fields.push(createMetricField('latency', metricConfigs[0].aggregation));
  } else {
    const activeAggregations = renderedMetrics.map(
      metricId => metricConfigs[parseMetricId(metricId).index].aggregation
    );
    activeAggregations.map(aggregation => {
      fields.push(createMetricField('latency', aggregation));
    });
  }
  return fields;
}

function getChartedMetrics(renderedMetrics, metricConfigs, timeShiftConfig) {
  const metricsList = getFields(renderedMetrics, metricConfigs, timeShiftConfig);
  if (metricsList.length > 1 && metricsList[0].aggregationId === 'P99' && metricsList[1].aggregationId === 'MAX') {
    return [createChartedMetric('latency', 'MAX')];
  }
  return [createChartedMetric('latency', metricsList[0].aggregationId)];
}
