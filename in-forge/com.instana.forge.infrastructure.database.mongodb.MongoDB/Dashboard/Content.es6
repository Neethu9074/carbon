'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {
  formatBytes,
  formatPercentageShort
} from 'in-services/converters';

import ContentHeading from 'in-components/ContentHeading';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Separator from 'in-components/Separator';

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
        <ContentHeading>Database Size</ContentHeading>
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

        <Separator />
        <ContentHeading>Index Cache</ContentHeading>
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

        <Separator/>
        <ContentHeading>Document Counter</ContentHeading>
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

        <Separator/>
        <ContentHeading>Clients</ContentHeading>
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

      </div>
    );
  }

});

export default MongoDBDashboard;
