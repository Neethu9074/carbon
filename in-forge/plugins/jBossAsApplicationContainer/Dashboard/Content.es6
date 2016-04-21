import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  msZeroDecimalPlaces
} from 'in-services/formatters/number';

import {timeframeShape} from 'in-stores/timeline';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ResponsiveTable from 'in-components/ResponsiveTable';
import Mtd from 'in-components/Mtd';

const chartHeight = 200;

const JBossAsDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: timeframeShape
  },

  getInitialState() {
    return {
      deployment: null,
      connector: null,
      selectedServlet: null,
      selectedServletName: null
    };
  },

  renderDeployments(servlets) {
    const structure = [];
    const snapshot = this.props.snapshot;

    servlets.forEach((deploymentServlets, deploymentName) => {
      structure.push(
        <tr key={deploymentName}>
          <td colSpan='4'
              style={{
                background: '#fff',
                fontWeight: 'bold',
                fontSize: '13px'
              }}>
            {deploymentName}
          </td>
        </tr>
      );

      deploymentServlets.forEach((servletName) => {
        const servletKey = deploymentName + '.' + servletName;
        structure.push(
          <tr key={servletKey} onClick={() => this.selectServlet(servletKey, servletName)}>
            <td>{servletName}</td>
            <Mtd metric={'servlets.' + servletKey + '.requests'}
                 snapshot={snapshot} />
            <Mtd metric={'servlets.' + servletKey + '.avgResponseTime'}
                 snapshot={snapshot} formatter={msZeroDecimalPlaces} />
          </tr>
        );
      });
    });

    return structure;
  },

  selectServlet(metricKey, servletName) {
    this.setState({
      selectedServlet: metricKey,
      selectedServletName: servletName
    });
  },

  selectDeployment(d) {
    this.setState({
      deployment: d
    });
  },

  selectConnector(c) {
    this.setState({
      connector: c
    });
  },

  render() {
    const state = this.state;
    const props = this.props;
    const snapshot = props.snapshot;
    const servlets = snapshot.getIn(['data', 'servlets']);
    const deployments = snapshot.getIn(['data', 'deployments']);
    const connectors = snapshot.getIn(['data', 'connectors']);
    const isEAP = snapshot.getIn(['data', 'serverInfo', 'productName']) === 'EAP';
    return (
      <div>
        { servlets && servlets.size > 0 ?
          <DashboardSection title={'Servlets' +
          (this.state.selectedServletName ? ' (' + state.selectedServletName + ')' : '')}>
            {state.selectedServlet ?
              <ChartWithLegend snapshot={snapshot}
                     timeframe={props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80,
                       right: 40
                     }}
                     y1={{
                       formatter: msZeroDecimalPlaces,
                       metrics: [
                         'servlets.' + state.selectedServlet + '.avgResponseTime'
                       ],
                       labels: [
                         'Average Response Time'
                       ],
                       type: 'line'
                     }}
                     y2={{
                       metrics: [
                         'servlets.' + state.selectedServlet + '.requests'
                       ],
                       labels: [
                         'Requests'
                       ],
                       type: 'line'
                     }}/>
            : null}
            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Servlet</th>
                  <th>Requests</th>
                  <th>Average Response Time</th>
                </tr>
              </thead>
              <tbody>
                {this.renderDeployments(servlets)}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}
        { deployments && isEAP ?
          <DashboardSection title={'Sessions' +
            (state.deployment ? '(' + state.deployment + ')' : '')}>
            {state.deployment ?
              <ChartWithLegend snapshot={snapshot}
                     timeframe={props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80
                     }}
                     y1={{
                       metrics: [
                         'sessions.' + state.deployment + '.activeSessions'
                       ],
                       labels: [
                         'Active Sessions'
                       ],
                       type: 'line'
                     }}/>
            : null}
            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Deployment</th>
                  <th>Active Sessions</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map((data, name) =>
                  <tr key={name} onClick={() => this.selectDeployment(name)}>
                    <td>{name}</td>
                    <Mtd metric={'sessions.' + name + '.activeSessions'}
                         snapshot={snapshot} />
                  </tr>
                ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}
        { connectors && connectors.size > 0 ?
          <DashboardSection title={'Connectors' +
            (state.connector ? '(' + state.connector + ')' : '')}>
            {state.connector ?
              <ChartWithLegend snapshot={snapshot}
                     timeframe={props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80
                     }}
                     y1={{
                       formatter: msZeroDecimalPlaces,
                       metrics: [
                         'connectors.' + state.connector + '.avgResponseTime'
                       ],
                       labels: [
                         'Average Response Time'
                       ],
                       type: 'line'
                     }}
                     y2={{
                       metrics: [
                         'connectors.' + state.connector + '.requests',
                         'connectors.' + state.connector + '.errors'
                       ],
                       labels: [
                         'Requests',
                         'Errors'
                       ],
                       type: 'line'
                     }}/>
            : null}
            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Connector</th>
                  <th>Average Response Time</th>
                  <th>Requests</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {connectors.map(name =>
                  <tr key={name} onClick={() => this.selectConnector(name)}>
                    <td>{name}</td>
                    <Mtd metric={'connectors.' + name + '.avgResponseTime'}
                         snapshot={snapshot} />
                    <Mtd metric={'connectors.' + name + '.requests'}
                         snapshot={snapshot} />
                    <Mtd metric={'connectors.' + name + '.errors'}
                         snapshot={snapshot} />
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

export default JBossAsDashboard;
