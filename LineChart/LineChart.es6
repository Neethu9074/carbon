/*eslint-disable max-statements */

'use strict';

import _ from 'lodash';
import React from 'react';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {combineLatest} from 'reactive-observables';
import d3 from 'd3';

import './LineChart.less';


const xAxisTickFormatter = d3.time.format('%H:%M');

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
      .debounce(100)
      .subscribe(datasets => {
        if (this.chart) {
          this.chart.update(datasets);
        } else {
          this.chart = this.doInitialRender(props, datasets);
        }
      });

    this.addSubscription(subscription);
  },

  doInitialRender(props, datasets) {
    const outerWidth = props.width;
    const outerHeight = props.height;

    const paddingTop = 20;
    const paddingRight = 20;
    const paddingBottom = 50;
    const paddingLeft = 50;

    const chartWidth = outerWidth - paddingLeft - paddingRight;
    const chartHeight = outerHeight - paddingBottom - paddingTop;

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
      // increase width to avoid strokes at the sides
      .range([-1, chartWidth + 1]);

    const y = d3.scale.linear()
      .domain([min, max])
      // avoid showing strokes to the left and right of a chart
      .range([chartHeight, 0]);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickFormat(xAxisTickFormatter)
      .outerTickSize(0);

    const yAxis = d3.svg.axis()
      .scale(y)
      .ticks(5)
      .tickFormat(props.yAxisTickFormatter)
      .innerTickSize(-chartWidth)
      .tickPadding(10)
      .orient('left');

    const line = d3.svg.area()
      .x(d => x(d[0]))
      // avoid showing a stroke at the bottom of the chart
      .y0(chartHeight + 1)
      .y1(d => y(d[1]));

    const chart = this.chart = d3.select(React.findDOMNode(this.refs.element))
      .attr('width', outerWidth)
      .attr('height', outerHeight);

    const xAxisElement = chart.append('g')
      .attr('class', 'x axis')
      .attr(
        'transform',
        'translate(' + paddingLeft + ',' + (chartHeight + paddingTop + 10) + ')'
      )
      .call(xAxis);

    chart.append('g')
      .attr('class', 'y axis')
      .attr(
        'transform',
        'translate(' + (paddingLeft) + ',' + paddingTop + ')'
      )
      .call(yAxis);

    chart.append('defs')
      .append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    const lines = chart.append('g')
      .attr('clip-path', 'url(#clip)')
      .attr('transform', 'translate(' + paddingLeft + ', ' + paddingTop + ')');

    lines.selectAll('path')
        .data(datasets)
      .enter().append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.values));

    return {
      dispose() {
        // TODO Implement dispose logic
      },

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
        lines.selectAll('path')
          .data(datasets)
            .attr('d', d => line(d.values))
            .attr('transform', null)
          .transition()
            .duration(500)
            .ease('linear')
            .attr('transform', 'translate(' + x(newDomainStart) * -1 + ')');

        const xAxisEndPositionX = x(newDomainStart) * -1 + paddingLeft;
        const xAxisEndPositionY = (chartHeight + paddingTop + 10);
        xAxisElement.call(xAxis)
          .attr(
            'transform',
            'translate(' + paddingLeft + ',' + xAxisEndPositionY + ')'
          )
          .transition()
            .duration(500)
            .ease('linear')
            .attr(
              'transform',
              'translate(' + xAxisEndPositionX + ',' + xAxisEndPositionY + ')'
            );

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
