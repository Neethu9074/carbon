import React from 'react';

import { collectAllDataPointsAtTime } from 'in-components/Chart/data/dataSearchUtils';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getTimeShiftLabel, defaultTimeShift } from 'in-stores/time/shifting';
import { formatDateTime } from 'in-services/formatters/date';
import { aggregationLabels } from 'in-stores/metric/metric';

import locals from './TooltipContent.mless';

export default function TooltipContent({ timestamp, chart, reverseTooltipOrder, excludedLabelsFromTooltip }) {
  const dataPointsAtTime = collectAllDataPointsAtTime(chart.config, timestamp);

  return (
    <div className={locals.tooltipContent}>
      <div className={locals.heading}>
        {(chart.config.tooltipTimeFormatter ?? formatDateTime)(timestamp)}
        <span className={locals.rollupLabel}> ({chart.config.rollupLabel})</span>
      </div>

      <MetricSeries
        config={chart.config}
        axisName="y1"
        dataPointsAtTime={dataPointsAtTime}
        reverseTooltipOrder={reverseTooltipOrder}
        excludedLabelsFromTooltip={excludedLabelsFromTooltip}
      />
      <MetricSeries
        config={chart.config}
        axisName="y2"
        dataPointsAtTime={dataPointsAtTime}
        reverseTooltipOrder={reverseTooltipOrder}
        excludedLabelsFromTooltip={excludedLabelsFromTooltip}
      />
    </div>
  );
}

function MetricSeries({ config, axisName, dataPointsAtTime, reverseTooltipOrder, excludedLabelsFromTooltip = [] }) {
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
      if (config.isFiltered(axisName, i) || excludedLabelsFromTooltip.includes(label)) {
        return null;
      }
      const dataPointsForAxis = dataPointsAtTime[axisName];
      const dataPoint = dataPointsForAxis ? dataPointsForAxis[i] : null;
      const aggregations = axis.aggregations || [];
      const aggregation = aggregations[i];
      const timeShift = (axis.timeShifts && axis.timeShifts[i]) || defaultTimeShift;

      const notes = [];
      if (timeShift.offset !== 0) {
        notes.push(getTimeShiftLabel(timeShift).toLowerCase());
      }
      if (aggregation) {
        notes.push(aggregationLabels[aggregation]);
      }

      return (
        <li key={i} className={locals.metricValue}>
          <div className={locals.entry}>
            <div
              style={{ background: axis.colors100[i] }}
              className={config.legendColorIndicatorShape === 'rect' ? locals.rect : locals.dot}
            />
            <span className={locals.label}>{label}</span>
            {notes.length > 0 && <span className={locals.aggregation}>({notes.join(', ')})</span>}
          </div>
          <span className={locals.value}>
            {dataPoint
              ? axis.tooltipFormatter
                ? axis.tooltipFormatter(dataPoint[1])
                : axis.formatter[i].detailed(dataPoint[1])
              : valueMissingPlaceholder}
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
