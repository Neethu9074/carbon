import React, { useState, useEffect } from 'react';
import { create } from 'reactive-observables';

import { collectAllDataPointsAtTime } from 'in-components/Chart/data/dataSearchUtils';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import EventSection from 'in-components/Chart/components/EventSection';
import { formatDateTime } from 'in-services/formatters/date';
import { aggregationLabels } from 'in-stores/metric/metric';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TooltipContent.mless';

export default function TooltipContent({
  timestamp,
  chart,
  reverseTooltipOrder,
  hoveredEvent,
  isHighlightedTimeframeHovered,
  excludedLabelsFromTooltip
}) {
  const [isHighlightedTimeframeHovered$] = useState(create());
  useEffect(
    () => {
      isHighlightedTimeframeHovered$.emit(isHighlightedTimeframeHovered);
    },
    [isHighlightedTimeframeHovered]
  );
  const dataPointsAtTime = collectAllDataPointsAtTime(chart.config, timestamp);

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

      <InteractionNotification isHighlightedTimeframeHovered$={isHighlightedTimeframeHovered$} />
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

class InteractionNotification extends React.Component {
  displayName = 'InteractionNotification';

  state = {};

  constructor(props) {
    super(props);
    this.isHighlightedTimeframeHoveredSubscription = props.isHighlightedTimeframeHovered$
      .debounce(100)
      .subscribe(isHovered => this.setState({ isHovered }));
  }

  componentWillUnmount() {
    if (this.isHighlightedTimeframeHoveredSubscription) {
      this.isHighlightedTimeframeHoveredSubscription.dispose();
      this.isHighlightedTimeframeHoveredSubscription = null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isHovered !== this.state.isHovered;
  }

  render() {
    if (!this.state.isHovered) {
      return null;
    }

    return (
      <div className={locals.infoSection}>
        <SvgIcon className={locals.infoIcon} type="lib_help_error_info_outline" size="xs" />
        You can right click for more options
      </div>
    );
  }
}
