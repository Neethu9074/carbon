'use strict';

import d3 from 'd3';
import {theme} from 'instana-ui-services/theme';

const defaultXAxisTickFormatter = d3.time.format('%H:%M:%S');
const defaultYAxisTickFormatter = d3.format(',.2f');

export default class LineChart {

  constructor({
      mountPoint,
      width,
      height,
      datasets,
      xAxisTickFormatter=defaultXAxisTickFormatter,
      yAxisTickFormatter=defaultYAxisTickFormatter}) {
    // copy the incoming data set so that we can mutate it freely
    this.datasets = JSON.parse(JSON.stringify(datasets));

    const domains = this.determineDomains();

    this.x = d3.time.scale()
      .domain([domains.oldest, domains.latest]);

    this.y = d3.scale.linear()
      .domain([domains.min, domains.max]);

    this.x.axis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .tickFormat(xAxisTickFormatter)
      .ticks(5)
      .outerTickSize(0);

    this.y.axis = d3.svg.axis()
      .scale(this.y)
      .ticks(5)
      .tickFormat(yAxisTickFormatter)
      .tickPadding(10)
      .orient('left');

    this.line = d3.svg.line()
      .x(d => this.x(d[0]))
      .y(d => this.y(d[1]));

    this.chart = d3.select(mountPoint);

    this.x.axis.element = this.chart.append('g')
      .attr('class', 'x axis');

    this.y.axis.element = this.chart.append('g')
      .attr('class', 'y axis');

    this.chart.append('defs')
      .append('clipPath')
        .attr('id', 'clip')
      .append('rect');

    this.lines = this.chart.append('g')
      .attr('clip-path', 'url(#clip)');

    this.lines.selectAll('path')
        .data(datasets)
      .enter().append('path')
        .attr('class', 'line')
        .attr('d', d => this.line(d.values))
        .attr('fill', () => 'transparent')
        .attr('stroke', (d, i) => theme.chart.strokeColors[i]);

    this.resize({width, height});
  }

  dispose() {
    this.stopTransitions();
  }

  stopTransitions() {
    this.lines.selectAll('path').transition().duration(0);
    this.x.axis.element.transition().duration(0);
  }

  update(datasetsUpdate) {
    this.stopTransitions();

    let newDomainStart = Number.MAX_VALUE;
    let newDomainEnd = Number.MIN_VALUE;
    const previousDomainEnd = this.x.domain()[1].getTime();

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
    this.datasets = this.datasets.map((dataset, i) => {
      dataset.values = dataset.values.concat(newValues[i]);
      return dataset;
    });

    // update the exsiting data sets and transition the graph to the left
    this.lines.selectAll('path')
      .data(this.datasets)
        .attr('d', d => this.line(d.values))
        .attr('transform', null)
      .transition()
        .duration(300)
        .ease('linear')
        .attr('transform', 'translate(' + this.x(newDomainStart) * -1 + ')');

    const xAxisEndPositionX = this.x(newDomainStart) * -1 + this.padding.left;
    const xAxisEndPositionY = this.chartHeight + this.padding.top + 10;
    this.x.axis.element.call(this.x.axis)
      .attr(
        'transform',
        'translate(' + this.padding.left + ',' + xAxisEndPositionY + ')'
      )
      .transition()
        .duration(300)
        .ease('linear')
        .attr(
          'transform',
          'translate(' + xAxisEndPositionX + ',' + xAxisEndPositionY + ')'
        );

    // remove all previous data and set the new data as the domain
    this.x.domain([newDomainStart, newDomainEnd]);
    this.datasets = this.datasets.map(dataset => {
      dataset.values = dataset.values.filter(value =>
        value[0] >= newDomainStart
      );
      return dataset;
    });
  }

  resize({width, height}) {
    this.stopTransitions();
    this.setSize({width, height});

    // increase width to avoid strokes at the sides
    this.x.range([-2, this.chartWidth + 2]);

    // increase height to avoid strokes at the sides
    this.y.range([this.chartHeight, 0]);

    // draw a grid throughout the chart
    this.y.axis.innerTickSize(-1 * this.chartWidth);

    this.chart.attr('width', this.width)
      .attr('height', this.height);

    this.x.axis.element
      .attr(
        'transform',
        'translate(' + this.getXAxisTranslation().join(',') + ')'
      )
      .call(this.x.axis);

    this.y.axis.element
      .attr(
        'transform',
        'translate(' + this.padding.left + ',' + this.padding.top + ')'
      )
      .call(this.y.axis);

    this.chart.select('defs rect')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);

    this.lines.attr(
      'transform',
      'translate(' + this.padding.left + ', ' + this.padding.top + ')'
    );

    // force a redraw of all lines
    this.lines.selectAll('path').attr('d', d => this.line(d.values));
  }

  getXAxisTranslation() {
    return [
      this.padding.left,
      this.chartHeight + this.padding.top + 10
    ];
  }

  setSize({width, height}) {
    this.width = width;
    this.height = height;

    this.padding = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 50
    };

    this.chartWidth = this.width - this.padding.left - this.padding.right;
    this.chartHeight = this.height - this.padding.bottom - this.padding.top;
  }

  determineDomains() {
    const initial = {
      min: Number.MAX_VALUE,
      max: Number.MIN_VALUE,
      oldest: Number.MAX_VALUE,
      latest: Number.MIN_VALUE
    };

    return this.datasets.reduce((acc, dataset) => {
        acc.max = Math.max(acc.max, dataset.max);
        acc.min = Math.min(acc.min, dataset.min);

        acc.oldest = Math.min(acc.oldest, dataset.values[0][0]);
        const lastValue = dataset.values[dataset.values.length - 1];
        acc.latest = Math.max(acc.latest, lastValue[0]);
        return acc;
      },
      initial
    );
  }

}
