import React from 'react';

import { collectAllDataPointsAtTime } from 'in-components/Chart/data/dataSearchUtils';
import { isInsideHighlightedTimeframe } from 'in-components/Chart/components/utils';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import EventSection from 'in-components/Chart/components/EventSection';
import { formatDateTime } from 'in-services/formatters/date';
import { aggregationLabels } from 'in-stores/metric/metric';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './TooltipContent.mless';

export default connectTo({ highlightedTimeframe: highlightedTimeframe$ }, function TooltipContent({
  timestamp,
  chart,
  reverseTooltipOrder,
  hoveredEvent,
  highlightedTimeframe,
  excludedLabelsFromTooltip
}) {
  const dataPointsAtTime = collectAllDataPointsAtTime(chart.config, timestamp);
  const isHighlightedTimeframeHovered = isInsideHighlightedTimeframe(timestamp, highlightedTimeframe);

  return (
    <div className={locals.tooltipContent}>
      <EventSection event={hoveredEvent} />

      <div className={locals.heading}>
        {formatDateTime(timestamp)}
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

      {isHighlightedTimeframeHovered && <InteractionNotification />}
    </div>
  );
});

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
      if (config.isLabelFiltered(label) || excludedLabelsFromTooltip.includes(label)) {
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

function InteractionNotification() {
  return (
    <div className={locals.infoSection}>
      <SvgIcon className={locals.infoIcon} type="lib_help_error_info_outline" size="xs" />
      You can right click for more options
    </div>
  );
}
