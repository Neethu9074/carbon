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
    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    margins: rpt.object,

    windowSize: rpt.number.isRequired,

    y1: rpt.object.isRequired,
    y2: rpt.object
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
      this.props.windowSize !== prevProps.windowSize ||
      !_.isEqual(this.props.y1, prevProps.y1) ||
      !_.isEqual(this.props.y2, prevProps.y2);
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

    const config = {
      container: React.findDOMNode(this),
      width: this.props.width,
      height: this.props.height,
      margins,
      y1: this.extendAxisConfig('y1'),
      windowSize: this.props.windowSize
    };

    if (this.props.y2) {
      config.y2 = this.extendAxisConfig('y2');
    }

    this.chart = new Renderer(config);

    this.subscribeToDatasources('y1');
    if (this.props.y2) {
      this.subscribeToDatasources('y2');
    }
  },

  extendAxisConfig(axis) {
    return _.merge({
      tickFormatter: v => v,
      renderer: this.getRenderer(this.props[axis].type)
    }, this.props[axis]);
  },

  getRenderer(type) {
    if (type === 'line') {
      return lineRenderer;
    } else if (type === 'stackedArea') {
      return stackedAreaRenderer;
    } else {
      throw new Error('Unknown chart type' + type);
    }
  },

  subscribeToDatasources(axis) {
    this.props[axis].datasources.forEach((datasource, seriesIndex) => {
      const subscription = datasource.subscribe(rawDataPoints => {
        const processedDataPoints = rawDataPoints.map(rawDataPoint => {
          return {
            x: rawDataPoint[0],
            y: rawDataPoint[1]
          };
        });
        this.chart.addDataPoints(axis, seriesIndex, processedDataPoints);
      });

      this.addSubscription(subscription);
    });
  },

  componentWillUnmount() {
    this.chart.dispose();
  }
});

export default Chart;
