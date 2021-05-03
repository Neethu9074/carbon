/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon } from '@instana/components';

import AggregationSymbol, { supportsAggregationIcon } from 'in-components/AggregationSymbol';
import { collectAllDataPointsAtTime } from 'in-components/Chart/data/dataSearchUtils';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getTimeShiftLabel, defaultTimeShift } from 'in-stores/time/shifting';
import { formatDateTime } from 'in-services/formatters/date';
import { Trans, t } from 'in-i18n';

import locals from './TooltipContent.mless';

const mountedTooltips = [];

const pixelsScrolledPerScrollStep = 8;
const expectedHeightOfFooterInPixels = 25;

export default function TooltipContent({
  width,
  chartHeight,
  timestamp,
  chart,
  reverseTooltipOrder,
  excludedLabelsFromTooltip
}) {
  const dataPointsAtTime = collectAllDataPointsAtTime(chart.config, timestamp);
  const scrollContainerRef = useRef();

  const [scrollable, setScrollable] = useState(false);
  // The state change triggered by this effect doesn't affect the scroll area's
  // dimensions and therefore doesn't need to have any dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    }

    const scrollablePixels = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
    setScrollable(scrollablePixels > 0);
    updateScrollbar(scrollContainerRef.current);
  });

  const maxWidthStyle = `calc(max(14.5rem, ${width * 0.5}px - 2rem))`;
  let widthStyle;
  if (width > 1300) {
    widthStyle = `calc(max(14.5rem, ${width * 0.3}px - 2rem))`;
  } else if (width > 1000) {
    widthStyle = `calc(max(14.5rem, ${width * 0.4}px - 2rem))`;
  } else {
    widthStyle = maxWidthStyle;
  }

  return (
    <div
      className={locals.tooltipContent}
      style={{
        maxWidthStyle: maxWidthStyle,
        width: widthStyle
      }}
    >
      <div className={locals.header}>
        {(chart.config.tooltipTimeFormatter ?? formatDateTime)(timestamp)}
        <span className={locals.rollupLabel}>
          {' '}
          –{' '}
          {t('in-components:chart.tooltip.rollup', {
            rollup: chart.config.rollupLabel
          })}
        </span>
      </div>

      <div
        className={locals.dataSeries}
        ref={onScrollWrapperRefChange}
        style={{
          maxHeight: `${chartHeight - (scrollable ? expectedHeightOfFooterInPixels : 0) - 10}px`
        }}
      >
        <div className={locals.scrollBar} />

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

      {scrollable && (
        <div className={locals.footer}>
          <Trans
            i18nKey="in-components:chart.tooltip.scrollHint"
            components={{
              upArrow: <Key icon="lib_arrow_short_up" />,
              downArrow: <Key icon="lib_arrow_short_down" />
            }}
          />
        </div>
      )}
    </div>
  );

  function onScrollWrapperRefChange(domNode) {
    const previousDomNode = scrollContainerRef.current;
    if (previousDomNode === domNode) {
      return;
    }

    if (previousDomNode) {
      const index = mountedTooltips.indexOf(previousDomNode);
      if (index >= 0) {
        mountedTooltips.splice(index, 1);
      }
      scrollContainerRef.current = null;
    }

    if (domNode) {
      scrollContainerRef.current = domNode;
      mountedTooltips.push(domNode);
    }
  }
}

TooltipContent.propTypes = {
  chart: PropTypes.shape({
    config: PropTypes.shape({
      rollupLabel: PropTypes.string,
      tooltipTimeFormatter: PropTypes.func
    })
  }).isRequired,
  chartHeight: PropTypes.number.isRequired,
  excludedLabelsFromTooltip: PropTypes.arrayOf(PropTypes.string),
  reverseTooltipOrder: PropTypes.any,
  timestamp: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

function MetricSeries({ config, axisName, dataPointsAtTime, reverseTooltipOrder, excludedLabelsFromTooltip = [] }) {
  const axis = config[axisName];
  if (!axis) {
    return null;
  }

  let labels = axis.labels;
  const aggregations = axis.aggregations || [];
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

      const aggregation = aggregations[i];
      const timeShift = axis.timeShifts?.[i] || defaultTimeShift;

      return (
        <li key={i} className={locals.entry}>
          <div
            style={{ background: axis.colors100[i] }}
            className={config.legendColorIndicatorShape === 'rect' ? locals.rect : locals.dot}
          />

          <span className={locals.label}>
            {label}
            {timeShift.offset !== 0 && <span className={locals.timeShift}>{` (${getTimeShiftLabel(timeShift)})`}</span>}
          </span>

          {aggregation && (
            <span
              className={classNames(locals.aggregation, {
                [locals.aggregationIcon]: supportsAggregationIcon(aggregation)
              })}
            >
              <AggregationSymbol aggregation={aggregation} />
            </span>
          )}

          <span className={locals.value}>
            {dataPoint ? (axis.tooltipFormatter || axis.formatter[i].detailed)(dataPoint[1]) : valueMissingPlaceholder}
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
    <ul className={locals.entries}>
      {items}
      {restrictItems && (
        <span>
          {t('in-components:chart.tooltip.more', {
            number: axis.labels.length - config.restrictTooltipItemsTo
          })}
        </span>
      )}
    </ul>
  );
}

export function onScrollUp() {
  return modifyScrollStep(-1);
}

export function onScrollDown() {
  return modifyScrollStep(1);
}

function modifyScrollStep(change) {
  let scrollChangesPossibleViaKeyboard = false;
  for (const scrollWrapper of mountedTooltips) {
    scrollChangesPossibleViaKeyboard =
      modifyScrollStepForNode(change, scrollWrapper) || scrollChangesPossibleViaKeyboard;
  }
  return scrollChangesPossibleViaKeyboard;
}

function modifyScrollStepForNode(change, scrollWrapper) {
  const scrollablePixels = scrollWrapper.scrollHeight - scrollWrapper.clientHeight;
  const currentScrollPosition = scrollWrapper.scrollTop;
  const nextScrollPosition = Math.max(
    0,
    Math.min(scrollablePixels, currentScrollPosition + change * pixelsScrolledPerScrollStep)
  );
  if (currentScrollPosition !== nextScrollPosition) {
    scrollWrapper.scrollTop = nextScrollPosition;
  }
  updateScrollbar(scrollWrapper);
  return scrollablePixels > 0;
}

function updateScrollbar(scrollWrapper) {
  const scrollBar = scrollWrapper.querySelector(`.${locals.scrollBar}`);
  const scrollablePixels = scrollWrapper.scrollHeight - scrollWrapper.clientHeight;
  const currentScrollPosition = scrollWrapper.scrollTop;
  const scrollBarHeight = (scrollWrapper.clientHeight / scrollWrapper.scrollHeight) * scrollWrapper.clientHeight;
  const scrollBarPosition =
    currentScrollPosition + (currentScrollPosition / scrollWrapper.scrollHeight) * scrollWrapper.clientHeight;

  if (scrollablePixels > 0) {
    scrollBar.style.display = 'block';
    scrollBar.style.top = `${scrollBarPosition}px`;
    scrollBar.style.height = `${scrollBarHeight}px`;
  } else {
    scrollBar.style.display = 'none';
  }
}

function Key({ icon }) {
  return <SvgIcon type={icon} className={locals.key} size="xxs" />;
}

Key.propTypes = {
  icon: PropTypes.string.isRequired
};
