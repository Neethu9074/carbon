import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {formatBytes, formatPercentageShort} from 'in-services/converters';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const RedisDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    const dbs = snapshot.getIn(['data', 'dbs']);

    return (
      <div>
        <DashboardSection title='Database Size'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
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

        <DashboardSection title='Clients'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
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
                           windowSize={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             formatter: formatBytes,
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
                           windowSize={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80
                           }}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: formatPercentageShort,
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
