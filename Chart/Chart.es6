'use strict';

import React from 'react/addons';

import StackedAreaRenderer from './render/StackedAreaRenderer';

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
      for (let i = 0; i < 10; i++) {
        this.chart.addDataPoint(seriesIndex, {
          x: i,
          y: (i + 1) * seriesIndex
        });
      }
    });

    this.chart.start();
  }
});

export default Chart;
