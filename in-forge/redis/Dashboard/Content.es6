import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

const RedisDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    const dbs = snapshot.getIn(['data', 'dbs']);

    return (
      <div>
        {dbs ?
        <DashboardSection title='Database Size'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}

                           y1={{
                             metrics: dbs.map((name) =>
                                        'db.' + name
                                      ).toArray(),
                             labels: dbs.map((name) =>
                                        name
                                      ).toArray(),
                             type: 'line'
                           }}/>
        </DashboardSection>
        : null}

        <DashboardSection title='Clients'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             metrics: [
                               'connected_clients',
                               'blocked_clients'
                             ],
                             labels: [
                               'Connected',
                               'Blocked'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Memory'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: bytesTwoDecimalPlaces,
                             metrics: [
                               'used_memory'
                             ],
                             labels: [
                               'Used'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>

        <DashboardSection title='Cache'>
          <ChartWithLegend snapshot={snapshot}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: percentageZeroDecimalPlaces,
                             metrics: [
                               'hit_rate'
                             ],
                             labels: [
                               'Hit Rate'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>
      </div>
    );
  }
});

export default RedisDashboard;
