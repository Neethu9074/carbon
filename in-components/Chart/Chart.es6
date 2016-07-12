import PureRenderMixin from 'react-addons-pure-render-mixin';
import {isEqual, merge} from 'lodash';
import ReactDOM from 'react-dom';
import React from 'react';

import {filterStoreShape} from 'in-components/ChartWithLegend/dataseriesFilterStore';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getDefaultMetricRollupDuration} from 'in-stores/metric';
import {timeframeShape} from 'in-stores/timeline';

import * as stackedAreaRenderer from './render/stackedAreaRenderer';
import * as pointRenderer from './render/pointRenderer';
import * as lineRenderer from './render/lineRenderer';
import * as barRenderer from './render/barRenderer';
import Renderer from './Renderer';

import './Chart.less';

const rpt = React.PropTypes;

const Chart = React.createClass({
  mixins: [PureRenderMixin, SubscriptionMixin],

  propTypes: {
    height: rpt.number.isRequired,
    margins: rpt.object,
    filterStore: filterStoreShape.isRequired,

    timeframe: timeframeShape,

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
    } else if (this.props.height !== prevProps.height) {
      if (this.chart) {
        this.chart.onResize({
          height: this.props.height
        });
      }
    }
  },

  doesPropertyChangeRequireFullRedraw(prevProps) {
    return !isEqual(this.props.margins, prevProps.margins) ||
      this.props.timeframe.windowSize !== prevProps.timeframe.windowSize ||
      this.props.timeframe.to !== prevProps.timeframe.to ||
      !isEqual(this.props.y1, prevProps.y1) ||
      !isEqual(this.props.y2, prevProps.y2);
  },

  renderChart() {
    const margins = {
      top: 10,
      right: 0,
      bottom: 50,
      left: 40
    };
    if (this.props.margins) {
      merge(margins, this.props.margins);
    }

    const config = {
      container: ReactDOM.findDOMNode(this),
      height: this.props.height,
      margins,
      filterStore: this.props.filterStore,
      y1: this.extendAxisConfig('y1'),
      windowSize: this.props.timeframe.windowSize,
      rollupMillis: getDefaultMetricRollupDuration(this.props.timeframe) || 1000
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
    return merge({
      formatter: v => v,
      renderer: this.getRenderer(this.props[axis].type)
    }, this.props[axis]);
  },

  getRenderer(type) {
    if (type === 'line') {
      return lineRenderer;
    } else if (type === 'stackedArea') {
      return stackedAreaRenderer;
    } else if (type === 'point') {
      return pointRenderer;
    } else if (type === 'bar') {
      return barRenderer;
    }
    throw new Error('Unknown chart type' + type);
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
