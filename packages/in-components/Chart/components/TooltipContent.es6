import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { aggregationLabels } from 'in-stores/metric/metric';

import locals from './TooltipContent.mless';

export default function TooltipContent({ timestamp, chart, reverseTooltipOrder }) {
  const dataPointsAtTime = chart.collectAllDataPointsAtTime(timestamp);

  return (
    <div className={locals.tooltipContent}>
      <div className={locals.heading}>
        {formatDateTime(timestamp)}
        <span className={locals.rollupLabel}> ({chart.config.rollupLabel})</span>
      </div>
      <MetricSeries
        config={chart.config}
        axisName="y1"
        dataPointsAtTime={dataPointsAtTime}
        reverseTooltipOrder={reverseTooltipOrder}
      />
      <MetricSeries
        config={chart.config}
        axisName="y2"
        dataPointsAtTime={dataPointsAtTime}
        reverseTooltipOrder={reverseTooltipOrder}
      />
    </div>
  );
}

function MetricSeries({ config, axisName, dataPointsAtTime, reverseTooltipOrder }) {
  const axis = config[axisName];
  if (!axis) {
    return null;
  }

  let labels = axis.labels;
  const restrictItems = config.restrictTooltipItemsTo && labels.length > config.restrictTooltipItemsTo;
  if (restrictItems) {
    labels = labels.slice(0, config.restrictTooltipItemsTo);
  }

  const items = labels
    .map((label, i) => {
      if (config.filteredDataSeries.has(label)) {
        return null;
      }
      const dataPointsForAxis = dataPointsAtTime[axisName];
      const dataPoint = dataPointsForAxis ? dataPointsForAxis[label] : null;
      const aggregations = axis.aggregations || [];
      const aggregation = aggregations[i];

      return (
        <li key={label} className={locals.metricValue}>
          <div className={locals.entry}>
            <div
              style={{ background: axis.colors100[i] }}
              className={config.legendColorIndicatorShape === 'rect' ? locals.rect : locals.dot}
            />
            <span className={locals.label}>{label}</span>
            <span className={locals.aggregation}>{aggregation && `(${aggregationLabels[aggregation]})`}</span>
          </div>
          <span className={locals.value}>
            {dataPoint
              ? axis.tooltipFormatter
                ? axis.tooltipFormatter(dataPoint[1])
                : axis.formatter[i].detailed(dataPoint[1])
              : '--'}
          </span>
        </li>
      );
    })
    .filter(Boolean);

  if (items.length < 1) {
    return null;
  }

  if (reverseTooltipOrder) {
    items.reverse();
  }

  return (
    <ul className={locals.tooltipMetricList}>
      {items}
      {restrictItems && <span>{`${axis.labels.length - config.restrictTooltipItemsTo} more`}</span>}
    </ul>
  );
}
