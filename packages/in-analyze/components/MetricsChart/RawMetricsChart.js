/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { intersection, find } from 'lodash';
import React from 'react';

import ButtonGroup from 'in-new-components/ButtonGroup';

import locals from './MetricsChart.mless';

export default function RawMetricsChart({
  chartDefinitions,
  customChartRenderers = [],
  focusedMetric,
  onFocusedMetricChange
}) {
  const chartDefinitionKeys = chartDefinitions.map(d => d.key);
  const customChartRendererKeys = customChartRenderers.map(d => d.key);

  const supportedMetricKeys = intersection(chartDefinitionKeys, customChartRendererKeys);
  if (supportedMetricKeys.length === 0) {
    // no metrics to show
    return null;
  }
  if (!focusedMetric || !supportedMetricKeys.includes(focusedMetric)) {
    focusedMetric = supportedMetricKeys[0];
  }

  const usableChartDefinitions = chartDefinitions.filter(def => supportedMetricKeys.indexOf(def.key) !== -1);

  return (
    <div className={locals.charts}>
      <div className={locals.buttonGroup}>
        <ButtonGroup
          buttonPropsList={usableChartDefinitions.map(({ label, key }) => ({
            text: label,
            key,
            onClick: () => onFocusedMetricChange(key)
          }))}
          activeKey={focusedMetric}
        />
      </div>
      <ChartElement focusedMetric={focusedMetric} customChartRenderers={customChartRenderers} />
      <div className={locals.whitespace} />
    </div>
  );
}

function ChartElement({ focusedMetric, customChartRenderers }) {
  const customChartRenderer = find(customChartRenderers, renderer => renderer.key === focusedMetric);
  if (customChartRenderer) {
    return customChartRenderer.render();
  }
  return null;
}
