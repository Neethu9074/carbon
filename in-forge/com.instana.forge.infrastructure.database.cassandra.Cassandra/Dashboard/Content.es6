

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';
import irpt from 'react-immutable-proptypes';

import {formatBytesShort, capitalize} from 'in-services/converters';
import classnames from 'in-services/util/classnames';

import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';


const rpt = React.PropTypes;

const chartHeight = 200;
const commasFormatter = d3.format(',.0f');
const percentFormatter = d => commasFormatter(d * 100) + '%';
const muSecondsToMillisFormatter = muSeconds => +(Math.round(muSeconds / 1000.0 + 'e+2')  + 'e-2') + ' ms';
const muSecondsFormatter = muSeconds => muSeconds + ' µs';

const CassandraDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  getInitialState() {
    return {
      selectedKeyspace: null
    };
  },

  render() {
    const keyspaces = this.props.snapshot.get('data').get('keyspaces').sort();

    return (
      <div>
        <DashboardSection title='Requests'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'clientrequests.read.count',
                               'clientrequests.write.count'
                             ],
                             labels: [
                               'Read',
                               'Write'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        {['read', 'write'].map( op =>
          <DashboardSection title={'Client ' + capitalize(op) + ' Request Latencies'}>
            <ChartWithLegend snapshot={this.props.snapshot}
                             windowSize={this.props.timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               formatter: muSecondsToMillisFormatter,
                               metrics: [
                                 'clientrequests.' + op + '.mean',
                                 'clientrequests.' + op + '.50',
                                 'clientrequests.' + op + '.95',
                                 'clientrequests.' + op + '.99'
                               ],
                               labels: [
                                 'Mean',
                                 '50th Percentile',
                                 '95th Percentile',
                                 '99th Percentile'
                               ],
                               type: 'line'
                             }}/>
          </DashboardSection>
        )}

        {['pending', 'blocked'].map( stage =>
          <DashboardSection title={capitalize(stage) + ' Requests in Threadpools (Stages)'}>
            <ChartWithLegend snapshot={this.props.snapshot}
                             windowSize={this.props.timeframe}
                             height={chartHeight}
                             margins={{
                               left: 80
                             }}
                             y1={{
                               min: 0,
                               metrics: [
                                 'stage.mutation.' + stage,
                                 'stage.read.' + stage,
                                 'stage.countermutation.' + stage,
                                 'stage.readrepair.' + stage,
                                 'stage.requestresponse.' + stage,
                                 'stage.memtableflushwriter.' + stage
                               ],
                               labels: [
                                 'Write (Mutation)',
                                 'Read',
                                 'Counter Mutation',
                                 'Read Repair',
                                 'Request/Response',
                                 'Memtable FlushWriter'
                               ],
                               type: 'line'
                             }}/>
          </DashboardSection>
        )}

        <DashboardSection title='Dropped Messages'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'blocked.MUTATION',
                               'blocked.READ',
                               'blocked.COUNTER_MUTATION',
                               'blocked.READ_REPAIR',
                               'blocked.REQUEST_RESPONSE'
                             ],
                             labels: [
                               'Write (Mutation)',
                               'Read',
                               'Counter Mutation',
                               'Read Repair',
                               'Request/Response'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title={this.state.selectedKeyspace ?
          'Keyspaces (' + this.state.selectedKeyspace + ')' : 'Keyspaces' }>
          {this.state.selectedKeyspace ?
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
                       formatter: muSecondsFormatter,
                       metrics: [
                         'keyspace.' + this.state.selectedKeyspace + '.readLatency',
                         'keyspace.' + this.state.selectedKeyspace + '.writeLatency'
                       ],
                       labels: [
                         'Average Read Latency',
                         'Average Write Latency'
                       ],
                       type: 'line'
                     }}
                     y2={{
                       min: 0,
                       metrics: [
                         'keyspace.' + this.state.selectedKeyspace + '.reads',
                         'keyspace.' + this.state.selectedKeyspace + '.writes'
                       ],
                       labels: [
                         'Reads',
                         'Writes'
                       ],
                       type: 'line'
                     }} />
            </div>
          : null}
          <ResponsiveTable clickable={true}>
            <thead>
              <tr>
                <th></th>
                <th>Reads</th>
                <th>Avg. Read Latency</th>
                <th>Writes</th>
                <th>Avg. Write Latency</th>
                <th>SSTables</th>
                <th>Disk Space</th>
              </tr>
            </thead>

            <tbody>
              {keyspaces.map(keyspaceName =>
                <tr key={'keyspace-' + keyspaceName}
                    onClick={() => this.selectKeyspace(keyspaceName)}
                    className={classnames({
                      'active': keyspaceName === this.state.selectedKeyspace
                    })}>
                  <td>{keyspaceName}</td>
                  <Mtd metric={'keyspace.' + keyspaceName + '.reads'}
                       snapshot={this.props.snapshot} />
                  <Mtd metric={'keyspace.' + keyspaceName + '.readLatency'}
                      snapshot={this.props.snapshot}
                      formatter={muSecondsFormatter} />
                  <Mtd metric={'keyspace.' + keyspaceName + '.writes'}
                       snapshot={this.props.snapshot} />
                  <Mtd metric={'keyspace.' + keyspaceName + '.writeLatency'}
                      snapshot={this.props.snapshot}
                      formatter={muSecondsFormatter} />
                  <Mtd metric={'keyspace.' + keyspaceName + '.ssTables'}
                       snapshot={this.props.snapshot} />
                  <Mtd metric={'keyspace.' + keyspaceName + '.diskSize'}
                       snapshot={this.props.snapshot}
                       formatter={formatBytesShort} />
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>

        <DashboardSection title='Cache Hits'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: percentFormatter,
                             metrics: [
                               'cache.counter.hit',
                               'cache.key.hit',
                               'cache.row.hit'
                             ],
                             labels: [
                               'Counter',
                               'Key',
                               'Row'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Bloom Filter'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: percentFormatter,
                             metrics: [
                               'bloomFilterFalse'
                             ],
                             labels: [
                               'Miss Rate'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
      </div>
    );
  },

  selectKeyspace(keyspace) {
    this.setState({
      selectedKeyspace: keyspace
    });
  }

});

export default CassandraDashboard;
