/*global Highcharts*/

'use strict';

import '../../../libs/highcharts/standalone-framework.src.js';
import '../../../libs/highcharts/highcharts.src.js';

import _ from 'lodash';
import React from 'react';
import * as ro from 'reactive-observables';

import {isIdEqual} from 'instana-ui-services/util/snapshots';
import {create} from 'instana-ui-services/conveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import theme from './highchart_theme';

Highcharts.setOptions(theme);

const StackedHighChart = React.createClass({

  mixins: [SubscriptionMixin],

  render() {
    return (
      <div></div>
    );
  },

  componentDidMount() {
    this.renderChart();
  },

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  },

  shouldComponentUpdate(nextProps) {
    return !isIdEqual(nextProps.snapshot, this.props.snapshot) ||
      !_.isEqual(nextProps.metrics, this.props.metrics) ||
      nextProps.timeframe !== this.props.timeframe ||
      nextProps.config !== this.props.config;
  },

  componentDidUpdate() {
    this.disposeSubscriptions();
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    this.renderChart();
  },

  renderChart() {
    const config = this.props.config;

    const datasources = this.props.metrics.map(metric =>
      create(MetricWithHistoryConveyer, {
        snapshot: this.props.snapshot,
        metric,
        timeframe: this.props.timeframe
      })
    );

    // override certain config paths that the user of this component is not
    // responsible for.
    config.chart.renderTo = React.findDOMNode(this);
    config.series = datasources.map((datasource, i) => {
      return {
        name: this.props.metrics[i],
        data: []
      };
    });
    config.plotOptions = {
      area: {
        fillOpacity: 1
      }
    };

    const chart = this.chart = new Highcharts.Chart(config);

    const subscription = ro.combineLatest(datasources)
      .debounce(100)
      .subscribe(rawSeries => {
        // An array of series, where each series in an array of the following
        // structure:
        // [[x, y], [x, y]...]
        const series = datasources.map(() => []);
        const firstRawSeries = rawSeries[0];

        firstRawSeries.values.forEach(([x]) => {
          const values = getValueFromAllRawSeries(x);

          // all series need to have a value for that x. If this is not the
          // case, we cannot stack them
          if (_.some(values, v => v === undefined)) {
            return;
          }

          let sum = 0;
          for (let i = rawSeries.length - 1; i >= 0; i--) {
            sum += values[i];
            series[i].push([
              x,
              sum
            ]);
          }
        });

        chart.series.forEach((chartSeries, i) => {
          chartSeries.setData(series[i], false, false, true);
        });

        if (this.chart === chart) {
          chart.redraw();
        }

        function getValueFromAllRawSeries(x) {
          const predicate = dataPoint => dataPoint[0] === x;
          const values = [];
          for (let i = 0, len = rawSeries.length; i < len; i++) {
            const value = _.find(rawSeries[i].values, predicate);
            if (value !== undefined) {
              values[i] = value[1];
            }
          }
          return values;
        }
      });

    this.addSubscription(subscription);
  }
});

export default StackedHighChart;
