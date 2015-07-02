'use strict';

import React from 'react/addons';
import _ from 'lodash';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import * as stackedAreaRenderer from './render/stackedAreaRenderer';
import * as lineRenderer from './render/lineRenderer';
import Renderer from './Renderer';

import './Chart.less';

const rpt = React.PropTypes;

const Chart = React.createClass({
  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    type: rpt.string.isRequired,

    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    margins: rpt.object,

    seriesConfig: rpt.array.isRequired,
    datasources: rpt.array.isRequired,
    windowSize: rpt.number.isRequired,

    yAxis: rpt.object
  },

  render() {
    return (<div></div>);
  },

  componentDidMount() {
    this.renderChart();
  },

  componentDidUpdate(prevProps) {
    if (this.doesPropertyChangeRequireFullRedraw(prevProps)) {
      if (this.chart) {
        this.chart.dispose();
      }
      this.disposeSubscriptions();
      this.renderChart();
    } else if (this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height) {
      if (this.chart) {
        this.chart.onResize({
          width: this.props.width,
          height: this.props.height
        });
      }
    }
  },

  doesPropertyChangeRequireFullRedraw(prevProps) {
    return !_.isEqual(this.props.margins, prevProps.margins) ||
      this.props.type !== prevProps.type ||
      !_.isEqual(this.props.seriesConfig, prevProps.seriesConfig) ||
      this.props.windowSize !== prevProps.windowSize ||
      this.props.datasources !== prevProps.datasources ||
      !_.isEqual(this.props.yAxis, prevProps.yAxis);
  },

  renderChart() {
    const margins = {
      top: 10,
      right: 0,
      bottom: 50,
      left: 40
    };
    if (this.props.margins) {
      _.merge(margins, this.props.margins);
    }

    let renderer;
    if (this.props.type === 'line') {
      renderer = lineRenderer;
    } else if (this.props.type === 'stackedArea') {
      renderer = stackedAreaRenderer;
    } else {
      throw new Error('Unknown chart type' + this.props.type);
    }

    const config = {
      container: React.findDOMNode(this),
      width: this.props.width,
      height: this.props.height,
      margins,
      y1AxisConfig: _.merge({
        tickFormatter: v => v,
        renderer,
        seriesConfig: this.props.seriesConfig
      }, this.props.yAxis),
      windowSize: this.props.windowSize
    };


    this.started = false;
    this.chart = new Renderer(config);

    this.props.datasources.forEach((datasource, seriesIndex) => {
      const subscription = datasource.subscribe(rawDataPoints => {
        const processedDataPoints = rawDataPoints.map(rawDataPoint => {
          return {
            x: rawDataPoint[0],
            y: rawDataPoint[1]
          };
        });
        this.chart.addDataPoints(seriesIndex, processedDataPoints);
      });

      this.addSubscription(subscription);
    });
  },

  componentWillUnmount() {
    this.chart.dispose();
  }
});

export default Chart;
