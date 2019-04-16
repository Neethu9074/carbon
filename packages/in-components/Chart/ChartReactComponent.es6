/* eslint-disable react/no-multi-comp */
import { withState, compose } from 'recompose';
import React from 'react';

import MetricAwareAxis from 'in-components/Chart/components/MetricAwareAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Tooltip from 'in-components/Chart/components/Tooltip';
import { WIDTH } from 'in-new-components/Axis/VerticalAxis';
import Legend from 'in-components/Chart/components/Legend';
import { getSetting$ } from 'in-services/settings';
import Chart from 'in-components/Chart/Chart';
import connectTo from 'in-hoc/connectTo';

import locals from './Chart.mless';

export default getElementDimensions(function ChartReactComponent(props) {
  let { width, customHeight } = props;
  const height = customHeight || 160;

  return (
    <div className={locals.wrapper}>
      <ChartReactWrapper {...props} width={width - 2 * WIDTH} height={height} />
    </div>
  );
});

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

    componentWillUpdate(nextProps) {
      nextProps.chart.update(nextProps);
    }

    componentWillUnmount() {
      this.props.chart.dispose();
    }

    render() {
      const { chart, width, height, timeConfig, renderLegend = true, reverseTooltipOrder } = this.props;

      return (
        <div className={locals.chart}>
          {chart && renderLegend && <Legend chart={chart} />}
          <div className={locals.chartAxisWrapper}>
            {chart &&
              chart.config.y1 && (
                <MetricAwareAxis
                  chart={chart}
                  axis={chart.config.y1}
                  height={height - chart.config.timeAxisHeight}
                  align="left"
                />
              )}
            <div>
              {chart &&
                width && (
                  <Tooltip
                    width={width}
                    timeConfig={timeConfig}
                    chart={chart}
                    reverseTooltipOrder={reverseTooltipOrder}
                    metrics={this.props}
                  />
                )}
              <canvas
                className={locals.canvas}
                ref={canvas => {
                  this.canvas = canvas;
                }}
              />
            </div>
            {chart &&
              chart.config.y2 && (
                <MetricAwareAxis
                  chart={chart}
                  axis={chart.config.y2}
                  height={height - chart.config.timeAxisHeight}
                  align="right"
                />
              )}
          </div>
        </div>
      );
    }
  }
);
