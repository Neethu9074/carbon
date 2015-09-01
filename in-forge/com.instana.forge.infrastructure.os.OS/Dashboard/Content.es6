import Immutable from 'immutable';
import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {
  formatBytes,
  formatBytesShort,
  formatPercentageShort,
  formatNumberShort,
  formatNumberSI
} from 'in-services/converters';
import {getMaxValue} from 'in-sdk/metrics';

import classnames from 'in-services/util/classnames';
import DashboardSection from 'in-components/DashboardSection';
import HelpLink from 'in-components/HelpLink';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';

const rpt = React.PropTypes;

const bytesPerSecondFormatter = d => formatBytesShort(d) + '/s';
const kbFormatter = d => formatBytes(d * 1024);
const kbFormatterShort = d => formatBytesShort(d * 1024);

const chartHeight = 200;

const OsDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  getInitialState() {
    return {
      cpuNo: null,
      filesystemName: null,
      interfaceName: null
    };
  },

  render() {
    const cpuCount = this.props.snapshot.getIn(['data', 'cpu.count']);
    const filesystems = this.props.snapshot.getIn(['data', 'filesystems']);
    const interfaces = this.props.snapshot.getIn(['data', 'interfaces']);

    const cpus = Immutable.Range(1, cpuCount + 1);

    return (
      <div>
        <DashboardSection title='CPU Usage'>
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
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
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
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
            {this.state.cpuNo ?
              <div>
                <ChartWithLegend snapshot={this.props.snapshot}
                       windowSize={this.props.timeframe}
                       height={chartHeight}
                       margins={{
                         left: 60
                       }}
                       y1={{
                         min: 0,
                         max: 1,
                         formatter: formatPercentageShort,
                         metrics: [
                           'cpus.' + this.state.cpuNo + '.user',
                           'cpus.' + this.state.cpuNo + '.sys',
                           'cpus.' + this.state.cpuNo + '.wait',
                           'cpus.' + this.state.cpuNo + '.nice',
                           'cpus.' + this.state.cpuNo + '.steal'
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

            <table className='in-subtle-table in-subtle-table--clickable'>
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
                        'active': name === this.state.cpuNo
                      })}>
                    <td>CPU {index}</td>
                    <Mtd metric={'cpus.' + index + '.user'}
                         snapshot={this.props.snapshot}
                         formatter={formatPercentageShort} />
                    <Mtd metric={'cpus.' + index + '.sys'}
                         snapshot={this.props.snapshot}
                         formatter={formatPercentageShort} />
                    <Mtd metric={'cpus.' + index + '.wait'}
                         snapshot={this.props.snapshot}
                         formatter={formatPercentageShort} />
                    <Mtd metric={'cpus.' + index + '.nice'}
                         snapshot={this.props.snapshot}
                         formatter={formatPercentageShort} />
                    <Mtd metric={'cpus.' + index + '.steal'}
                         snapshot={this.props.snapshot}
                         formatter={formatPercentageShort} />
                  </tr>
                ).valueSeq()}
              </tbody>
            </table>
          </DashboardSection>
        : null}

        <DashboardSection title='Memory Free'>
          <ChartWithLegend snapshot={this.props.snapshot}
                 windowSize={this.props.timeframe}
                 height={chartHeight}
                 margins={{
                   left: 80
                 }}
                 y1={{
                   min: 0,
                   max: this.props.snapshot.getIn(['data', 'memory.total']),
                   formatter: formatBytesShort,
                   metrics: [
                     'memory.free'
                   ],
                   labels: ['Free'],
                   type: 'stackedArea'
                 }}/>
        </DashboardSection>

        <DashboardSection title={this.getIntlMessage('forge.os.filesystems')}>

          {this.state.filesystemName ?
            <div>
              <ChartWithLegend snapshot={this.props.snapshot}
                     windowSize={this.props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80,
                       right: 80
                     }}

                     y1={{
                       min: 0,
                       max: getMaxValue(
                         'fs.' + this.state.filesystemName + '.free',
                         this.props.snapshot
                       ),
                       formatter: kbFormatterShort,
                       metrics: [
                         'fs.' + this.state.filesystemName + '.free',
                         'fs.' + this.state.filesystemName + '.leaked'
                       ],
                       labels: ['Free', 'Leaked'],
                       type: 'line'
                     }}

                     y2={{
                       min: 0,
                       max: getMaxValue(
                         'fs.' + this.state.filesystemName + '.ifree',
                         this.props.snapshot
                       ),
                       metrics: [
                         'fs.' + this.state.filesystemName + '.ifree'
                       ],
                       labels: ['iFree'],
                       type: 'line',
                       formatter: formatNumberSI
                     }}/>
            </div>
          : null}

          <table className='in-subtle-table in-subtle-table--clickable'>
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
                      'active': name === this.state.filesystemName
                    })}>
                  <td>{name}</td>
                  <td>{data.get('mount')}</td>
                  <td>{data.get('options')}</td>
                  <td>{data.get('systype')}</td>
                  <td>{kbFormatter(data.get('capacity'))}</td>
                  <Mtd metric={'fs.' + name + '.free'}
                       snapshot={this.props.snapshot}
                       formatter={kbFormatter} />
                  <Mtd metric={'fs.' + name + '.leaked'}
                       snapshot={this.props.snapshot}
                       formatter={kbFormatter} />
                  <Mtd metric={'fs.' + name + '.ifree'}
                       snapshot={this.props.snapshot}
                       formatter={formatNumberSI} />
                </tr>
              ).valueSeq()}
            </tbody>
          </table>
        </DashboardSection>

        <DashboardSection title={this.getIntlMessage('forge.os.networkinterfaces')}>
          {this.state.interfaceName ?
            <div>
              <ChartWithLegend snapshot={this.props.snapshot}
                     windowSize={this.props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80,
                       right: 80
                     }}

                     y1={{
                       min: 0,
                       formatter: formatBytesShort,
                       metrics: [
                         'ifs.' + this.state.interfaceName + '.rx.bytes',
                         'ifs.' + this.state.interfaceName + '.tx.bytes'
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
                         'ifs.' + this.state.interfaceName + '.rx.errors',
                         'ifs.' + this.state.interfaceName + '.rx.dropped',
                         'ifs.' + this.state.interfaceName + '.rx.overruns',
                         'ifs.' + this.state.interfaceName + '.tx.errors',
                         'ifs.' + this.state.interfaceName + '.tx.dropped',
                         'ifs.' + this.state.interfaceName + '.tx.overruns'
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

          <table className='in-subtle-table in-subtle-table--clickable'>
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
                      'active': name === this.state.interfaceName
                    })}>
                  <td>{name}</td>
                  <td>{data.get('mac')}</td>
                  <td>{data.get('ips').join(', ')}</td>
                  <Mtd metric={'ifs.' + name + '.rx.bytes'}
                       snapshot={this.props.snapshot}
                       formatter={bytesPerSecondFormatter} />
                  <Mtd metric={'ifs.' + name + '.rx.errors'}
                       snapshot={this.props.snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.rx.dropped'}
                       snapshot={this.props.snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.rx.overruns'}
                       snapshot={this.props.snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.tx.bytes'}
                       snapshot={this.props.snapshot}
                       formatter={bytesPerSecondFormatter} />
                  <Mtd metric={'ifs.' + name + '.tx.errors'}
                       snapshot={this.props.snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.tx.dropped'}
                       snapshot={this.props.snapshot}
                       formatter={formatPercentageShort} />
                  <Mtd metric={'ifs.' + name + '.tx.overruns'}
                       snapshot={this.props.snapshot}
                       formatter={formatPercentageShort} />
                </tr>
              ).valueSeq()}
            </tbody>
          </table>
        </DashboardSection>

        <DashboardSection title='TCP Activity'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
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

});

export default OsDashboard;
