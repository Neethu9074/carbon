'use strict';

import React from 'react/addons';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import StackedAreaRenderer from './render/StackedAreaRenderer';
import LineRenderer from './render/LineRenderer';

import './Chart.less';

const rpt = React.PropTypes;

const Chart = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    type: rpt.string.isRequired,

    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    margins: rpt.object.isRequired,

    seriesConfig: rpt.array.isRequired,
    datasources: rpt.array.isRequired,
    windowSize: rpt.number.isRequired
  },

  render() {
    return (<div></div>);
  },

  componentDidMount() {
    const config = {
      container: React.findDOMNode(this),
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins || {
        top: 10,
        right: 0,
        bottom: 50,
        left: 40
      },
      seriesConfig: this.props.seriesConfig,
      windowSize: this.props.windowSize
    };

    let Renderer;
    if (this.props.type === 'line') {
      Renderer = LineRenderer;
    } else if (this.props.type === 'stackedArea') {
      Renderer = StackedAreaRenderer;
    } else {
      throw new Error('Unknown chart type' + this.props.type);
    }

    this.started = false;
    this.chart = new Renderer(config);

    this.props.datasources.forEach((datasource, seriesIndex) => {
      const subscription = datasource.subscribe(newData => {
        for (let i = 0, len = newData.length; i < len; i++) {
          const rawNewDataPoint = newData[i];
          const dataPoint = {
            x: rawNewDataPoint[0],
            y: rawNewDataPoint[1]
          };
          this.chart.addDataPoint(seriesIndex, dataPoint);
        }
      });

      this.addSubscription(subscription);
    });

    this.chart.start();
  },

  componentWillUnmount() {
    this.chart.dispose();
  }
});

export default Chart;
