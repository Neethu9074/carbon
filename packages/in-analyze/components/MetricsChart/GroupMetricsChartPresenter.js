/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find } from 'lodash';
import React from 'react';

import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getResolvedTimeConfig } from 'in-applications/metrics';
import { getChartGranularity } from 'in-stores/metric/metric';
import { identity } from 'in-services/util/function';
import ButtonGroup from 'in-components/ButtonGroup';

import locals from './GroupMetricsChartPresenter.mless';

// Note: In contrast to GroupMetricsChart this component is used to display analyze capability based
// metrics outside of the analyze product area.
export default function GroupMetricsChartPresenter({
  result,
  selectedMetricKey,
  selectedMetricDefinition,
  setSelectedMetricKey,
  timeConfig,
  cardTitle,
  cardHeader,
  translateLabel = identity,
  translateColor,
  metricIds,
  metrics,
  primaryContextMenuAction,
  additionalContextMenuButtons,
  renderPostChartContent
}) {
  cardHeader = (
    <div className={locals.actions}>
      {cardHeader}

      {metrics.length > 1 && (
        <ButtonGroup
          buttonPropsList={metrics.map(metric => ({
            text: metric.label,
            key: getMetricKey(metric),
            onClick: () => setSelectedMetricKey(getMetricKey(metric))
          }))}
          activeKey={selectedMetricKey}
        />
      )}
    </div>
  );

  const chartConfig = {
    cardTitle,
    cardHeader,
    granularity: getChartGranularity(timeConfig),
    primaryContextMenuAction,
    additionalContextMenuButtons,
    y1: {
      formatter: selectedMetricDefinition.formatter,
      renderer: selectedMetricDefinition.renderer
    },
    renderPostChartContent
  };

  const validItem = findValidItem(result, selectedMetricKey);
  if (validItem) {
    if (!metricIds) {
      metricIds = result.data.items.map(item => item.name);
    }
    chartConfig.y1.metricIds = metricIds;

    chartConfig.timeConfig = getResolvedTimeConfig(timeConfig, result);
    chartConfig.y1.labels = metricIds.map(getLabel);
    chartConfig.y1.metrics = metricIds.map(label => {
      const matchingItem = result.data.items.find(item => parseJson(label) === parseJson(item.name));
      if (matchingItem) {
        return matchingItem.metrics[selectedMetricKey];
      }
      if (selectedMetricDefinition.fallbackMetricValue == null) {
        return [];
      }
      return validItem.metrics[selectedMetricKey].map(([ts]) => [ts, selectedMetricDefinition.fallbackMetricValue]);
    });

    chartConfig.y1.aggregations = metricIds.map(() => selectedMetricDefinition.aggregation);

    if (translateColor) {
      const colors = metricIds.map(label => translateColor(parseJson(label)));
      // Only replace if every color could be translated (not undefined), otherwise will fall-back to default colors
      if (colors.every(item => item)) {
        chartConfig.y1.colors = colors;
      }
    }
  }

  return <ResultAwareChart result={result} config={chartConfig} />;

  function getLabel(key) {
    const label = parseJson(key);
    return translateLabel(label) || label;
  }

  function parseJson(key) {
    try {
      return JSON.parse(key);
    } catch (e) {
      return key;
    }
  }
}

export function getMetricKey(metricDefinition) {
  return `${metricDefinition.metric}_${metricDefinition.aggregation}`;
}

function findValidItem(result, selectedMetricKey) {
  if (result.data && result.data.items && result.data.items.length > 0) {
    return find(result.data.items, item => item.metrics[selectedMetricKey]);
  }
  return false;
}
