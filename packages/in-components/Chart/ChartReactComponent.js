/* eslint-disable react/no-multi-comp */
import { withState, compose } from 'recompose';
import React from 'react';

import ExternallyDefinedWidthAndHeight from 'in-new-components/layout/ExternallyDefinedWidthAndHeight';
import Legend, { HEIGHT as legendHeight } from 'in-components/Chart/components/Legend';
import MetricAwareAxis from 'in-components/Chart/components/MetricAwareAxis';
import ChartOverlay from 'in-components/Chart/components/ChartOverlay';
import getElementDimensions from 'in-hoc/getElementDimensions';
import evaluateClassNames from 'in-services/util/classnames';
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

    state = {
      overflowHidden: false
    };

    componentDidMount() {
      const chart = new Chart(this.canvas, this.props);
      this.props.setChart(chart);
    }

    UNSAFE_componentWillUpdate(nextProps) {
      nextProps.chart.update(nextProps);
    }

    componentWillUnmount() {
      if (this.props.chart) {
        this.props.chart.dispose();
      }
    }

    render() {
      const {
        chart,
        width,
        height,
        timeConfig,
        renderLegend = true,
        reverseTooltipOrder,
        renderPostChartContent,
        renderPreChartContent
      } = this.props;
      const heightOfDrawableCanvas = chart ? height - chart.config.timeAxisHeight - chart.config.markerPaneHeight : 0;

      const preAndPostContentConfig = {
        timeConfig: this.props.timeConfig.autoRefresh
          ? this.props.originalTimeConfig ?? this.props.timeConfig
          : this.props.timeConfig, // for non live mode we need the chart-time-config.
        granularity: this.props.chart?.config?.rollup,
        chartBucketWidth: chart?.renderScheduler
          ?.getRenderProps()
          ?.xScaleBackBuffer?.getRangeArea(chart?.config?.rollup),
        chartWidth: width,
        chartHeight: height,
        timeAxisHeight: chart?.config?.timeAxisHeight,
        markerPaneHeight: chart?.config?.markerPaneHeight
      };

      return (
        <div className={locals.chart} ref={chartWrapper => (this.chartWrapper = chartWrapper)}>
          {chart && renderLegend && <Legend chart={chart} />}

          <HighlightOverlayWrapper overflowHidden={this.state.overflowHidden}>
            {renderPreChartContent && (
              <div {...enhanceWithHoverActions(this)}>
                {renderPreChartContent({
                  ...preAndPostContentConfig,
                  chartContentPosition: 'pre'
                })}
              </div>
            )}
            <div className={locals.chartAxisWrapper}>
              {chart && chart.config.y1 && (
                <MetricAwareAxis chart={chart} axisName="y1" height={heightOfDrawableCanvas} align="left" />
              )}
              <>
                {chart && width && (
                  <ChartOverlay
                    width={width}
                    timeConfig={timeConfig}
                    chart={chart}
                    chartWrapper={this.chartWrapper}
                    reverseTooltipOrder={reverseTooltipOrder}
                    metrics={this.props}
                    nonInteractive={this.props.nonInteractive}
                  />
                )}
                <canvas className={locals.canvas} ref={canvas => (this.canvas = canvas)} />
              </>
              {chart && chart.config.y2 && (
                <MetricAwareAxis chart={chart} axisName="y2" height={heightOfDrawableCanvas} align="right" />
              )}
            </div>
            {renderPostChartContent && (
              <span {...enhanceWithHoverActions(this)}>
                {renderPostChartContent({
                  ...preAndPostContentConfig,
                  chartContentPosition: 'post'
                })}
              </span>
            )}
          </HighlightOverlayWrapper>
        </div>
      );
    }
  }
);

function enhanceWithHoverActions(context) {
  return {
    onMouseEnter: () => context.setState({ overflowHidden: true }),
    onMouseLeave: () => context.setState({ overflowHidden: false })
  };
}

function HighlightOverlayWrapper({ children, overflowHidden }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.markerLanesWrapper]: true,
        [locals.overflowHidden]: overflowHidden
      })}
    >
      {children}
    </div>
  );
}
