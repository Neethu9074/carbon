'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import ContentHeading from 'in-components/ContentHeading';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Separator from 'in-components/Separator';

const rpt = React.PropTypes;

const chartHeight = 300;

const ElasticsearchDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired,
    width: rpt.number.isRequired
  },

  render() {
    return (
      <div>
        <ContentHeading>Documents</ContentHeading>

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
                             'indices.document_count',
                             'indices.deleted_count'
                           ],
                           labels: [
                             'Documents',
                             'Deleted'
                           ],
                           type: 'line'
                         }}/>

        <Separator />

        <ContentHeading>Refresh and Flush</ContentHeading>

        <ChartWithLegend snapshot={this.props.snapshot}
                         windowSize={this.props.timeframe}
                         width={this.props.width}
                         height={chartHeight}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           metrics: [
                             'indices.refresh_count',
                             'indices.flush_count'
                           ],
                           lables: [
                             'Refresh Count',
                             'Flush Count'
                           ],
                           type: 'line'
                         }}
                         y2={{
                           metrics: [
                             'indices.refresh_time',
                             'indices.flush_time'
                           ],
                           lables: [
                             'Refresh Time',
                             'Flush Time'
                           ],
                           formatter: (d) => d / 1000 + ' s',
                           type: 'line'
                         }}/>

        <Separator />

        <ContentHeading>Lucene Segments</ContentHeading>

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
                             'indices.segment_count'
                           ],
                           labels: [
                             'Segments'
                           ],
                           type: 'stackedArea'
                         }}/>
      </div>
    );
  }

});

export default ElasticsearchDashboard;
