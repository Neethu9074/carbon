/* eslint-disable react/no-multi-comp */
import { withState, compose } from 'recompose';
import { create } from 'reactive-observables';
import React from 'react';

import ExternallyDefinedWidthAndHeight from 'in-new-components/layout/ExternallyDefinedWidthAndHeight';
import Legend, { HEIGHT as legendHeight } from 'in-components/Chart/components/Legend';
import MetricAwareAxis from 'in-components/Chart/components/MetricAwareAxis';
import ChartOverlay from 'in-components/Chart/components/ChartOverlay';
import { evaluateClassNames } from 'in-services/util/classnames';
import getElementDimensions from 'in-hoc/getElementDimensions';
import useObservable from 'in-hooks/useObservable';
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
      {({ width, height }) => <ChartReactWrapper {...props} width={width} height={height - legendHeight} />}
    </ExternallyDefinedWidthAndHeight>
  );
}

const ChartReactWrapper = compose(withState('chart', 'setChart', null))(
  class ChartReactWrapper extends React.Component {
    static displayName = 'ChartReactWrapper';

    componentDidMount() {
      const chart = new Chart(this.canvas, this.props);
      this.props.setChart(chart);
      this.onMarkerLaneItemHover$ = create().emit({});
    }

    UNSAFE_componentWillUpdate(nextProps) {
      nextProps.chart.update(nextProps);
    }

    componentWillUnmount() {
      if (this.props.chart) {
        this.props.chart.dispose();
      }
      this.onMarkerLaneItemHover$?.dispose?.();
    }

    render() {
      const { chart, width, height, timeConfig, renderLegend = true, reverseTooltipOrder } = this.props;
      const heightOfDrawableCanvas = chart ? height - chart.config.timeAxisHeight - chart.config.markerPaneHeight : 0;

      return (
        <div className={locals.chart} ref={chartWrapper => (this.chartWrapper = chartWrapper)}>
          {chart && renderLegend && <Legend chart={chart} />}
          {this.props.renderPreChartContent?.({
            timeConfig: this.props.originalTimeConfig ?? this.props.timeConfig,
            onHover: config => this.onMarkerLaneItemHover$.emit(config),
            onMarkerLaneItemHover$: this.onMarkerLaneItemHover$,
            granularity: this.props.chart?.config?.rollup,
            chartContentPosition: 'pre'
          })}
          <HighlightOverlayWrapper
            onMarkerLaneItemHover$={this.onMarkerLaneItemHover$}
            timeAxisHeight={chart?.config?.timeAxisHeight}
            markerPaneHeight={chart?.config?.markerPaneHeight}
          >
            <div className={locals.chartAxisWrapper}>
              {chart &&
                chart.config.y1 && (
                  <MetricAwareAxis chart={chart} axisName="y1" height={heightOfDrawableCanvas} align="left" />
                )}
              <>
                {chart &&
                  width && (
                    <ChartOverlay
                      width={width}
                      timeConfig={timeConfig}
                      chart={chart}
                      chartWrapper={this.chartWrapper}
                      reverseTooltipOrder={reverseTooltipOrder}
                      metrics={this.props}
                    />
                  )}
                <canvas className={locals.canvas} ref={canvas => (this.canvas = canvas)} />
              </>
              {chart &&
                chart.config.y2 && (
                  <MetricAwareAxis chart={chart} axisName="y2" height={heightOfDrawableCanvas} align="right" />
                )}
            </div>
          </HighlightOverlayWrapper>
          {this.props.renderPostChartContent?.({
            timeConfig: this.props.originalTimeConfig ?? this.props.timeConfig,
            onHover: config => this.onMarkerLaneItemHover$.emit(config),
            onMarkerLaneItemHover$: this.onMarkerLaneItemHover$,
            granularity: this.props.chart?.config?.rollup,
            chartContentPosition: 'post'
          })}
        </div>
      );
    }
  }
);

function HighlightOverlayWrapper({ children, onMarkerLaneItemHover$, timeAxisHeight, markerPaneHeight }) {
  const { overlayVisible, lineVisible, xPos, color, width, chartContentPosition } =
    useObservable(onMarkerLaneItemHover$?.map(config => config), [children]) ?? {};

  return (
    <div className={locals.markerLanesWrapper}>
      {children}
      {(overlayVisible || lineVisible) && (
        <div>
          <div
            className={evaluateClassNames({
              [locals.highlightClusterOverlayWrapper]: overlayVisible,
              [locals.highlightLineOverlayWrapper]: lineVisible
            })}
            style={{
              transform: `translateX(${getPosition()}px)`,
              width: overlayVisible ? `${width}px` : undefined,
              color,
              ...getTopAndBottomOffset()
            }}
          >
            <div
              style={{
                color
              }}
              className={evaluateClassNames({
                [locals.highlightOverlayPre]: overlayVisible && chartContentPosition === 'pre',
                [locals.highlightOverlayPost]: overlayVisible && chartContentPosition === 'post'
              })}
            />
          </div>
        </div>
      )}
    </div>
  );

  function getPosition() {
    if (overlayVisible) return xPos - width / 2;
    if (lineVisible) return xPos;
  }

  function getTopAndBottomOffset() {
    if (chartContentPosition === 'pre') return { bottom: timeAxisHeight, top: 0 };
    if (chartContentPosition === 'post') return { bottom: 0, top: markerPaneHeight };
  }
}
