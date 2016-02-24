import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  time,
  withSiPrefixZeroDecimalPlaces,
  withSiPrefixTwoDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import classnames from 'in-services/util/classnames';
import {getMaxValue} from 'in-sdk/metrics';
import Mtd from 'in-components/Mtd';

const rpt = React.PropTypes;

const chartHeight = 200;

export default React.createClass({
    displayName: 'JVMDashboard',
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
      timeframe: rpt.number.isRequired,
      snapshot: irpt.map.isRequired,
      outgoingConnections: rpt.any,
      javaApp: irpt.map
    },

    getInitialState() {
      return {
        poolName: null,
        selectedJmxMetric: null
      };
    },

    render() {
      const timeframe = this.props.timeframe;
      const snapshot = this.props.snapshot;
      const poolName = this.state.poolName;

      const pools = snapshot.getIn(['data', 'jvm.pools']);
      const collectors = snapshot.getIn(['data', 'jvm.collectors']);
      const jmx = snapshot.getIn(['data', 'jmx']);
      const jmxMetrics = jmx ? jmx.toArray() : [];

      return (
        <div>
          <DashboardSection title='Threads'>
            <ChartWithLegend snapshot={snapshot}
                             windowSize={timeframe}
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
            <ChartWithLegend snapshot={snapshot}
                             windowSize={timeframe}
                             height={chartHeight}
                             margins={{
                               left: 100
                             }}
                             y1={{
                               min: 0,
                               max: snapshot.getIn(['data', 'memory.max']),
                               formatter: bytesTwoDecimalPlaces,
                               tooltipFormatter: bytesTwoDecimalPlaces,
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
              {poolName ?
                <ChartWithLegend snapshot={snapshot}
                       windowSize={timeframe}
                       height={chartHeight}
                       margins={{
                         left: 80
                       }}

                       y1={{
                         max: getMaxValue(
                           'pools.' + poolName,
                           snapshot
                         ),
                         formatter: bytesZeroDecimalPlaces,
                         tooltipFormatter: bytesTwoDecimalPlaces,
                         metrics: [
                           'pools.' + poolName
                         ],
                         labels: [
                           poolName + ' Usage'
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
                      <td>{bytesTwoDecimalPlaces(data.get('initial'))}</td>
                      <td>{this.formatMax(data.get('max'))}</td>
                      <Mtd metric={'pools.' + name}
                           snapshot={snapshot}
                           formatter={bytesTwoDecimalPlaces} />
                    </tr>
                  ).valueSeq()}
                </tbody>
              </ResponsiveTable>
            </DashboardSection>
          : null}

          {collectors ?
            <DashboardSection title='Garbage Collection'>
              <ChartWithLegend snapshot={snapshot}
                     windowSize={timeframe}
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
                       formatter: time
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

          {jmxMetrics && jmxMetrics.length > 0 ?
            <DashboardSection title='Custom JMX Metrics'>
              {this.state.selectedJmxMetric ?
                <ChartWithLegend snapshot={snapshot}
                                 windowSize={timeframe}
                                 height={chartHeight}
                                 margins={{
                                   left: 90
                                 }}
                                 y1={{
                                   formatter: withSiPrefixZeroDecimalPlaces,
                                   tooltipFormatter: withSiPrefixTwoDecimalPlaces,
                                   metrics: ['jmx.' + this.state.selectedJmxMetric],
                                   labels: [this.state.selectedJmxMetric],
                                   type: 'line'
                                 }}/>
              : null}
              <ResponsiveTable clickable={true}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Value</th>
                  </tr>
                </thead>

                <tbody>
                  {jmxMetrics.map(jmxMetric =>
                    <tr key={jmxMetric}
                        onClick={() => this.setState({selectedJmxMetric: jmxMetric})}
                        className={classnames({
                          'active': jmxMetric === this.state.selectedJmxMetric
                        })}>
                      <td>
                        {jmxMetric}
                      </td>
                      <Mtd metric={'jmx.' + jmxMetric}
                           snapshot={snapshot}
                           formatter={withSiPrefixTwoDecimalPlaces} />
                    </tr>
                  )}
                </tbody>
              </ResponsiveTable>
            </DashboardSection>
          : null}
        </div>
      );
    },

    formatMax(bytes) {
      return bytes === -1 ? 'unlimited' : bytesTwoDecimalPlaces(bytes);
    },

    selectPool(pool) {
      this.setState({
        poolName: pool
      });
    },

    renderSqlTopList() {
      const outgoingConnections = this.props.outgoingConnections;
      if (!outgoingConnections || !('jdbc' in outgoingConnections)) {
        return null;
      }

      const topQueries = outgoingConnections.jdbc.reduce((topQueriesAcc, connection) => {
        return topQueriesAcc.concat(connection.queries);
      }, []);

      if (topQueries.length === 0) {
        return null;
      }

      topQueries.sort((a, b) => {
        return a.time - b.time;
      });

      topQueries.reverse();

      return (
        <DashboardSection title='SQL Top Queries'>
          <ResponsiveTable clickable={true}>
            <thead>
              <tr>
                <th>Total Time</th>
                <th>Statement</th>
              </tr>
            </thead>
            <tbody>
              {topQueries.map(query =>
                <tr key={query.query}>
                  <td>{query.time}</td>
                  <td>{query.query}</td>
                </tr>
              )}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>
      );
    }
});
