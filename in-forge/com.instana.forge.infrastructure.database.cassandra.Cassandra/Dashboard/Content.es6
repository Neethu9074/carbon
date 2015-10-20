

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import d3 from 'd3';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'in-services/converters';

import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';

import ChartWithLegend from 'in-components/ChartWithLegend';


const rpt = React.PropTypes;

const chartHeight = 200;
const commasFormatter = d3.format(',.0f');
const percentFormatter = d => commasFormatter(d * 100) + '%';

const CassandraDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    const keyspaces = this.props.snapshot.get('data').get('keyspaces');

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
                               'requests.read',
                               'requests.write'
                             ],
                             labels: [
                               'Read',
                               'Write'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Pending Requests in Threadpools (Stages)'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'stage.mutation.pending',
                               'stage.read.pending',
                               'stage.countermutation.pending',
                               'stage.readrepair.pending',
                               'stage.requestresponse.pending'
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

        {keyspaces ?
          <DashboardSection title='Keyspaces'>
          <ResponsiveTable clickable={false}>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {keyspaces.map(keyspace =>
                <tr key={keyspace}
                    onClick={() => this.selectFilesystem(name)}>
                  <td>{keyspace}</td>
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>
        : null }

        <DashboardSection title='Storage Load'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: formatBytes,
                             metrics: [
                               'storage.load'
                             ],
                             labels: [
                               'Load'
                             ],
                             type: 'stackedArea'
                           }}/>
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

        <DashboardSection title='Sorted Strings Tables'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'sstables'
                             ],
                             labels: [
                               'Tables'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
      </div>
    );
  }

});

export default CassandraDashboard;
