import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';

import EndpointBreakdownTable from
  'in-forge/plugins/springbootApplicationContainer/Dashboard/EndpointBreakdownTable.es6';

import {emptyList} from 'in-services/fixedImmutables';
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
    const allStatusCodes = snapshot.getIn(['data', 'allStatusCodes'], emptyList).sort();
    const httpSessionsMax = snapshot.getIn(['data', 'httpsessionsMax']);
    const statusCodeRequestMetrics = allStatusCodes.map(statusCode => 'statusCode.' + statusCode).toArray();
    const statusCodeRequestLabels = allStatusCodes
      .map(statusCode => 'Requests with Status Code ' + statusCode).toArray();
    return (
      <div>
        {allStatusCodes.size > 0 ?
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
                                 metrics: statusCodeRequestMetrics,
                                 labels: statusCodeRequestLabels,
                                 type: 'line'
                               }}
                               y2={{
                                 metrics: [
                                  'requests'
                                 ],
                                 labels: [
                                  'All Requests'
                                 ],
                                 type: 'line'
                               }}/>
            </DashboardSection>
          </div>
          : null}
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
                          timeframe={timeframe} />
      </div>
    );
  }
});

export default SpringbootDashboard;
