import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';


const chartHeight = 200;

const MongoDBDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;

    const dbs = snapshot.getIn(['data', 'databases']);

    return (
      <div>
        {dbs ?
        <DashboardSection title='Database Size'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
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
                             formatter: bytesZeroDecimalPlaces,
                             tooltipFormatter: bytesTwoDecimalPlaces
                           }}/>
        </DashboardSection>
        : null}

        <DashboardSection title='Document Counter'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
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
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
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
