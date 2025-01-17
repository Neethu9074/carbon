/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useRef, useState } from 'react';

import { create } from '@instana/observables';

// @ts-expect-error
import HistogramChartOverlay from 'in-components/HistogramChart/components/HistogramChartOverlay/HistogramChartOverlay';
import {
  getMaxCallCount,
  getHistogramHeaderTitle
} from 'in-components/HistogramChart/components/HistogramChartPresenter/utils';
import UnavailableData from 'in-components/HistogramChart/components/HistogramChartPresenter/components/UnavailableData';
import HorizontalLines from 'in-components/HistogramChart/components/HistogramChartPresenter/components/HorizontalLines';
import getHistogram from 'in-components/HistogramChart/components/HistogramChartPresenter/utils/getHistogram';
import HistogramBarChart from 'in-components/HistogramChart/components/HistogramBarChart/HistogramBarChart';
// @ts-expect-error
import { HEIGHT as horizontalAxisHeight } from 'in-components/Axis/HorizontalAxis';
import Error from 'in-components/HistogramChart/components/HistogramChartPresenter/components/Error';
import HorizontalAxis from 'in-components/HistogramChart/components/HorizontalAxis/HorizontalAxis';
// @ts-expect-error
import ChartLegend from 'in-components/Chart/components/ChartLegend';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import Tooltip from 'in-components/HistogramChart/components/Tooltip/Tooltip';
import VerticalAxis from 'in-components/Axis/VerticalAxis';
import { chartColors } from 'in-themes/chartColors';
import { t } from 'in-i18n';

import locals from 'in-components/HistogramChart/components/HistogramChartPresenter/HistogramChartPresenter.mless';

export default function HistogramChartPresenter({
  height = 200,
  width,
  config,
  customWidth,
  customHeight,
  showLegend = true,
  selectionAdjustable,
  selectionMenuItems,
  onSelectionChanged,
  result,
  selection,
  tooltipRef,
  renderWidgetNotSupportedIndicator
}) {
  const filteredDataSeriesRef = useRef(create());

  const filteredDataSeries$ = filteredDataSeriesRef.current;
  const [filteredDataSeries, setFilteredDataSeries] = useState(new Set([]));

  const chartHeightBase = customHeight || height;
  const chartHeight = chartHeightBase - horizontalAxisHeight;
  const chartWidth = customWidth || width;
  const isDataMissing = !width || !result;

  const {
    isBucketsEmpty,
    bucketWidth,
    bucketCenter,
    hasError,
    isLoading,
    buckets,
    total,
    min,
    max,
    formatter,
    formatterY,
    conversionFn
  } = getHistogram({
    result,
    chartWidth,
    formatter: config?.formatter,
    unit: config?.metricConfiguration?.unit
  });

  if (isDataMissing) {
    return <div style={{ height }} className={locals.histogram} />;
  }

  if (hasError) {
    return <Error />;
  }

  if (isLoading) {
    return <LoadingIndicator height={chartHeight} size="xxl" className={locals.container} />;
  }

  if (isBucketsEmpty) {
    return (
      <UnavailableData
        width={chartWidth}
        height={chartHeight}
        text={t('in-components:histogram.presenterLabelNoDataToDisplay')}
      />
    );
  }

  const toggleDataSeries = name => {
    setFilteredDataSeries(prevFilteredDataSeries => {
      const newFilteredDataSeries = new Set(prevFilteredDataSeries.keys());
      if (newFilteredDataSeries.has(name)) {
        newFilteredDataSeries.delete(name);
      } else {
        newFilteredDataSeries.add(name);
      }
      filteredDataSeries$.emit(newFilteredDataSeries);
      return newFilteredDataSeries;
    });
  };

  const metricName = getHistogramHeaderTitle({
    minHistogramValue: min,
    maxHistogramValue: max,
    applyFormatter: formatter,
    conversionFn,
    total
  });

  const chartConfig = {
    config: {
      y1: {
        labels: [metricName],
        metricIds: [metricName],
        colors100: chartColors.strokeColors100,
        timeShifts: [{ offset: 0 }],
        reverseOrder: false
      },
      toggleDataSeries: toggleDataSeries,
      filteredDataSeries$: filteredDataSeries$,
      isFiltered: (axis, index) => filteredDataSeries.has(`${axis}-${index}`)
    },
    renderScheduler: {
      forceRender: () => {}
    }
  };

  const enabledMetric = !filteredDataSeries.has('y1-0');

  // Height of the percentile marker strip which sits directly above the chart
  const percentileStripHeight = Math.floor(0.725 * 16 + 20);

  const maxCallCount = Math.max(enabledMetric ? getMaxCallCount(buckets) : 0);

  return (
    <>
      {showLegend && <ChartLegend chart={chartConfig} />}

      <div className={locals.container} style={{ width: chartWidth }}>
        {enabledMetric && (
          <VerticalAxis
            align="top"
            formatter={formatterY}
            scale={{ from: 0, to: maxCallCount }}
            height={chartHeight - percentileStripHeight}
            detailedFormatting={false}
            style={{
              marginTop: percentileStripHeight,
              backgroundColor: 'transparent',
              position: 'absolute',
              zIndex: 1
            }}
            tickLabelBackgroundColor={'transparent'}
          />
        )}

        <div style={{ height: chartHeight }}>
          <HistogramChartOverlay
            buckets={buckets}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
            height={chartHeight - percentileStripHeight}
            width={chartWidth}
            selectionMenuItems={selectionMenuItems}
            onSelectionChanged={onSelectionChanged}
            selectionAdjustable={selectionAdjustable}
            selection={selection}
            tooltipRef={tooltipRef}
            renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
            tooltipRenderer={{
              render: function TooltipRenderer({ from, to, style }) {
                return (
                  <Tooltip
                    metricBuckets={[buckets.slice(from, to)]}
                    config={chartConfig.config}
                    style={style}
                    formatterY={formatterY.compact}
                  />
                );
              }
            }}
          />

          <HistogramBarChart
            buckets={buckets}
            config={chartConfig.config}
            bucketWidth={bucketWidth}
            maxValue={maxCallCount}
            height={chartHeight - percentileStripHeight - 1}
            style={{ bottom: 0 }}
          />

          <HorizontalAxis buckets={buckets} bucketWidth={bucketWidth} />

          <HorizontalLines
            nbBars={4}
            height={chartHeight - percentileStripHeight}
            width={bucketWidth * buckets.length}
            style={{ marginTop: percentileStripHeight }}
          />
        </div>
      </div>
    </>
  );
}
