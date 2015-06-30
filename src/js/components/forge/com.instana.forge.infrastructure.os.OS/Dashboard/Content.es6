/*global Highcharts*/

'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'instana-ui-services/converters';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';
import {getMaxValue} from 'instana-ui-sdk/metrics';

import Chart from '../../../sdk/charts/Chart';
import HighChart from '../../../sdk/charts/HighChart';
import ChartLegend from '../../../sdk/charts/ChartLegend';
import Separator from '../../../sdk/Separator';
import Mtd from '../../../sdk/Mtd';
import ContentHeading from '../../../sdk/ContentHeading';

const rpt = React.PropTypes;
const commasFormatter = d3.format(',.0f');
const percentFormatter = d => commasFormatter(d * 100) + '%';
const metricValueFormatter = d => commasFormatter(d * 100);
const bytesPerSecondFormatter = d => formatBytes(d) + '/s';

const chartHeight = 300;

const OsDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  getInitialState() {
    return {
      interfaceDatasources: null,
      filesystemMetrics: null,
      interfaceMetrics: null
    };
  },

  render() {
    const filesystems = this.props.snapshot.getIn(['data', 'filesystems']);
    const interfaces = this.props.snapshot.getIn(['data', 'interfaces']);

    return (
      <div>
        <ChartLegend title='CPU Usage'
                          snapshot={this.props.snapshot}
                          metrics={[
                            'cpu.total.user',
                            'cpu.total.sys',
                            'cpu.total.wait',
                            'cpu.total.nice',
                            'cpu.total.steal'
                          ]}
                          metricLabels={[
                            'User',
                            'System',
                            'Wait',
                            'Nice',
                            'Steal'
                          ]}
                          metricUnit='%'
                          metricValueFormatter={metricValueFormatter} />

        <Chart type='stackedArea'
               snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               metrics={[
                 'cpu.total.user',
                 'cpu.total.sys',
                 'cpu.total.wait',
                 'cpu.total.nice',
                 'cpu.total.steal'
               ]}
               width={this.props.width}
               height={chartHeight} />

        <Separator />

        <ChartLegend title='CPU Load'
                          snapshot={this.props.snapshot}
                          metrics={[
                            'load.1min'
                          ]}
                          metricLabels={[
                            'Load'
                          ]}
                          metricUnit=''
                          metricValueFormatter={d => d} />

        <Chart type='stackedArea'
               snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               metrics={[
                 'load.1min'
               ]}
               width={this.props.width}
               height={chartHeight} />

        <Separator />

        <ChartLegend title='Memory Free'
                          snapshot={this.props.snapshot}
                          metrics={[
                            'memory.free'
                          ]}
                          metricLabels={[
                            'Free'
                          ]}
                          metricUnit=''
                          metricValueFormatter={d => formatBytes(d)} />

        <Chart type='stackedArea'
               snapshot={this.props.snapshot}
               windowSize={this.props.timeframe}
               metrics={[
                 'memory.free'
               ]}
               width={this.props.width}
               height={chartHeight} />

        <Separator />

      </div>
    );
  },

  selectFilesystem(fs) {
    const metric = 'fs.' + fs + '.free';
    this.setState({
      filesystemMetrics: [metric],
      filesystemUsageChartConfig: {
        chart: {
          type: 'spline',
          animation: Highcharts.svg,
          height: 250
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
          min: 0,
          max: getMaxValue(metric, this.props.snapshot),
          endOnTick: false,
          labels: {
            x: -10,
            formatter: function() {
              return formatBytes(this.value * 1024);
            }
          }
        },
        tooltip: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        }
      }
    });
  },

  selectInterface(iface) {
    this.setState({
      interfaceMetrics: [
        'ifs.' + iface + '.rx.bytes',
        'ifs.' + iface + '.tx.bytes'
      ]
    });
  },

  createMetricWithHistoryStream(metric) {
    return create(MetricWithHistoryConveyer, {
      snapshot: this.props.snapshot,
      timeframe: this.props.timeframe,
      metric
    });
  },

  createMetricValueStream(metric) {
    return create(MetricConveyer, {
      snapshot: this.props.snapshot,
      metric
    });
  }

});

export default OsDashboard;
