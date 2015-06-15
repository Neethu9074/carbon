/*eslint-disable max-statements */

'use strict';

import _ from 'lodash';
import React from 'react';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {combineLatest} from 'reactive-observables';
import Chart from './chart';

import './LineChart.less';

const identity = a => a;

const LineChart = React.createClass({

  mixins: [SubscriptionMixin],

  render() {
    return (
      <svg className='in-line-chart' ref='element' />
    );
  },

  componentDidMount() {
    this.renderChart(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (this.isTickFormatterChanged(this.props, nextProps) ||
        this.isDatasourcesChanged(this.props, nextProps)) {
      this.disposeSubscriptions();
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
      this.renderChart(nextProps);

    } else if (this.isSizeChanged(this.props, nextProps)
        // React component properties can be changed before the initial
        // rendering happens.
        && this.chart) {
      this.chart.resize({
        width: nextProps.width,
        height: nextProps.height
      });
    }
  },

  isTickFormatterChanged(currentProps, nextProps) {
    return currentProps.yAxisTickFormatter !== nextProps.yAxisTickFormatter;
  },

  isDatasourcesChanged(currentProps, nextProps) {
    if (currentProps.datasources.length !== nextProps.datasources.length) {
      return true;
    }

    for (let i = 0; i < currentProps.datasources.length; i++) {
      if (currentProps.datasources[i] !== nextProps.datasources[i]) {
        return true;
      }
    }

    return false;
  },

  isSizeChanged(currentProps, nextProps) {
    return currentProps.width !== nextProps.width ||
      currentProps.height !== nextProps.height;
  },

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  },

  renderChart(props) {
    const subscription = combineLatest(props.datasources, true)
      // we can only accept datasets when each and every dataset has the same
      // number of data points and the same last value on the time scale. This
      // is due to the fact that we are using stacked charts. Stacked charts
      // require every dataset to have the same time axis.
      .filter(datasets => {
        const firstDataset = datasets[0];
        const numberOfDataPoints = firstDataset.values.length;
        const latest = firstDataset.values[numberOfDataPoints - 1][0];

        for (let i = 1; i < datasets.length; i++) {
          const dataset = datasets[i];
          if (dataset.values.length !== numberOfDataPoints ||
              dataset.values[numberOfDataPoints - 1][0] !== latest) {
            return false;
          }
        }

        return true;
      })
      .subscribe(datasets => {
        // when we reach this point, render will have been called asynchronously
        // and the props in the parameter list will be outdated. We need to
        // reference the most up to date parameter list.
        if (this.chart) {
          this.chart.setNewData(datasets);
        } else {
          this.chart = new Chart({
            mountPoint: React.findDOMNode(this.refs.element),
            width: this.props.width,
            height: this.props.height,
            datasets: datasets,
            yAxisTickFormatter: this.props.yAxisTickFormatter,
            valueTransformer: this.props.valueTransformer || identity
          });
        }
      });

    this.addSubscription(subscription);
  }

});

export default LineChart;
