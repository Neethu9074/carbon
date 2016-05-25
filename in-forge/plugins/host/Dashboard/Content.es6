import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';
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
import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import classnames from 'in-services/util/classnames';
import {timeframeShape} from 'in-stores/timeline';
import {getRawPayload} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import Mtd from 'in-components/Mtd';


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

    getInitialState() {
      return {
        cpuNo: null
      };
    },

    render() {
      const timeframe = this.props.timeframe;
      const snapshot = this.props.snapshot;

      const cpuNo = this.state.cpuNo;

      const cpuCount = snapshot.getIn(['data', 'cpu.count']);
      const swapTotal = snapshot.getIn(['data', 'swap.total'], 0);

      const cpus = Immutable.Range(1, cpuCount + 1);

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

          {cpuCount > 1 ?

          <DashboardSection title='Individual CPU Usage'>
            {cpuNo ?
              <div>
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
                           'cpus.' + cpuNo + '.user',
                           'cpus.' + cpuNo + '.sys',
                           'cpus.' + cpuNo + '.wait',
                           'cpus.' + cpuNo + '.nice',
                           'cpus.' + cpuNo + '.steal'
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
              </div>
            : null}
            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th></th>
                  <th>User</th>
                  <th>System</th>
                  <th>Wait</th>
                  <th>Nice</th>
                  <th>Steal</th>
                </tr>
              </thead>

              <tbody>
                {cpus.map((index) =>
                  <tr key={'cpu-' + index}
                      onClick={() => this.selectCpu(index)}
                      className={classnames({
                        'active': name === cpuNo
                      })}>
                    <td>CPU {index}</td>
                    <Mtd metric={'cpus.' + index + '.user'}
                         snapshot={snapshot}
                         formatter={percentageZeroDecimalPlaces} />
                    <Mtd metric={'cpus.' + index + '.sys'}
                         snapshot={snapshot}
                         formatter={percentageZeroDecimalPlaces} />
                    <Mtd metric={'cpus.' + index + '.wait'}
                         snapshot={snapshot}
                         formatter={percentageZeroDecimalPlaces} />
                    <Mtd metric={'cpus.' + index + '.nice'}
                         snapshot={snapshot}
                         formatter={percentageZeroDecimalPlaces} />
                    <Mtd metric={'cpus.' + index + '.steal'}
                         snapshot={snapshot}
                         formatter={percentageZeroDecimalPlaces} />
                  </tr>
                ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
          : null}

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

          <DashboardSection title='Filesystems'>
            <FilesystemsTable snapshot={snapshot}
                              timeframe={timeframe}/>
          </DashboardSection>


          <DashboardSection title='Network Interfaces'>
            <NetworkInterfacesTable snapshot={snapshot}
                                    timeframe={timeframe} />
          </DashboardSection>

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
