/* eslint-disable react/no-multi-comp */
import { withState } from 'recompose';
import React from 'react';

import VerticalAxisPlaceholder from 'in-new-components/Axis/VerticalAxisPlaceholder';
import MetricAwareAxis from 'in-components/Chart/components/MetricAwareAxis';
import HorizontalTimeAxis from 'in-new-components/Axis/HorizontalTimeAxis';
import NoContentIcon from 'in-components/Chart/components/NoContentIcon';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Tooltip from 'in-components/Chart/components/Tooltip';
import Legend from 'in-components/Chart/components/Legend';
import { getSetting$ } from 'in-services/settings';
import Chart from 'in-components/Chart/Chart';
import connectTo from 'in-hoc/connectTo';

import locals from './Chart.mless';

export default getElementDimensions(function ChartReactComponent(props) {
  let { timeframe, y1, width, customHeight } = props;
  const height = customHeight || 160;

  let content;
  if (!timeframe || !y1 || !y1.metrics) {
    content = <NoContentIcon width={width} height={height} />;
  } else {
    content = <ChartReactWrapper {...props} width={width - 100} height={height} />;
  }
  return <div className={locals.wrapper}>{content}</div>;
});

const enhance = withState('chart', 'setChart', null);
const ChartReactWrapper = enhance(
  connectTo(
    {
      devicePixelRatio: getSetting$('charts_adaptToDevicePixelRatio')
        .map(adaptToDevicePixelRatio => (adaptToDevicePixelRatio ? window.devicePixelRatio : 1))
        .distinct()
        .startWith(window.devicePixelRatio || 1)
    },
    class ChartReactWrapper extends React.Component {
      static displayName = 'ChartReactWrapper';

      componentDidMount() {
        const chart = new Chart(this.canvas);
        chart.update(this.props);
        this.props.setChart(chart);
      }

      componentWillUpdate(nextProps) {
        nextProps.chart.update(nextProps);
      }

      componentWillUnmount() {
        this.props.chart.dispose();
      }

      render() {
        const { chart, height, width, timeframe } = this.props;

        return (
          <div className={locals.chart}>
            {chart && <Legend chart={chart} />}
            {chart && <Tooltip chart={chart} />}
            <div className={locals.chartAxisWrapper}>
              {chart &&
                chart.config.y1 && (
                  <MetricAwareAxis chart={chart} axis={chart.config.y1} height={height} align="left" />
                )}
              <div>
                <canvas
                  className={locals.canvas}
                  ref={canvas => {
                    this.canvas = canvas;
                  }}
                />
                {width && (
                  <HorizontalTimeAxis
                    scale={{ from: timeframe.to - timeframe.windowSize, to: timeframe.to }}
                    width={width}
                  />
                )}
              </div>
              {chart &&
                chart.config.y2 && (
                  <MetricAwareAxis chart={chart} axis={chart.config.y2} height={height} align="right" />
                )}
              {chart && !chart.config.y2 && <VerticalAxisPlaceholder />}
            </div>
          </div>
        );
      }
    }
  )
);
