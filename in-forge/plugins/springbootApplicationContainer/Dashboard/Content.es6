import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

import EndpointBreakdownTable from
  'in-forge/plugins/springbootApplicationContainer/Dashboard/EndpointBreakdownTable.es6';

const chartHeight = 200;

const SpringbootDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  render() {
    const snapshot = this.props.snapshot;
    const timeframe = this.props.timeframe;
    const httpSessionsMax = snapshot.getIn(['data', 'httpsessionsMax']);
    return (
      <div>
        <DashboardSection title='Request Count'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           height={chartHeight}
                           margins={{
                             left: 80,
                             right: 80
                           }}
                           y1={{
                            metrics: [
                              'requests',
                              'statusCode.1xx',
                              'statusCode.2xx',
                              'statusCode.3xx',
                              'statusCode.4xx',
                              'statusCode.5xx'
                            ],
                            labels: [
                              'All Requests',
                              'Requests with Status Code 1xx',
                              'Requests with Status Code 2xx',
                              'Requests with Status Code 3xx',
                              'Requests with Status Code 4xx',
                              'Requests with Status Code 5xx'
                            ],
                            type: 'line'
                           }}/>
        </DashboardSection>
        {httpSessionsMax ?
          <DashboardSection title='HTTP Sessions Active'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             height={chartHeight}
                             margins={{
                                 left: 80
                               }}
                             y1={{
                                 metrics: [
                                  'metrics.httpsessions.active'
                                 ],
                                 labels: [
                                  'Active Sessions'
                                 ],
                                 type: 'line'
                               }}/>
          </DashboardSection>
          : null}
        <EndpointBreakdownTable snapshot={snapshot}
                                timeframe={timeframe}/>
      </div>
    );
  }
});

export default SpringbootDashboard;
