import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';
import {capitalize} from 'in-services/formatters/string';
import {muSecondsToMillisZeroDecimalPlaces} from 'in-services/formatters/number';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

import ClusterSummary from '../ClusterSummary';

const chartHeight = 200;
export default React.createClass({

  displayName: 'CassandraClusterDashboard',

  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    return (
      <div>
        <DashboardSection title='Summary'>
          <ClusterSummary snapshot={snapshot}/>
        </DashboardSection>

        <DashboardSection title='Overall Requests'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
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
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>

        {['read', 'write'].map(op =>
            <DashboardSection title={'Client ' + capitalize(op) + ' Request Latencies Average'}
                              key={op}>
              <ChartWithLegend snapshotId={snapshot.get('id')}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                left: 80
                               }}
                               y1={{
                               min: 0,
                               formatter: muSecondsToMillisZeroDecimalPlaces,
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
      </div>
    );
  }
});
