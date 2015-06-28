'use strict';

import React from 'react/addons';

import StackedAreaRenderer from './render/StackedAreaRenderer';

import './Chart.less';

const rpt = React.PropTypes;

const Chart = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    config: rpt.object.isRequired
  },

  render() {
    return (
      <div></div>
    );
  },

  componentDidMount() {
    const container = React.findDOMNode(this);
    this.props.config.container = container;
    this.chart = new StackedAreaRenderer(this.props.config);

    this.props.config.seriesConfig.forEach((seriesConfig, seriesIndex) => {
      for (let i = 0; i <= this.props.config.windowSize; i++) {
        this.chart.addDataPoint(seriesIndex, {
          x: i,
          y: Math.random()
        });
      }

      let iterationCount = 1;
      setInterval(() => {
        this.chart.addDataPoint(seriesIndex, {
          x: this.props.config.windowSize + iterationCount++,
          y: Math.random()
        });
      }, 1000);
    });

    this.chart.start();
  },

  componentWillUnmount() {
    this.chart.dispose();
  }
});

export default Chart;
