/*eslint-disable max-statements */

'use strict';

import _ from 'lodash';
import React from 'react';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {combineLatest} from 'reactive-observables';
import Chart from './chart';

import './LineChart.less';

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
    this.disposeSubscriptions();
    if (this.chart) {
      this.chart.dispose();
    }
    this.renderChart(nextProps);
  },

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  },

  renderChart(props) {
    const subscription = combineLatest(props.datasources)
      .subscribe(datasets => {
        if (this.chart) {
          this.chart.update(datasets);
        } else {
          this.chart = new Chart({
            mountPoint: React.findDOMNode(this.refs.element),
            width: props.width,
            height: props.height,
            datasets: datasets
          });
        }
      });

    this.addSubscription(subscription);
  }

});

export default LineChart;
