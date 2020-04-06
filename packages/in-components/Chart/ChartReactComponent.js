/* eslint-disable react/no-multi-comp */
import { withState, compose } from 'recompose';
import React from 'react';

import ExternallyDefinedWidthAndHeight from 'in-new-components/layout/ExternallyDefinedWidthAndHeight';
import MetricAwareAxis from 'in-components/Chart/components/MetricAwareAxis';
import ChartOverlay from 'in-components/Chart/components/ChartOverlay';
import Legend, { HEIGHT } from 'in-components/Chart/components/Legend';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { WIDTH } from 'in-new-components/Axis/VerticalAxis';
import { getSetting$ } from 'in-services/settings';
import Chart from 'in-components/Chart/Chart';
import connectTo from 'in-hoc/connectTo';

import locals from './Chart.mless';

export default function ChartReactComponent(props) {
  if (props.automaticallySize) {
    return <CompletelyAutomaticallySized {...props} />;
  }
  return <HorizontallyAutomaticallySized {...props} />;
}

const HorizontallyAutomaticallySized = getElementDimensions(function HorizontallyAutomaticallySizedChart(props) {
  return (
    <ChartReactWrapper {...props} width={props.width - (props.y2 ? 2 : 1) * WIDTH} height={props.customHeight || 182} />
  );
});

function CompletelyAutomaticallySized(props) {
  return (
    <ExternallyDefinedWidthAndHeight>
      {({ width, height }) => (
        <ChartReactWrapper {...props} width={width - (props.y2 ? 2 : 1) * WIDTH} height={height - HEIGHT} />
      )}
    </ExternallyDefinedWidthAndHeight>
  );
}

const ChartReactWrapper = compose(
  withState('chart', 'setChart', null),
  connectTo({
    devicePixelRatio: getSetting$('charts_adaptToDevicePixelRatio')
      .map(adaptToDevicePixelRatio => (adaptToDevicePixelRatio ? window.devicePixelRatio : 1))
      .distinct()
      .startWith(window.devicePixelRatio || 1)
  })
)(
  class ChartReactWrapper extends React.Component {
    static displayName = 'ChartReactWrapper';

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
        alignLegendToLeftSideOfChart
      } = this.props;

      const heightOfDrawableCanvas = chart ? height - chart.config.timeAxisHeight - chart.config.markerPaneHeight : 0;

      return (
        <div className={locals.chart} ref={chartWrapper => (this.chartWrapper = chartWrapper)}>
          {chart &&
            renderLegend && <Legend alignLegendToLeftSideOfChart={alignLegendToLeftSideOfChart} chart={chart} />}
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
        </div>
      );
    }
  }
);
