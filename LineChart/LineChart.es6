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
    // special case resizing
    if (this.isOnlySizeChanged(this.props, nextProps)) {
      this.chart.resize({
        width: nextProps.width,
        height: nextProps.height
      });
      return;
    }

    this.disposeSubscriptions();
    if (this.chart) {
      this.chart.dispose();
    }
    this.renderChart(nextProps);
  },

  isOnlySizeChanged(currentProps, nextProps) {
    if (currentProps.yAxisTickFormatter !== nextProps.yAxisTickFormatter) {
      return false;
    }

    if (currentProps.datasources.length !== nextProps.datasources.length) {
      return false;
    }

    for (let i = 0; i < currentProps.datasources.length; i++) {
      if (currentProps.datasources[i] !== nextProps.datasources[i]) {
        return false;
      }
    }

    return true;
  },

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  },

  renderChart(props) {
    const subscription = combineLatest(props.datasources)
      .debounce(300)
      .subscribe(datasets => {
        if (this.chart) {
          this.chart.update(datasets);
        } else {
          this.chart = new Chart({
            mountPoint: React.findDOMNode(this.refs.element),
            width: props.width,
            height: props.height,
            datasets: datasets,
            yAxisTickFormatter: props.yAxisTickFormatter
          });
        }
      });

    this.addSubscription(subscription);
  }

});

export default LineChart;
