import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  percentageTwoDecimalPlaces,
  bytesTwoDecimalPlaces,
  msZeroDecimalPlaces
} from 'in-services/formatters/number';

import {timeframeShape} from 'in-stores/timeline';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ResponsiveTable from 'in-components/ResponsiveTable';
import Mtd from 'in-components/Mtd';

const chartHeight = 200;

const HAProxyDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  getInitialState() {
    return {
      frontend: null,
      backend: null
    };
  },

  selectFrontend(v) {
    this.setState({
      frontend: v
    });
  },

  selectBackend(v) {
    this.setState({
      backend: v
    });
  },

  render() {
    const state = this.state;
    const props = this.props;
    const snapshot = props.snapshot;
    const frontends = snapshot.getIn(['data', 'frontends']);
    const backends = snapshot.getIn(['data', 'backends']);
    return (
      <div>
        { frontends && frontends.size > 0 ?
          <DashboardSection title={'Frontends ' +
            (state.frontend ? '(' + state.frontend + ')' : '')}>
            {state.frontend ?
              <div>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    metrics: [
                      'frontendStats.' + state.frontend + '.reqRate',
                      'frontendStats.' + state.frontend + '.reqErrors',
                      'frontendStats.' + state.frontend + '.deniedReq'
                    ],
                    labels: [
                      'Requests',
                      'Request Errors',
                      'Denied Requests'
                    ],
                    type: 'line'
                  }}/>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    metrics: [
                      'frontendStats.' + state.frontend + '.sessionRate'
                    ],
                    labels: [
                      'Sessions'
                    ],
                    type: 'line'
                  }}
                  y2={{
                    formatter: percentageTwoDecimalPlaces,
                    metrics: [
                      'frontendStats.' + state.frontend + '.sessionUtilization'
                    ],
                    labels: [
                      'Session Usage'
                    ],
                    type: 'line'
                  }}/>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    metrics: [
                      'frontendStats.' + state.frontend + '.clientErrors',
                      'frontendStats.' + state.frontend + '.serverErrors'
                    ],
                    labels: [
                      'Client Errors',
                      'Server Errors'
                    ],
                    type: 'line'
                  }}/>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    formatter: bytesTwoDecimalPlaces,
                    metrics: [
                      'frontendStats.' + state.frontend + '.bytesSent',
                      'frontendStats.' + state.frontend + '.bytesReceived'
                    ],
                    labels: [
                      'Bytes Sent',
                      'Bytes Received'
                    ],
                    type: 'line'
                  }}/>
              </div>
            : null}
            <ResponsiveTable clickable={true}>
              <thead>
              <tr>
                <th>Frontend Name</th>
                <th>Requests</th>
                <th>Request Errors</th>
                <th>Denied Requests</th>
                <th>Sessions</th>
                <th>Session Usage</th>
                <th>Client Errors</th>
                <th>Server Errors</th>
                <th>Bytes Sent</th>
                <th>Bytes Received</th>
              </tr>
              </thead>
              <tbody>
              {frontends.map(name =>
                  <tr key={name} onClick={() => this.selectFrontend(name)}>
                    <td>{name}</td>
                    <Mtd metric={'frontendStats.' + name + '.reqRate'}
                         snapshot={snapshot}/>
                    <Mtd metric={'frontendStats.' + name + '.reqErrors'}
                         snapshot={snapshot}/>
                    <Mtd metric={'frontendStats.' + name + '.deniedReq'}
                         snapshot={snapshot}/>
                    <Mtd metric={'frontendStats.' + name + '.sessionRate'}
                         snapshot={snapshot}/>
                    <Mtd metric={'frontendStats.' + name + '.sessionUtilization'}
                         formatter={percentageTwoDecimalPlaces}
                         snapshot={snapshot}/>
                    <Mtd metric={'frontendStats.' + name + '.clientErrors'}
                         snapshot={snapshot}/>
                    <Mtd metric={'frontendStats.' + name + '.serverErrors'}
                         snapshot={snapshot}/>
                    <Mtd metric={'frontendStats.' + name + '.bytesSent'}
                         formatter={bytesTwoDecimalPlaces}
                         snapshot={snapshot}/>
                    <Mtd metric={'frontendStats.' + name + '.bytesReceived'}
                         formatter={bytesTwoDecimalPlaces}
                         snapshot={snapshot}/>
                  </tr>
              ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}
        { backends && backends.size > 0 ?
          <DashboardSection title={'Backends ' +
            (state.backend ? '(' + state.backend + ')' : '')}>
            {state.backend ?
              <div>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    formatter: msZeroDecimalPlaces,
                    metrics: [
                      'backendStats.' + state.backend + '.avgResponseTime',
                      'backendStats.' + state.backend + '.avgQueueTime'
                    ],
                    labels: [
                      'Average Response Time',
                      'Average Queue Time'
                    ],
                    type: 'line'
                  }}
                  y2={{
                    metrics: [
                      'backendStats.' + state.backend + '.queueSize'
                    ],
                    labels: [
                      'Queue Size'
                    ],
                    type: 'line'
                  }}/>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    metrics: [
                      'backendStats.' + state.backend + '.reqConnErrors',
                      'backendStats.' + state.backend + '.errorRes'
                    ],
                    labels: [
                      'Connection Errors',
                      'Response Errors'
                    ],
                    type: 'line'
                  }}/>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    metrics: [
                      'backendStats.' + state.backend + '.connRetries'
                    ],
                    labels: [
                      'Connection Retries'
                    ],
                    type: 'line'
                  }}/>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    metrics: [
                      'backendStats.' + state.backend + '.deniedRes'
                    ],
                    labels: [
                      'Denied Responses'
                    ],
                    type: 'line'
                  }}/>
                <ChartWithLegend snapshot={snapshot}
                  timeframe={props.timeframe}
                  height={chartHeight}
                  margins={{
                    left: 80
                  }}
                  y1={{
                    metrics: [
                      'backendStats.' + state.backend + '.reDispatchedReq'
                    ],
                    labels: [
                      'Re-Dispatched Requests'
                    ],
                    type: 'line'
                  }}/>
              </div>
            : null}
            <ResponsiveTable clickable={true}>
              <thead>
              <tr>
                <th>Backend Name</th>
                <th>Average Response Time</th>
                <th>Average Queue Time</th>
                <th>Queue Size</th>
                <th>Connection Errors</th>
                <th>Response Errors</th>
                <th>Connection Retries</th>
                <th>Denied Responses</th>
                <th>Re-Dispatched Requests</th>
              </tr>
              </thead>
              <tbody>
              {backends.map(name =>
                  <tr key={name} onClick={() => this.selectBackend(name)}>
                    <td>{name}</td>
                    <Mtd metric={'backendStats.' + name + '.avgResponseTime'}
                         formatter={msZeroDecimalPlaces}
                         snapshot={snapshot}/>
                    <Mtd metric={'backendStats.' + name + '.avgQueueTime'}
                         formatter={msZeroDecimalPlaces}
                         snapshot={snapshot}/>
                    <Mtd metric={'backendStats.' + name + '.queueSize'}
                         snapshot={snapshot}/>
                    <Mtd metric={'backendStats.' + name + '.reqConnErrors'}
                         snapshot={snapshot}/>
                    <Mtd metric={'backendStats.' + name + '.errorRes'}
                         snapshot={snapshot}/>
                    <Mtd metric={'backendStats.' + name + '.connRetries'}
                         snapshot={snapshot}/>
                    <Mtd metric={'backendStats.' + name + '.deniedRes'}
                         snapshot={snapshot}/>
                    <Mtd metric={'backendStats.' + name + '.reDispatchedReq'}
                         snapshot={snapshot}/>
                  </tr>
              ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}
      </div>
    );
  }
});

export default HAProxyDashboard;
