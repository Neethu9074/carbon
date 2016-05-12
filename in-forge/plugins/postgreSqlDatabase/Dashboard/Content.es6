import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';

import {
  zeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';


const chartHeight = 200;

const PostgreSqlDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');
    const databaseNames = data.get('dbs', emptyList).toArray();

    return (
      <div>
        {databaseNames && databaseNames.length > 0 ?
          databaseNames.map(db =>
            <DashboardSection title={db}>

              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                left: 80
                               }}
                               y1={{
                                 min: 0,
                                 formatter: zeroDecimalPlaces,
                                 metrics: [
                                   'databases.' + db + '.queries'
                                 ],
                                 labels: [
                                   'Queries'
                                 ],
                                 type: 'line'
                               }}/>
              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                  left: 80
                               }}
                               y1={{
                                 min: 0,
                                 formatter: zeroDecimalPlaces,
                                 metrics: [
                                   'databases.' + db + '.queries_active',
                                   'databases.' + db + '.queries_waiting'
                                 ],
                                 labels: [
                                   'Queries active',
                                   'Queries waiting'
                                 ],
                                 type: 'line'
                               }}/>
              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                  left: 80
                               }}
                               y1={{
                                 min: 0,
                                 formatter: zeroDecimalPlaces,
                                 metrics: [
                                   'databases.' + db + '.queries_select',
                                   'databases.' + db + '.queries_update',
                                   'databases.' + db + '.queries_insert',
                                   'databases.' + db + '.queries_delete'
                                 ],
                                 labels: [
                                   'SELECT Queries',
                                   'UPDATE Queries',
                                   'INSERT Queries',
                                   'DELETE Queries'
                                 ],
                                 type: 'line'
                               }}/>
              <ChartWithLegend snapshot={snapshot}
                               timeframe={timeframe}
                               height={chartHeight}
                               margins={{
                                  left: 80
                               }}
                               y1={{
                                 min: 0,
                                 formatter: zeroDecimalPlaces,
                                 metrics: [
                                   'databases.' + db + '.xact_commit'
                                 ],
                                 labels: [
                                   'Committed transactions'
                                 ],
                                 type: 'line'
                               }}/>
              <ChartWithLegend snapshot={snapshot}
                              timeframe={timeframe}
                              height={chartHeight}
                              margins={{
                                 left: 80
                              }}
                              y1={{
                                min: 0,
                                formatter: zeroDecimalPlaces,
                                metrics: [
                                  'databases.' + db + '.xact_rollback'
                                ],
                                labels: [
                                  'Rolled back transactions'
                                ],
                                type: 'line'
                              }}/>
              <ChartWithLegend snapshot={snapshot}
                              timeframe={timeframe}
                              height={chartHeight}
                              margins={{
                                 left: 80
                              }}
                              y1={{
                                min: 0,
                                formatter: zeroDecimalPlaces,
                                metrics: [
                                  'databases.' + db + '.conflicts'
                                ],
                                labels: [
                                  'Standby Conflicts'
                                ],
                                type: 'line'
                              }}/>
              <ChartWithLegend snapshot={snapshot}
                              timeframe={timeframe}
                              height={chartHeight}
                              margins={{
                                left: 80
                              }}
                              y1={{
                                min: 0,
                                max: 1,
                                metrics: [
                                  'databases.' + db + '.blks_hit_rate'
                                ],
                                labels: [
                                  'Cache Hit Ratio'
                                ],
                                type: 'line',
                                formatter: percentageZeroDecimalPlaces
                              }}/>
              <ChartWithLegend snapshot={snapshot}
                              timeframe={timeframe}
                              height={chartHeight}
                              margins={{
                                 left: 80
                              }}
                              y1={{
                                min: 0,
                                formatter: zeroDecimalPlaces,
                                metrics: [
                                  'databases.' + db + '.idx_tup_read',
                                  'databases.' + db + '.idx_tup_fetch'
                                ],
                                labels: [
                                  'Tuple read',
                                  'Tuple fetch'
                                ],
                                type: 'line'
                              }}/>

            </DashboardSection>
          )
        : null }
      </div>
    );
  }
});

export default PostgreSqlDashboard;
