'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {
  formatBytes,
  formatPercentageShort
} from 'in-services/converters';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 300;

const MongoDBDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    const dbs = this.props.snapshot.getIn(['data', 'databases']);

    return (
      <div>
        <DashboardSection title='Database Size'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}

                           y1={{
                             metrics: dbs.map((name) =>
                                        'dbs.' + name
                                      ).toArray()
                             ,
                             labels: dbs.map((name) =>
                                        name
                                      ).toArray()
                             ,
                             type: 'line',
                             formatter: formatBytes
                           }}/>
        </DashboardSection>

        <DashboardSection title='Index Cache'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: formatPercentageShort,
                             metrics: [
                               'index'
                             ],
                             labels: [
                               'Hit Rate'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Document Counter'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             metrics: [
                               'documents.deleted',
                               'documents.inserted',
                               'documents.returned',
                               'documents.updated'
                             ],
                             labels: [
                               'Deleted',
                               'Inserted',
                               'Returned',
                               'Updated'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Clients'>
          <ChartWithLegend snapshot={this.props.snapshot}
                           windowSize={this.props.timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'connections'
                             ],
                             labels: [
                               'Connections'
                             ],
                             type: 'line'
                         }}/>
        </DashboardSection>
      </div>
    );
  }

});

export default MongoDBDashboard;
