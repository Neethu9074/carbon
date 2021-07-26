/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';

import ExternallyDefinedWidthAndHeight from 'in-components/layout/ExternallyDefinedWidthAndHeight';
import { HEIGHT as commonLegendHeight } from 'in-components/Chart/components/Legend';
import MetricAwareAxis from 'in-components/Chart/components/MetricAwareAxis';
import ChartOverlay from 'in-components/Chart/components/ChartOverlay';
import ChartLegend from 'in-components/Chart/components/ChartLegend';
import getElementDimensions from 'in-hoc/getElementDimensions';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Chart from 'in-components/Chart/Chart';

import locals from './Chart.mless';

const defaultChartHeight = 182;
export default function ChartReactComponent(props) {
  if (props.automaticallySize) {
    return <CompletelyAutomaticallySized {...props} />;
  }
  return <HorizontallyAutomaticallySized {...props} />;
}

const HorizontallyAutomaticallySized = getElementDimensions(function HorizontallyAutomaticallySizedChart(props) {
  return <ChartReactWrapper {...props} width={props.width} height={props.customHeight || defaultChartHeight} />;
});

function CompletelyAutomaticallySized(props) {
  return (
    <ExternallyDefinedWidthAndHeight>
      {({ width, height }) => <ChartReactWrapper {...props} width={width} height={height} />}
    </ExternallyDefinedWidthAndHeight>
  );
}

function ChartReactWrapper(props) {
  const {
    width,
    height: heightOfWrapper,
    timeConfig,
    originalTimeConfig,
    renderLegend = true,
    reverseTooltipOrder,
    renderPostChartContent,
    renderPreChartContent,
    nonInteractive,
    automaticallySize
  } = props;

  const [preAndPostContentConfig, setPreAndPostContentConfig] = useState();

  const { ref: legendRef, height: calculatedLegendHeight } = useResizeObserver();
  const { ref: preContentRef, height: calculatedPreContentHeight = 0 } = useResizeObserver();
  const { ref: postContentRef, height: calculatedPostContentHeight = 0 } = useResizeObserver();

  const actualLegendHeight = calculatedLegendHeight ?? commonLegendHeight;

  let chartHeight = heightOfWrapper - actualLegendHeight;

  if (automaticallySize) {
    chartHeight = chartHeight - calculatedPreContentHeight - calculatedPostContentHeight;
  }

  const chartProps = {
    ...props,
    height: chartHeight
  };

  const chartWrapperRef = useRef();
  const [chart, setChart] = useState();
  const canvasRefSetter = canvas => {
    // Check that the canvas domElement != null. As part of the React lifecycle canvas
    // would rotate constantly between the DOM element and null and our setState call
    // would then causing an infinite update loop.
    if (canvas && canvas !== chart?.canvas) {
      chart?.dispose();
      setChart(new Chart(canvas, chartProps));
    }
  };

  // We always need to execute this to force-update the chart (which has its own efficient
  // change identification).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    chart?.update(chartProps);

    // We need to align the behavior of the pre-/post- content to some Chart configuration
    // that depends on the props. Therefore, we need to update the preAndPostContentConfig
    // only after the chart has been updated with the latest props.
    const nextPreAndPostContentConfig = {
      // for non live mode we need the chart-time-config.
      timeConfig: timeConfig.autoRefresh ? originalTimeConfig ?? timeConfig : timeConfig,
      granularity: chart?.config?.rollup,
      chartBucketWidth: chart?.renderScheduler?.getRenderProps()?.xScaleBackBuffer?.getRangeArea(chart?.config?.rollup),
      chartWidth: width,
      chartHeight,
      timeAxisHeight: chart?.config?.timeAxisHeight,
      markerPaneHeight: chart?.config?.markerPaneHeight
    };
    if (!isEqual(nextPreAndPostContentConfig, preAndPostContentConfig)) {
      setPreAndPostContentConfig(nextPreAndPostContentConfig);
    }
  });

  // We need to execute a dispose call when the chart changes. This is already handled within
  // canvasRefSetter. With this effect we only want to handle unmounting of the component.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => chart?.dispose(), []);

  const heightOfDrawableCanvas = chart ? chartHeight - chart.config.timeAxisHeight - chart.config.markerPaneHeight : 0;

  return (
    <div className={locals.chart} ref={chartWrapperRef}>
      <div ref={legendRef}>
        {chart && renderLegend && <ChartLegend chart={chart} filteredDataSeries={chart.config.filteredDataSeries} />}
      </div>

      <div className={locals.markerLanesWrapper}>
        {typeof renderPreChartContent === 'function' && (
          <div ref={preContentRef}>
            {preAndPostContentConfig &&
              renderPreChartContent({
                ...preAndPostContentConfig,
                chartContentPosition: 'pre'
              })}
          </div>
        )}

        <div className={locals.chartAxisWrapper}>
          {chart?.config.y1 && (
            <MetricAwareAxis chart={chart} axisName="y1" height={heightOfDrawableCanvas} align="left" />
          )}

          {chart && width && (
            <ChartOverlay
              width={width}
              chartHeight={chartHeight}
              timeConfig={timeConfig}
              chart={chart}
              chartWrapper={chartWrapperRef.current}
              reverseTooltipOrder={reverseTooltipOrder}
              metrics={props}
              nonInteractive={nonInteractive}
            />
          )}
          <canvas className={locals.canvas} ref={canvasRefSetter} />

          {chart?.config.y2 && (
            <MetricAwareAxis chart={chart} axisName="y2" height={heightOfDrawableCanvas} align="right" />
          )}
        </div>
        {typeof renderPostChartContent === 'function' && (
          <div ref={postContentRef}>
            {preAndPostContentConfig &&
              renderPostChartContent({
                ...preAndPostContentConfig,
                chartContentPosition: 'post'
              })}
          </div>
        )}
      </div>
    </div>
  );
}
