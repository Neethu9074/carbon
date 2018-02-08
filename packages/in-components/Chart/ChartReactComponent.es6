/* eslint-disable react/no-multi-comp */
import { withState } from 'recompose';
import React from 'react';

import NoContentIcon from 'in-components/Chart/components/NoContentIcon';
import Tooltip from 'in-components/Chart/components/Tooltip';
import Legend from 'in-components/Chart/components/Legend';
import { getSetting$ } from 'in-services/settings';
import Chart from 'in-components/Chart/Chart';
import connectTo from 'in-hoc/connectTo';

import locals from './Chart.mless';

export default class ChartReactComponent extends React.Component {
  static displayName = 'ChartReactComponent';

  static defaultProps = {
    height: 140,
    width: 500
  };

  render() {
    const { timeframe, y1, width, height } = this.props;
    if (!timeframe || !y1 || !y1.metrics) {
      return <NoContentIcon width={width} height={height} />;
    }
    return <ChartReactWrapper {...this.props} />;
  }
}

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
        const { chart } = this.props;

        return (
          <div className={locals.chart}>
            {chart ? <Legend chart={this.props.chart} /> : null}
            {chart ? <Tooltip chart={this.props.chart} /> : null}
            <canvas
              className={locals.canvas}
              ref={canvas => {
                this.canvas = canvas;
              }}
            />
          </div>
        );
      }
    }
  )
);
