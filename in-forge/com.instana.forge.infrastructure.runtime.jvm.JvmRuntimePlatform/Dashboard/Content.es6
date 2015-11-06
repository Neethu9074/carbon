import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import ResponsiveTable from 'in-components/ResponsiveTable';

import {
  formatBytes,
  formatBytesShort
} from 'in-services/converters';
import {getMaxValue} from 'in-sdk/metrics';
import {
  getFullSnapshot,
  extractCoordinates,
  getRawPayload
} from 'in-services/snapshots';
import connectTo from 'in-components/hoc/connectTo';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';

const rpt = React.PropTypes;

const chartHeight = 200;

export default connectTo(
  props => {
    // temporarily doing the Java app discovery without the
    // wiring.
    const javaAppCoords = extractCoordinates({
      hostId: props.snapshot.get('hostId'),
      pluginId: 'javaApp',
      steadyId: props.snapshot.getIn(['data', 'pid'])
    });
    return {
      javaApp: getFullSnapshot(javaAppCoords),
      outgoingConnections: getRawPayload(javaAppCoords, 'connections.outgoing')
    };
  },
  React.createClass({
    displayName: 'JVMDashboard',
    mixins: [React.addons.PureRenderMixin, IntlMixin],

    propTypes: {
      snapshot: irpt.map.isRequired,
      timeframe: rpt.number.isRequired,
      javaApp: irpt.map,
      outgoingConnections: rpt.any
    },

    getInitialState() {
      return {
        poolName: null
      };
    },

    render() {
      console.log('Java App', this.props.javaApp);
      console.log('Outgoing Connections', this.props.outgoingConnections);

      const pools = this.props.snapshot.getIn(['data', 'jvm.pools']);
      const collectors = this.props.snapshot.getIn(['data', 'jvm.collectors']);
      return (
        <div>

          <DashboardSection title='Threads'>
            <ChartWithLegend snapshot={this.props.snapshot}
                             windowSize={this.props.timeframe}
                             height={chartHeight}
                             margins={{
                               left: 60
                             }}

                             y1={{
                               min: 0,
                               metrics: [
                                 'threads.new',
                                 'threads.runnable',
                                 'threads.timed-waiting',
                                 'threads.waiting',
                                 'threads.blocked',
                                 'threads.terminated'
                               ],
                               labels: [
                                 'New',
                                 'Runnable',
                                 'Timed-Waiting',
                                 'Waiting',
                                 'Blocked',
                                 'Terminated'
                               ],
                               type: 'stackedArea'
                             }}/>
          </DashboardSection>

          <DashboardSection title='Memory'>
            <ChartWithLegend snapshot={this.props.snapshot}
                             windowSize={this.props.timeframe}
                             height={chartHeight}
                             margins={{
                               left: 100
                             }}
                             y1={{
                               min: 0,
                               max: this.props.snapshot.getIn(['data', 'memory.max']),
                               formatter: formatBytes,
                               tooltipFormatter: formatBytes,
                               metrics: [
                                 'memory.used'
                               ],
                               labels: [
                                 'Used'
                               ],
                               type: 'stackedArea'
                             }}/>
          </DashboardSection>

          { pools ?
            <DashboardSection title='Memory Pools'>
              {this.state.poolName ?
                <ChartWithLegend snapshot={this.props.snapshot}
                       windowSize={this.props.timeframe}
                       height={chartHeight}
                       margins={{
                         left: 80
                       }}

                       y1={{
                         max: getMaxValue(
                           'pools.' + this.state.poolName,
                           this.props.snapshot
                         ),
                         formatter: formatBytesShort,
                         tooltipFormatter: formatBytes,
                         metrics: [
                           'pools.' + this.state.poolName
                         ],
                         labels: [
                           this.state.poolName + ' Usage'
                         ],
                         type: 'line'
                       }}/>
              : null}

              <ResponsiveTable clickable={true}>
                <thead>
                  <tr>
                    <th>Pool</th>
                    <th>Initial</th>
                    <th>Maximum</th>
                    <th>Used</th>
                  </tr>
                </thead>

                <tbody>
                  {pools.map((data, name) =>
                    <tr key={name} onClick={() => this.selectPool(name)}>
                      <td>{name}</td>
                      <td>{formatBytes(data.get('initial'))}</td>
                      <td>{this.formatMax(data.get('max'))}</td>
                      <Mtd metric={'pools.' + name}
                           snapshot={this.props.snapshot}
                           formatter={formatBytes} />
                    </tr>
                  ).valueSeq()}
                </tbody>
              </ResponsiveTable>
            </DashboardSection>
          : null}

          {collectors ?
            <DashboardSection title='Garbage Collection'>
              <ChartWithLegend snapshot={this.props.snapshot}
                     windowSize={this.props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80,
                       right: 80
                     }}

                     y1={{
                       metrics: collectors.map((name) =>
                                  'gc.' + name + '.time'
                                ).toArray(),
                       labels: collectors.map((name) =>
                                  name + ' Time'
                                ).toArray(),
                       type: 'line',
                       formatter: (d) => d / 1000 + ' s'
                       }}

                     y2={{
                       metrics: collectors.map((name) =>
                                  'gc.' + name + '.inv'
                                ).toArray(),
                       labels: collectors.map((name) =>
                                  name + ' Invocations'
                                ).toArray(),
                       type: 'point'
                     }}/>
            </DashboardSection>
          : null}
        </div>
      );
    },

    formatMax(bytes) {
      return bytes === -1 ? 'unlimited' : formatBytes(bytes);
    },

    selectPool(pool) {
      this.setState({
        poolName: pool
      });
    }

}));
