'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import {
  formatPercentageShort
} from 'instana-ui-services/converters';

import ContentHeading from 'instana-ui-components/ContentHeading';
import ChartWithLegend from 'instana-ui-components/ChartWithLegend';
import Separator from 'instana-ui-components/Separator';

const rpt = React.PropTypes;

const chartHeight = 300;

const MongoDBDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <ContentHeading>Clients</ContentHeading>
        <ChartWithLegend snapshot={this.props.snapshot}
                         windowSize={this.props.timeframe}
                         width={this.props.width}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           metrics: [
                             'connected'
                           ],
                           labels: [
                             'Connections',
                             'Blocked'
                           ],
                           type: 'line'
                         }}/>

        <Separator/>
        <ContentHeading>Index Cache</ContentHeading>

        <ChartWithLegend snapshot={this.props.snapshot}
                         windowSize={this.props.timeframe}
                         width={this.props.width}
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
                           type: 'stackedArea'
                         }}/>

        <Separator/>
        <ContentHeading>Document Counter</ContentHeading>

        <ChartWithLegend snapshot={this.props.snapshot}
                         windowSize={this.props.timeframe}
                         width={this.props.width}
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

      </div>
    );
  }

});

export default MongoDBDashboard;
