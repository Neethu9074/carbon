/*global Highcharts*/

'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';

import {formatBytes} from 'instana-ui-services/converters';
import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';
import {getMaxValue} from 'instana-ui-sdk/metrics';

import HighChart from '../../../sdk/charts/HighChart';
import ChartLegend from '../../../sdk/charts/ChartLegend';
import Separator from '../../../sdk/Separator';
import Mtd from '../../../sdk/Mtd';
import ContentHeading from '../../../sdk/ContentHeading';

const commasFormatter = d3.format(',.0f');
const percentFormatter = d => commasFormatter(d * 100) + '%';
const metricValueFormatter = d => commasFormatter(d * 100);
const bytesPerSecondFormatter = d => formatBytes(d) + '/s';

const OsDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  getInitialState() {
    return {
      interfaceDatasources: null,

      cpuUsageChartConfig: {
        chart: {
          type: 'area',
          // Animations are not functional for stacked charts
          // animation: Highcharts.svg,
          animation: false,
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
          min: 0,
          max: 1,
          tickLength: 0,
          labels: {
            x: -10
          }
        },
        plotOptions: {
          area: {
            stacking: 'normal'
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
      },

      cpuLoadChartConfig: {
        chart: {
          type: 'area',
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
          labels: {
            x: -10
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
      },

      filesystemMetrics: null,
      filesystemUsageChartConfig: null,

      memoryFreeChartConfig: {
        chart: {
          type: 'area',
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
          labels: {
            x: -10,
            formatter: function() {
              return formatBytes(this.value);
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
      },

      interfaceMetrics: null,
      interfaceChartConfig: {
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
          labels: {
            x: -10,
            formatter: function() {
              return formatBytes(this.value);
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

        <HighChart snapshot={this.props.snapshot}
                   timeframe={this.props.timeframe}
                   metrics={[
                     'cpu.total.user',
                     'cpu.total.sys',
                     'cpu.total.wait',
                     'cpu.total.nice',
                     'cpu.total.steal'
                   ]}
                   config={this.state.cpuUsageChartConfig} />

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

        <HighChart snapshot={this.props.snapshot}
                   timeframe={this.props.timeframe}
                   metrics={[
                    'load.1min'
                   ]}
                   config={this.state.cpuLoadChartConfig} />

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

        <HighChart snapshot={this.props.snapshot}
                   timeframe={this.props.timeframe}
                   metrics={[
                     'memory.free'
                   ]}
                   config={this.state.memoryFreeChartConfig} />

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.filesystems')}
        </ContentHeading>

        {this.state.filesystemMetrics ?
          <HighChart snapshot={this.props.snapshot}
                     timeframe={this.props.timeframe}
                     metrics={this.state.filesystemMetrics}
                     config={this.state.filesystemUsageChartConfig} />
        : null}

        <table className='in-subtle-table'>
          <thead>
            <tr>
              <th>Device</th>
              <th>Mount</th>
              <th>Options</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Free</th>
              <th>Leaked</th>
              <th>iFree</th>
            </tr>
          </thead>

          <tbody>
            {filesystems.map((data, name) =>
              <tr key={name} onClick={() => this.selectFilesystem(name)}>
                <td>{name}</td>
                <td>{data.get('mount')}</td>
                <td>{data.get('options')}</td>
                <td>{data.get('systype')}</td>
                <td>{formatBytes(data.get('capacity') * 1024)}</td>
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'fs.' + name + '.free'
                       )}
                     formatter={d => formatBytes(d * 1024)} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'fs.' + name + '.leaked'
                       )}
                     formatter={d => formatBytes(d * 1024)} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'fs.' + name + '.ifree'
                       )}
                     formatter={commasFormatter} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>

        <Separator />

        <ContentHeading>
          {this.getIntlMessage('forge.os.networkinterfaces')}
        </ContentHeading>

        {this.state.interfaceMetrics ?
          <HighChart snapshot={this.props.snapshot}
                     timeframe={this.props.timeframe}
                     metrics={this.state.interfaceMetrics}
                     config={this.state.interfaceChartConfig} />
        : null}

        <table className='in-subtle-table'>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th colSpan="4">Received (RX)</th>
              <th colSpan="4">Transmitted (TX)</th>
            </tr>
            <tr>
              <th>Interface</th>
              <th>Mac</th>
              <th>IPs</th>
              <th>Bytes</th><th>Errors</th><th>Dropped</th><th>Overruns</th>
              <th>Bytes</th><th>Errors</th><th>Dropped</th><th>Overruns</th>
            </tr>
          </thead>

          <tbody>
            {interfaces.map((data, name) =>
              <tr key={name} onClick={() => this.selectInterface(name)}>
                <td>{name}</td>
                <td>{data.get('mac')}</td>
                <td>{data.get('ips').join(', ')}</td>
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.bytes'
                       )}
                     formatter={bytesPerSecondFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.errors'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.dropped'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.rx.overruns'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.bytes'
                       )}
                     formatter={bytesPerSecondFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.errors'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.dropped'
                       )}
                     formatter={percentFormatter} />
                <Mtd createMetricValueStream={
                       this.createMetricValueStream.bind(
                         this,
                         'ifs.' + name + '.tx.overruns'
                       )}
                     formatter={percentFormatter} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>

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
