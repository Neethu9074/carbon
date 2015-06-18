/*global Highcharts*/

'use strict';

import React from 'react/addons';

import theme from './highchart_theme';

Highcharts.setOptions(theme);

const HighChart = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div></div>
    );
  },

  componentDidMount() {
    this.chart = new Highcharts.Chart({
      chart: {
          renderTo: React.findDOMNode(this),
          type: 'area',
          animation: Highcharts.svg,
          height: this.props.height,
          events: {
              load: function() {
                  const chart = this;
                  let series = chart.series;
                  setInterval(() => {
                      let x = (new Date()).getTime(), // current time
                          y = Math.random();
                      series[0].addPoint([x, y], false, true);
                      series[1].addPoint([x, Math.random()], false, true);
                      chart.redraw();
                  }, 1000);
              }
          }
      },
      title: {
          text: null
      },
      xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
          tickLength: 0,
          minPadding: 0,
          maxPadding: 0,
          labels: {
            y: 28
          }
      },
      yAxis: {
          title: {
              text: null
          },
          tickLength: 0,
          labels: {
            x: -10
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                  Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                  Highcharts.numberFormat(this.y, 2);
          }
      },
      legend: {
          enabled: false
      },
      exporting: {
          enabled: false
      },
      series: [{
          name: 'Random data',
          data: (function () {
              // generate an array of random data
              let data = [],
                  time = (new Date()).getTime(),
                  i;

              for (i = -19; i <= 0; i += 1) {
                  data.push({
                      x: time + i * 1000,
                      y: Math.random()
                  });
              }
              return data;
          }())
      }, {
          name: 'Random data 2',
          data: (function () {
              // generate an array of random data
              let data = [],
                  time = (new Date()).getTime(),
                  i;

              for (i = -19; i <= 0; i += 1) {
                  data.push({
                      x: time + i * 1000,
                      y: Math.random()
                  });
              }
              return data;
          }())
      }]
    });
  }
});

export default HighChart;
