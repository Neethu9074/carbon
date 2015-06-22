/*global Highcharts*/

'use strict';

import '../../../../libs/highcharts/standalone-framework.src.js';
import '../../../../libs/highcharts/highcharts.src.js';

import _ from 'lodash';
import React from 'react';

import {isIdEqual} from 'instana-ui-services/util/snapshots';
import {create} from 'instana-ui-services/conveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import theme from './highchart_theme';

Highcharts.setOptions(theme);

const HighChart = React.createClass({

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

    const chart = this.chart = new Highcharts.Chart(config);

    const redraw = _.debounce(() => {
      // it can happen that a redraw fires after the current chart was disposed.
      // In such cases we should not call redraw.
      if (this.chart === chart) {
        chart.redraw();
      }
    }, 200);

    datasources.forEach((datasource, seriesIndex) => {
      let latestDataPointInPreviousUpdate = null;
      let numberOfDataPointsInPreviousUpdate = 0;

      this.addSubscription(datasource
        .subscribe(dataset => {
          const indexOfLatestDataPointInCurrentUpdate = _.findIndex(
            dataset.values,
            value => value[0] === latestDataPointInPreviousUpdate
          );

          const numberOfPointsToAdd = dataset.values.length - 1 -
            indexOfLatestDataPointInCurrentUpdate;
          const numberOfPointsToRemove = numberOfDataPointsInPreviousUpdate -
            1 - indexOfLatestDataPointInCurrentUpdate;

          // do a big update instead of a broken animation
          if (numberOfPointsToAdd < numberOfPointsToRemove) {
          // incremental update, HighChart can transition this, yay!
            this.chart.series[seriesIndex]
              .setData(dataset.values, false, false);
          } else {
            let numberOfAddedPoints = 0;
            for (let i = indexOfLatestDataPointInCurrentUpdate + 1;
                 i < dataset.values.length;
                 i++) {
              const shift = numberOfAddedPoints < numberOfPointsToRemove;
              this.chart.series[seriesIndex]
                .addPoint(dataset.values[i], false, shift);
              numberOfAddedPoints++;
            }
          }

          const latestValue = dataset.values[dataset.values.length - 1];
          latestDataPointInPreviousUpdate = latestValue[0];
          numberOfDataPointsInPreviousUpdate = dataset.values.length;

          redraw();
        }));
    });
  }
});

export default HighChart;
