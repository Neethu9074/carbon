import irpt from 'react-immutable-proptypes';
import {IntlMixin} from 'react-intl';
import Immutable from 'immutable';
import React from 'react/addons';

import {
  formatBytes,
  formatBytesShort,
  formatPercentageShort,
  formatNumberShort,
  formatNumberSI
} from 'in-services/converters';
import {getMaxValue} from 'in-sdk/metrics';

import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import classnames from 'in-services/util/classnames';
import connectTo from 'in-components/hoc/connectTo';
import {getRawPayload} from 'in-services/snapshots';
import HelpLink from 'in-components/HelpLink';
import Mtd from 'in-components/Mtd';

const rpt = React.PropTypes;

const bytesPerSecondFormatter = d => formatBytesShort(d) + '/s';
const kbFormatter = d => formatBytes(d * 1024);
const kbFormatterShort = d => formatBytesShort(d * 1024);

const chartHeight = 200;

export default connectTo(
  props => {
    return {
      processes: getRawPayload(props.snapshot, 'processes')
    };
  },
  React.createClass({
  displayName: 'HostDashboard',

  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired,
    processes: rpt.array
  },

  getInitialState() {
    return {
      filesystemName: null,
      interfaceName: null,
      cpuNo: null
    };
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    const filesystemName = this.state.filesystemName;
    const interfaceName = this.state.interfaceName;
    const cpuNo = this.state.cpuNo;

    const filesystems = snapshot.getIn(['data', 'filesystems']);
    const interfaces = snapshot.getIn(['data', 'interfaces']);
    const cpuCount = snapshot.getIn(['data', 'cpu.count']);

    const cpus = Immutable.Range(1, cpuCount + 1);

    return (
      <div>
        <DashboardSection title='CPU Usage'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   min: 0,
                   max: 1,
                   formatter: formatPercentageShort,
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

        <DashboardSection title='CPU Load'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 60
                 }}
                 y1={{
                   min: 0,
                   type: 'stackedArea',
                   metrics: [
                     'load.1min'
                   ],
                   labels: ['Load']
                 }}/>
        </DashboardSection>

        {cpuCount > 1 ?

        <DashboardSection title='Individual CPU Usage'>
          {cpuNo ?
            <div>
              <ChartWithLegend snapshot={snapshot}
                     windowSize={timeframe}
                     height={chartHeight}
                     margins={{
                       left: 60
                     }}
                     y1={{
                       min: 0,
                       max: 1,
                       formatter: formatPercentageShort,
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
                       formatter={formatPercentageShort} />
                  <Mtd metric={'cpus.' + index + '.sys'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'cpus.' + index + '.wait'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'cpus.' + index + '.nice'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'cpus.' + index + '.steal'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>
        : null}

        <DashboardSection title='Memory Free'>
          <ChartWithLegend snapshot={snapshot}
                 windowSize={timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   min: 0,
                   max: snapshot.getIn(['data', 'memory.total']),
                   formatter: formatBytesShort,
                   metrics: [
                     'memory.free'
                   ],
                   labels: ['Free'],
                   type: 'stackedArea'
                 }}/>
        </DashboardSection>

        <DashboardSection title={this.getIntlMessage('forge.os.filesystems')}>

          {filesystemName ?
            <div>
              <ChartWithLegend snapshot={snapshot}
                     windowSize={timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80,
                       right: 80
                     }}

                     y1={{
                       min: 0,
                       max: getMaxValue(
                         'fs.' + filesystemName + '.free',
                         snapshot
                       ),
                       formatter: kbFormatterShort,
                       metrics: [
                         'fs.' + filesystemName + '.free',
                         'fs.' + filesystemName + '.leaked'
                       ],
                       labels: ['Free', 'Leaked'],
                       type: 'line'
                     }}

                     y2={{
                       min: 0,
                       max: getMaxValue(
                         'fs.' + filesystemName + '.ifree',
                         snapshot
                       ),
                       metrics: [
                         'fs.' + filesystemName + '.ifree'
                       ],
                       labels: ['iFree'],
                       type: 'line',
                       formatter: formatNumberSI
                     }}/>
            </div>
          : null}

          <ResponsiveTable clickable={true}>
            <thead>
              <tr>
                <th>Device</th>
                <th>Mount</th>
                <th>Options</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Free</th>
                <th>
                  <HelpLink helpId='203876231'>
                    Leaked
                  </HelpLink>
                </th>
                <th>iFree</th>
              </tr>
            </thead>

            <tbody>
              {filesystems.map((data, name) =>
                <tr key={name}
                    onClick={() => this.selectFilesystem(name)}
                    className={classnames({
                      'active': name === filesystemName
                    })}>
                  <td>{name}</td>
                  <td>{data.get('mount')}</td>
                  <td>{data.get('options')}</td>
                  <td>{data.get('systype')}</td>
                  <td>{kbFormatter(data.get('capacity'))}</td>
                  <Mtd metric={'fs.' + name + '.free'}
                       snapshot={snapshot}
                       formatter={kbFormatter} />
                  <Mtd metric={'fs.' + name + '.leaked'}
                       snapshot={snapshot}
                       formatter={kbFormatter} />
                  <Mtd metric={'fs.' + name + '.ifree'}
                       snapshot={snapshot}
                       formatter={formatNumberSI} />
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>

        <DashboardSection title={this.getIntlMessage('forge.os.networkinterfaces')}>
          {interfaceName ?
            <div>
              <ChartWithLegend snapshot={snapshot}
                     windowSize={timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80,
                       right: 80
                     }}

                     y1={{
                       min: 0,
                       formatter: formatBytesShort,
                       metrics: [
                         'ifs.' + interfaceName + '.rx.bytes',
                         'ifs.' + interfaceName + '.tx.bytes'
                       ],
                       labels: [
                         'Received',
                         'Transmitted'
                       ],
                       type: 'line'
                     }}
                     y2={{
                       min: 0,
                       max: 1,
                       metrics: [
                         'ifs.' + interfaceName + '.rx.errors',
                         'ifs.' + interfaceName + '.rx.dropped',
                         'ifs.' + interfaceName + '.rx.overruns',
                         'ifs.' + interfaceName + '.tx.errors',
                         'ifs.' + interfaceName + '.tx.dropped',
                         'ifs.' + interfaceName + '.tx.overruns'
                       ],
                       labels: [
                         'RX Errors',
                         'RX Dropped',
                         'RX Overruns',
                         'TX Errors',
                         'TX Dropped',
                         'TX Overruns'
                       ],
                       formatter: formatPercentageShort,
                       type: 'line'
                     }}/>
            </div>
          : null}

          <ResponsiveTable clickable={true}>
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th colSpan='4'>Received (RX)</th>
                <th colSpan='4'>Transmitted (TX)</th>
              </tr>
              <tr>
                <th>Interface</th>
                <th>Mac</th>
                <th>IPs</th>

                <th style={{width: '10em'}}>Bytes</th>
                <th style={{width: '4em'}}>Errors</th>
                <th style={{width: '4em'}}>Dropped</th>
                <th style={{width: '4em'}}>Overruns</th>

                <th style={{width: '10em'}}>Bytes</th>
                <th style={{width: '4em'}}>Errors</th>
                <th style={{width: '4em'}}>Dropped</th>
                <th style={{width: '4em'}}>Overruns</th>
              </tr>
            </thead>

            <tbody>
              {interfaces.map((data, name) =>
                <tr key={name}
                    onClick={() => this.selectInterface(name)}
                    className={classnames({
                      'active': name === interfaceName
                    })}>
                  <td>{name}</td>
                  <td>{data.get('mac')}</td>
                  <td>{data.get('addresses').map(address => address.get('ip')).join(', ')}</td>
                  <Mtd metric={'ifs.' + name + '.rx.bytes'}
                       snapshot={snapshot}
                       formatter={bytesPerSecondFormatter} />
                  <Mtd metric={'ifs.' + name + '.rx.errors'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.rx.dropped'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.rx.overruns'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.tx.bytes'}
                       snapshot={snapshot}
                       formatter={bytesPerSecondFormatter} />
                  <Mtd metric={'ifs.' + name + '.tx.errors'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.tx.dropped'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.tx.overruns'}
                       snapshot={snapshot}
                       formatter={formatPercentageShort} />
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>

        <DashboardSection title='TCP Activity'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
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
                             formatter: formatNumberShort
                           }}
                           y2={{
                             type: 'line',
                             metrics: [
                               'tcp.resets',
                               'tcp.fails',
                               'tcp.errors',
                               'tcp.retrans'
                             ],
                             labels: [
                               'Reset',
                               'Fail',
                               'Error',
                               'Retransmission'
                             ],
                             min: 0,
                             max: 1,
                             formatter: formatPercentageShort
                           }}
                           margins={{
                             right: 60,
                             left: 80
                           }}/>
        </DashboardSection>

        {this.props.processes && this.props.processes.length > 0 ?
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
              {this.props.processes.map(process =>
                <tr key={process.pid}>
                  <td>{process.pid}</td>
                  <td>{process.name}</td>
                  <td>{process.cpu}</td>
                  <td>{formatBytes(process.memory)}</td>
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

  selectFilesystem(fs) {
    this.setState({
      filesystemName: fs
    });
  },

  selectInterface(iface) {
    this.setState({
      interfaceName: iface
    });
  }
}));
