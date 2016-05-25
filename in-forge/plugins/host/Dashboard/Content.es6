import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import NetworkInterfacesTable from 'in-forge/plugins/host/Dashboard/NetworkInterfacesTable';
import FilesystemsTable from 'in-forge/plugins/host/Dashboard/FilesystemsTable';
import CpuTable from 'in-forge/plugins/host/Dashboard/CpuTable';
import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import {getRawPayload} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';


const chartHeight = 200;

export default connectTo(
  props => {
    return {
      processes: getRawPayload(props.snapshot.get('id'), 'processes')
    };
  },
  React.createClass({

    displayName: 'HostDashboard',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      snapshot: irpt.map.isRequired,
      timeframe: timeframeShape,
      processes: irpt.list
    },

    render() {
      const timeframe = this.props.timeframe;
      const snapshot = this.props.snapshot;
      const swapTotal = snapshot.getIn(['data', 'swap.total'], 0);

      return (
        <div>
          <DashboardSection title='CPU Usage'>
            <ChartWithLegend snapshot={snapshot}
                   timeframe={timeframe}
                   height={chartHeight}
                   margins={{
                     left: 60
                   }}
                   y1={{
                     min: 0,
                     max: 1,
                     formatter: percentageZeroDecimalPlaces,
                     metrics: [
                       'cpu.user',
                       'cpu.sys',
                       'cpu.wait',
                       'cpu.nice',
                       'cpu.steal'
                     ],
                     labels: [
                       'User',
                       'System',
                       'Wait',
                       'Nice',
                       'Steal'
                     ],
                     type: 'stackedArea'
                   }}/>
          </DashboardSection>

          {!this.isWindows() ?
            <DashboardSection title='CPU Load'>
              <ChartWithLegend snapshot={snapshot}
                timeframe={timeframe}
                height={chartHeight}
                margins={{
                  left: 60
                }}
                y1={{
                  min: 0,
                  type: 'stackedArea',
                  formatter: twoDecimalPlaces,
                  tooltipFormatter: twoDecimalPlaces,
                  metrics: [
                    'load.1min'
                  ],
                  labels: ['Load']
                }}/>
            </DashboardSection>
          : null}

          <CpuTable snapshot={snapshot} timeframe={timeframe} />

          <DashboardSection title='Memory Free'>
            <ChartWithLegend snapshot={snapshot}
                   timeframe={timeframe}
                   height={chartHeight}
                   margins={{
                     left: 80
                   }}
                   y1={{
                     min: 0,
                     max: snapshot.getIn(['data', 'memory.total']),
                     formatter: bytesZeroDecimalPlaces,
                     tooltipFormatter: bytesTwoDecimalPlaces,
                     metrics: [
                       'memory.free'
                     ],
                     labels: ['Free'],
                     type: 'stackedArea'
                   }}/>
          </DashboardSection>

          {swapTotal > 0 ?
            <DashboardSection title='Swap Activity'>
              <ChartWithLegend snapshot={snapshot}
                     timeframe={timeframe}
                     height={chartHeight}
                     margins={{
                       left: 90
                     }}
                     y1={{
                       min: 0,
                       formatter: twoDecimalPlaces,
                       metrics: [
                         'swap.pgin',
                         'swap.pgout'
                       ],
                       labels: [
                         'Page-In',
                         'Page-Out'
                       ],
                       type: 'line'
                     }}/>
            </DashboardSection>
          : null}

          <FilesystemsTable snapshot={snapshot} timeframe={timeframe}/>

          <NetworkInterfacesTable snapshot={snapshot} timeframe={timeframe} />

          <DashboardSection title='TCP Activity'>
            <ChartWithLegend snapshot={snapshot}
                             timeframe={timeframe}
                             height={chartHeight}
                             y1={{
                               type: 'line',
                               metrics: [
                                 'tcp.established',
                                 'tcp.opens',
                                 'tcp.inSegs',
                                 'tcp.outSegs'
                               ],
                               labels: [
                                 'Established',
                                 'Opens',
                                 'In Segments',
                                 'Out Segments'
                               ],
                               formatter: zeroDecimalPlaces,
                               tooltipFormatter: twoDecimalPlaces
                             }}
                             y2={{
                               type: 'line',
                               metrics: [
                                 'tcp.establishedResets',
                                 'tcp.resets',
                                 'tcp.fails',
                                 'tcp.errors',
                                 'tcp.retrans'
                               ],
                               labels: [
                                 'Established Resets',
                                 'Out Resets',
                                 'Fail',
                                 'Error',
                                 'Retransmission'
                               ],
                               min: 0,
                               max: 1,
                               formatter: percentageZeroDecimalPlaces
                             }}
                             margins={{
                               right: 60,
                               left: 80
                             }}/>
          </DashboardSection>

          {this.props.processes && this.props.processes.size > 0 ?
          <DashboardSection title='Process Top List'>
            <ResponsiveTable>
              <thead>
                <tr>
                  <th>PID</th>
                  <th>Process Name</th>
                  <th>CPU</th>
                  <th>Memory</th>
                </tr>
              </thead>

              <tbody>
                {this.props.processes.toArray().sort((a, b) => b.get('cpu') - a.get('cpu')).map(process =>
                  <tr key={process.get('pid')}>
                    <td>{process.get('pid')}</td>
                    <td>{process.get('name')}</td>
                    <td>{percentageZeroDecimalPlaces(process.get('cpu'))}</td>
                    <td>{bytesTwoDecimalPlaces(process.get('memory'))}</td>
                  </tr>
                )}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
          : null}
        </div>
      );
    },

    selectCpu(cpu) {
      this.setState({
        cpuNo: cpu
      });
    },

    selectInterface(iface) {
      this.setState({
        interfaceName: iface
      });
    },

    isWindows() {
      return !!this.props.snapshot.getIn(['data', 'os.name'], '').match(/windows/i);
    }
  })
);
