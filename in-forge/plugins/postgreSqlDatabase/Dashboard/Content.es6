import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';
import ResponsiveTable from 'in-components/ResponsiveTable';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {timeframeShape} from 'in-stores/timeline';
import {Row, Col} from 'in-components/Grid';

import {
  zeroDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';


const chartHeight = 200;

const hitRateFormatter = d => d < 0 ? 'No activity' : percentageZeroDecimalPlaces(d);
const queriesFormatter = d => d < 0 ? 'No activity' : zeroDecimalPlaces(d);

const PostgreSqlDashboard = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      selectedDb: null
    };
  },

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const timeframe = this.props.timeframe;
    const snapshot = this.props.snapshot;
    const data = snapshot.get('data');
    const databaseNames = data.get('dbs', emptyList).toArray();
    databaseNames.sort();

    return (
      <div>
        {databaseNames && databaseNames.length > 0 ?
          <DashboardSection title='Databases'>
            {this.state.selectedDb != null ?
              <div>
                <Row>
                  <Col cols={6}>
                    <ChartWithLegend snapshot={snapshot}
                                     timeframe={timeframe}
                                     height={chartHeight}
                                     margins={{
                                      left: 80
                                     }}
                                     y1={{
                                       min: 0,
                                       formatter: queriesFormatter,
                                       metrics: [
                                         'databases.' + this.state.selectedDb + '.queries'
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
                                       formatter: queriesFormatter,
                                       metrics: [
                                         'databases.' + this.state.selectedDb + '.queries_active',
                                         'databases.' + this.state.selectedDb + '.queries_waiting'
                                       ],
                                       labels: [
                                         'Queries active',
                                         'Queries waiting'
                                       ],
                                       type: 'line'
                                     }}/>
                  </Col>
                  <Col cols={6}>
                    <ChartWithLegend snapshot={snapshot}
                                     timeframe={timeframe}
                                     height={chartHeight}
                                     margins={{
                                        left: 80
                                     }}
                                     y1={{
                                       min: 0,
                                       formatter: queriesFormatter,
                                       metrics: [
                                         'databases.' + this.state.selectedDb + '.queries_select',
                                         'databases.' + this.state.selectedDb + '.queries_update',
                                         'databases.' + this.state.selectedDb + '.queries_insert',
                                         'databases.' + this.state.selectedDb + '.queries_delete'
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
                                       formatter: queriesFormatter,
                                       metrics: [
                                         'databases.' + this.state.selectedDb + '.xact_commit'
                                       ],
                                       labels: [
                                         'Committed transactions'
                                       ],
                                       type: 'line'
                                     }}/>
                  </Col>
                </Row>
                <Row>
                  <Col cols={6}>
                    <ChartWithLegend snapshot={snapshot}
                                    timeframe={timeframe}
                                    height={chartHeight}
                                    margins={{
                                       left: 80
                                    }}
                                    y1={{
                                      min: 0,
                                      formatter: queriesFormatter,
                                      metrics: [
                                        'databases.' + this.state.selectedDb + '.xact_rollback'
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
                                        'databases.' + this.state.selectedDb + '.conflicts'
                                      ],
                                      labels: [
                                        'Standby Conflicts'
                                      ],
                                      type: 'line'
                                    }}/>
                  </Col>
                  <Col cols={6}>
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
                                        'databases.' + this.state.selectedDb + '.blks_hit_rate'
                                      ],
                                      labels: [
                                        'Cache Hit Ratio'
                                      ],
                                      type: 'line',
                                      formatter: hitRateFormatter
                                    }}/>
                    <ChartWithLegend snapshot={snapshot}
                                    timeframe={timeframe}
                                    height={chartHeight}
                                    margins={{
                                       left: 80
                                    }}
                                    y1={{
                                      min: 0,
                                      formatter: queriesFormatter,
                                      metrics: [
                                        'databases.' + this.state.selectedDb + '.idx_tup_read',
                                        'databases.' + this.state.selectedDb + '.idx_tup_fetch'
                                      ],
                                      labels: [
                                        'Tuple read',
                                        'Tuple fetch'
                                      ],
                                      type: 'line'
                                    }}/>
                  </Col>
                </Row>
              </div>
            : null }

            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Database</th>
                </tr>
              </thead>

              <tbody>
                {databaseNames.map(db =>
                  <tr key={db}
                      onClick={() => this.setState({selectedDb: db})}>
                    <td>{db}</td>
                  </tr>
                )}
              </tbody>
            </ResponsiveTable>

          </DashboardSection>
        : null }
      </div>
    );
  }
});

export default PostgreSqlDashboard;
