/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';

import { create } from '@instana/observables';

// @ts-expect-error needs ts migration
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { useCustomDashboardContext } from 'in-custom-dashboards/CustomDashboard/CustomDashboardContext';
import ExternallyDefinedWidthAndHeight from 'in-components/layout/ExternallyDefinedWidthAndHeight';
import { HEIGHT as commonLegendHeight } from 'in-components/Chart/components/Legend';
import { ChartTableComponent } from 'in-components/Chart/ChartTableComponent';
import MetricAwareAxis from 'in-components/Chart/components/MetricAwareAxis';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import usePdfExport from 'in-components/DownloadPdf/hooks/usePdfExport';
import ChartOverlay from 'in-components/Chart/components/ChartOverlay';
import ChartLegend from 'in-components/Chart/components/ChartLegend';
import useResizeObserver from 'in-hooks/useResizeObserver';
import { compositeRef } from 'in-services/util/react';
import Chart from 'in-components/Chart/Chart';

import locals from './Chart.mless';

const defaultChartHeight = 182;
export default function ChartReactComponent(props) {
  if (props.automaticallySize) {
    return <CompletelyAutomaticallySized {...props} />;
  }
  return <HorizontallyAutomaticallySized {...props} />;
}

const HorizontallyAutomaticallySized = function HorizontallyAutomaticallySizedChart(props) {
  const { ref, width } = useResizeObserver();
  return <ChartReactWrapper ref={ref} {...props} width={width} height={props.customHeight || defaultChartHeight} />;
};

function CompletelyAutomaticallySized(props) {
  return (
    <ExternallyDefinedWidthAndHeight>
      {({ width, height }) => <ChartReactWrapper {...props} width={width} height={height} />}
    </ExternallyDefinedWidthAndHeight>
  );
}
const isHighlightedOnDisabledChart$ = create();

const ChartReactWrapper = React.forwardRef(function ChartReactWrapper(props, outerRef) {
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
    automaticallySize,
    wiggleRoom,
    customChartSkeletonHeight,
    disableChartInLive,
    snapshotId,
    snapshotHostFqdn,
    hasActionlane = false,
    hasButtonInActionslane = true,
    onLegendItemToggle,
    facets,
    formModel,
    tableCloseHandler = false, // execute a function when the table closes
    tableOpen = false // control table opening / closing
  } = props;

  const { PdfExportRenderer } = usePdfExport();
  const { exportWidgetToPdf } = useCustomDashboardContext();

  const [preAndPostContentConfig, setPreAndPostContentConfig] = useState();

  const { ref: legendRef, height: calculatedLegendHeight } = useResizeObserver();
  const { ref: preContentRef, height: calculatedPreContentHeight = 0 } = useResizeObserver();
  const { ref: postContentRef, height: calculatedPostContentHeight = 0 } = useResizeObserver();

  const { matchLocation } = useNavigation();

  const actualLegendHeight = calculatedLegendHeight ?? commonLegendHeight;
  let chartHeight = heightOfWrapper - actualLegendHeight;

  if (automaticallySize) {
    chartHeight = chartHeight - calculatedPreContentHeight - calculatedPostContentHeight;
  }

  const chartProps = {
    ...props,
    height: chartHeight,
    isHighlightedOnDisabledChart$: isHighlightedOnDisabledChart$
  };

  const chartWrapperRef = useRef();
  const [chart, setChart] = useState();
  const [openTableView, setOpenTableView] = useState(false);

  const canvasRefSetter = canvas => {
    // Check that the canvas domElement != null. As part of the React lifecycle canvas
    // would rotate constantly between the DOM element and null and our setState call
    // would then causing an infinite update loop.
    if (canvas && canvas !== chart?.canvas && width) {
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
      markerPaneHeight: chart?.config?.markerPaneHeight,
      snapshotId: snapshotId || chart?.config?.snapshotId,
      snapshotHostFqdn: snapshotHostFqdn || chart?.config?.snapshotHostFqdn,
      //props for actions lane
      hasActionlane: hasActionlane,
      hasButtonInActionslane: hasButtonInActionslane
    };
    if (!isEqual(nextPreAndPostContentConfig, preAndPostContentConfig)) {
      setPreAndPostContentConfig(nextPreAndPostContentConfig);
    }
  });

  // With this effect we only want to handle to properly dispose the chart when unmounting the component.
  // The handling of disposing the chart when it changes is handled within canvasRefSetter above.
  useEffect(() => () => chart?.dispose(), [chart]);

  const heightOfDrawableCanvas = chart ? chartHeight - chart.config.timeAxisHeight - chart.config.markerPaneHeight : 0;

  // If there are labels and metrics we can show the table
  const canHaveTable =
    (chart?.config?.y1?.labels && chart?.config?.y1?.metrics) ||
    (chart?.config?.y2?.labels && chart?.config?.y2?.metrics);

  return (
    <div className={locals.fullWidth}>
      {canHaveTable && (openTableView || tableOpen) && (
        <ChartTableComponent
          chart={chart}
          openTableView={openTableView || tableOpen}
          setOpenTableView={setOpenTableView}
          tableCloseHandler={tableCloseHandler}
        />
      )}
      <div
        className={locals.chart}
        ref={compositeRef(outerRef, chartWrapperRef)}
        style={{ height: customChartSkeletonHeight ?? 'auto' }}
      >
        <div ref={legendRef}>
          {chart && renderLegend && (
            <ChartLegend
              facets={facets}
              formModel={formModel}
              chart={chart}
              filteredDataSeries={chart.config.filteredDataSeries}
              onLegendItemToggle={onLegendItemToggle}
              chartWrapper={chartWrapperRef.current}
              reverseTooltipOrder={reverseTooltipOrder}
              metrics={props}
              nonInteractive={nonInteractive}
              wiggleRoom={wiggleRoom}
              disableChartInLive={disableChartInLive}
              isCustomDashboard={matchLocation(customDashboardsPath)}
              isHighlightedOnDisabledChart$={isHighlightedOnDisabledChart$}
            />
          )}
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
                wiggleRoom={wiggleRoom}
                disableChartInLive={disableChartInLive}
                isCustomDashboard={matchLocation(customDashboardsPath)}
                exportWidgetToPdf={exportWidgetToPdf}
                isHighlightedOnDisabledChart$={isHighlightedOnDisabledChart$}
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
                  chartContentPosition: 'post',
                  displayReleaseLane: automaticallySize
                })}
            </div>
          )}
          {PdfExportRenderer}
        </div>
      </div>
    </div>
  );
});
