import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ResponsiveTable from 'in-components/ResponsiveTable';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import classnames from 'in-services/util/classnames';
import {timeframeShape} from 'in-stores/timeline';
import {
  zeroDecimalPlaces,
  withSiMultiplyPrefixZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import Mtd from 'in-components/Mtd';


const chartHeight = 200;

const ElasticsearchDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  getInitialState() {
    return {
      indexName: null
    };
  },

  render() {
    const timeframe = this.props.timeframe;
    const indexName = this.state.indexName;
    const snapshot = this.props.snapshot;

    const indices = snapshot.getIn(['data', 'index.names']);

    return (
      <div>
        <DashboardSection title='Total Documents'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
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
                             formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                             tooltipFormatter: zeroDecimalPlaces,
                             type: 'line'
                           }}/>
        </DashboardSection>
        {indices ?
          <DashboardSection title='Indices'>
            {indexName ?
              <div>
                <ChartWithLegend snapshot={snapshot}
                                 timeframe={timeframe}
                                 height={chartHeight}
                                 margins={{
                                   left: 80,
                                   right: 80
                                 }}

                                 y1={{
                                   metrics: [
                                     'index.' + indexName + '.document_count',
                                     'index.' + indexName + '.deleted_count'
                                   ],
                                   labels: [
                                     'Documents',
                                     'Deletions'
                                   ],
                                   formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                                   tooltipFormatter: zeroDecimalPlaces,
                                   type: 'line'
                                 }}
                                 y2={{
                                   metrics: [
                                     'index.' + indexName + '.size'
                                   ],
                                   labels: [
                                     'Size'
                                   ],
                                   formatter: bytesZeroDecimalPlaces,
                                   tooltipFormatter: bytesTwoDecimalPlaces,
                                   type: 'line'
                                  }}/>
              </div>
              : null}

            <ResponsiveTable clickable={true}>
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
                        'active': name === indexName
                      })}>
                    <td>{name}</td>
                    <Mtd metric={'index.' + name + '.document_count'}
                         formatter={withSiMultiplyPrefixZeroDecimalPlaces}
                         snapshot={snapshot}/>
                    <Mtd metric={'index.' + name + '.deleted_count'}
                         formatter={withSiMultiplyPrefixZeroDecimalPlaces}
                         snapshot={snapshot}/>
                    <Mtd metric={'index.' + name + '.size'}
                         snapshot={snapshot}
                         formatter={bytesTwoDecimalPlaces}/>
                  </tr>
              ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}

        <DashboardSection title='Refresh and Flush'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80,
                             right: 80
                           }}
                           y1={{
                             metrics: [
                               'indices.refresh_count',
                               'indices.flush_count'
                             ],
                             labels: [
                               'Refresh Count',
                               'Flush Count'
                             ],
                             formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                             tooltipFormatter: zeroDecimalPlaces,
                             type: 'line'
                           }}
                           y2={{
                             metrics: [
                               'indices.refresh_time',
                               'indices.flush_time'
                             ],
                             labels: [
                               'Refresh Time',
                               'Flush Time'
                             ],
                             formatter: (d) => d / 1000 + ' s',
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Lucene Segments'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
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
                             formatter: withSiMultiplyPrefixZeroDecimalPlaces,
                             tooltipFormatter: zeroDecimalPlaces,
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
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
