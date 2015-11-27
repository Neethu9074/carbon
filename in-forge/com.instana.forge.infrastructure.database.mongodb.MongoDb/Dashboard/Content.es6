import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {formatBytes} from 'in-services/converters';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

const rpt = React.PropTypes;

const chartHeight = 200;

const MongoDBDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    const dbs = snapshot.getIn(['data', 'databases']);

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
                                        'dbs.' + name
                                      ).toArray(),
                             labels: dbs.map((name) =>
                                        name
                                      ).toArray(),
                             type: 'line',
                             formatter: formatBytes,
                             tooltipFormatter: formatBytes
                           }}/>
        </DashboardSection>

        <DashboardSection title='Document Counter'>
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
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
          <ChartWithLegend snapshot={snapshot}
                           windowSize={timeframe}
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
