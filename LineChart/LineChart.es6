'use strict';

import _ from 'lodash';
import React from 'react';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {combineLatest} from 'reactive-observables';
import d3 from 'd3';

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
    let chart;
    const subscription = combineLatest(props.datasources)
      .debounce(100)
      .subscribe(datasets => {
        if (chart) {
          chart.update(datasets);
        } else {
          chart = this.doInitialRender(datasets);
        }
      });

    this.addSubscription(subscription);
  },

  doInitialRender(datasets) {
    // copy the incoming data set so that we can mutate it freely
    datasets = JSON.parse(JSON.stringify(datasets));

    const {max, min, oldest, latest} = datasets.reduce(
      (acc, dataset) => {
        acc.max = Math.max(acc.max, dataset.max);
        acc.min = Math.min(acc.min, dataset.min);

        acc.oldest = Math.min(acc.oldest, dataset.values[0][0]);
        const lastValue = dataset.values[dataset.values.length - 1];
        acc.latest = Math.max(acc.latest, lastValue[0]);
        return acc;
      },
      {
        min: Number.MAX_VALUE,
        max: Number.MIN_VALUE,
        oldest: Number.MAX_VALUE,
        latest: Number.MIN_VALUE
      }
    );

    const x = d3.time.scale()
      .domain([oldest, latest])
      .rangeRound([-1, 201]);

    const y = d3.scale.linear()
      .domain([min, max])
      .range([0, 200]);

    const line = d3.svg.area()
      .x(d => x(d[0]))
      .y0(202)
      .y1(d => y(d[1]));

    const chart = this.chart = d3.select(React.findDOMNode(this.refs.element))
      .attr('width', 200)
      .attr('height', 200);

    chart.selectAll('path')
        .data(datasets)
      .enter().append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.values));

    return {
      update(datasetsUpdate) {
        let newDomainStart = Number.MAX_VALUE;
        let newDomainEnd = Number.MIN_VALUE;
        const previousDomainEnd = x.domain()
          .map(date => date.getTime())[1];

        const newValues = datasetsUpdate.map(dataset => {
          return dataset.values.filter(value => {
            newDomainStart = Math.min(newDomainStart, value[0]);
            newDomainEnd = Math.max(newDomainEnd, value[0]);

            return value[0] > previousDomainEnd;
          });
        });

        // Add all new values to the graph so that the graph extends beyond
        // the domain. This is necessary so that we can transition the graph's
        // contents to the left in the next step
        datasets = datasets.map((dataset, i) => {
          dataset.values = dataset.values.concat(newValues[i]);
          return dataset;
        });

        // update the exsiting data sets and transition the graph to the left
        chart.selectAll('path')
          .data(datasets)
            .attr('d', d => line(d.values))
            .attr('transform', null)
          .transition()
            .duration(500)
            .ease('linear')
            .attr('transform', 'translate(' + x(newDomainStart) * -1 + ')');

        // remove all previous data and set the new data as the domain
        x.domain([newDomainStart, newDomainEnd]);
        datasets = datasets.map(dataset => {
          dataset.values = dataset.values.filter(value =>
            value[0] >= newDomainStart
          );
          return dataset;
        });
      }
    };
  }

});

export default LineChart;
