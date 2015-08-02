'use strict';

import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import formatBytes from 'in-services/converters';
import classnames from 'in-services/util/classnames';
import ContentHeading from 'in-components/ContentHeading';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';
import Separator from 'in-components/Separator';

const rpt = React.PropTypes;

const chartHeight = 300;

const ElasticsearchDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  getInitialState() {
    return {
      indexName: null
    };
  },

  render() {
    const indices = this.props.snapshot.getIn(['data', 'index.names']);
    return (
      <div>
        <ContentHeading>Total Documents</ContentHeading>
        <ChartWithLegend snapshot={this.props.snapshot}
                         windowSize={this.props.timeframe}
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
        <ContentHeading>Indices</ContentHeading>
        {this.state.indexName ?
          <div>
            <ChartWithLegend snapshot={this.props.snapshot}
                   windowSize={this.props.timeframe}
                   height={chartHeight}
                   margins={{
                     left: 80,
                     right: 80
                   }}

                   y1={{
                     metrics: [
                       'index.' + this.state.indexName + '.document_count',
                       'index.' + this.state.indexName + '.deleted_count'
                     ],
                     labels: [
                       'Documents',
                       'Deletions'
                     ],
                     type: 'line'
                   }}
                   y2={{
                     metrics: [
                       'index.' + this.state.indexName + '.size'
                     ],
                     labels: [
                       'Size'
                     ],
                     formatter: formatBytes,
                     type: 'line'
                    }}/>
          </div>
        : null}

        <table className='in-subtle-table in-subtle-table--clickable'>
          <thead>
            <tr>
              <th>Index</th>
              <th>Documents</th>
              <th>Deleted</th>
              <th>Size</th>
            </tr>
          </thead>

          <tbody>
            {indices.map((name) =>
              <tr key={name}
                  onClick={() => this.selectIndex(name)}
                  className={classnames({
                    'active': name === this.state.indexName
                  })}>
                <td>{name}</td>
                <Mtd metric={'index.' + name + '.document_count'}
                     snapshot={this.props.snapshot} />
                <Mtd metric={'index.' + name + '.deleted_count'}
                     snapshot={this.props.snapshot} />
                <Mtd metric={'index.' + name + '.size'}
                     snapshot={this.props.snapshot}
                     formatter={formatBytes} />
              </tr>
            ).valueSeq()}
          </tbody>
        </table>

        <Separator />
        <ContentHeading>Refresh and Flush</ContentHeading>
        <ChartWithLegend snapshot={this.props.snapshot}
                         windowSize={this.props.timeframe}
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
  },

  selectIndex(index) {
    this.setState({
      indexName: index
    });
  }

});

export default ElasticsearchDashboard;
