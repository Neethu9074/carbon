import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ResponsiveTable from 'in-components/ResponsiveTable';
import Mtd from 'in-components/Mtd';

const rpt = React.PropTypes;
const chartHeight = 200;
const milliSecondsFormatter = milliSeconds => milliSeconds + ' ms';

const TomcatDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  getInitialState() {
    return {
      webapp: null,
      connector: null,
      selectedServlet: null,
      selectedServletName: null
    };
  },

  renderWebApps(servlets) {
    const structure = [];
    const snapshot = this.props.snapshot;

    servlets.forEach((webAppData, webAppName) => {
      structure.push(
        <tr key={webAppName}>
          <td colSpan='4'
              style={{
                background: '#fff',
                fontWeight: 'bold',
                fontSize: '13px'
              }}>
            {webAppName}
          </td>
        </tr>
      );

      webAppData.forEach((servletName) => {
        const servletKey = webAppName + '.' + servletName;
        structure.push(
          <tr key={servletKey} onClick={() => this.selectServlet(servletKey, servletName)}>
            <td>{servletName}</td>
            <Mtd metric={'servlets.' + servletKey + '.inv'}
                 snapshot={snapshot} />
            <Mtd metric={'servlets.' + servletKey + '.time'}
                 snapshot={snapshot} formatter={milliSecondsFormatter} />
            <Mtd metric={'servlets.' + servletKey + '.errors'}
                 snapshot={snapshot} />
          </tr>
        );
      });
    });

    return (
      structure.map(value => value)
    );
  },

  render() {
    const state = this.state;
    const props = this.props;
    const snapshot = props.snapshot;
    const servlets = snapshot.getIn(['data', 'servlets']);
    const webapps = snapshot.getIn(['data', 'webapps']);
    const connectors = snapshot.getIn(['data', 'connector-config']);

    return (
      <div>
      { servlets ?
        <DashboardSection title={'Servlets' +
        (this.state.selectedServletName ? ' (' + state.selectedServletName + ')' : '')}>
          {state.selectedServlet ?
            <ChartWithLegend snapshot={snapshot}
                   windowSize={props.timeframe}
                   height={chartHeight}
                   margins={{
                     left: 80,
                     right: 40
                   }}
                   y1={{
                     formatter: milliSecondsFormatter,
                     metrics: [
                       'servlets.' + state.selectedServlet + '.time'
                     ],
                     labels: [
                       'Average Response Time'
                     ],
                     type: 'line'
                   }}
                   y2={{
                     metrics: [
                       'servlets.' + state.selectedServlet + '.inv',
                       'servlets.' + state.selectedServlet + '.errors'
                     ],
                     labels: [
                       'Request Count',
                       'Errors'
                     ],
                     type: 'line'
                   }}/>
          : null}
          <ResponsiveTable clickable={true}>
            <thead>
              <tr>
                <th>Servlet</th>
                <th>Requests</th>
                <th>Avg Response Time</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              {this.renderWebApps(servlets)}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>
      : null}
        { webapps ?
          <DashboardSection title='Sessions'>
            {state.webapp ?
              <ChartWithLegend snapshot={snapshot}
                     windowSize={props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80
                     }}
                     y1={{
                       metrics: [
                         'sessions.' + state.webapp
                       ],
                       labels: [
                         state.webapp + ' Sessions'
                       ],
                       type: 'line'
                     }}/>
            : null}
            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Webapp</th>
                  <th>Context</th>
                  <th>Session</th>
                </tr>
              </thead>
              <tbody>
                {webapps.map((data, name) =>
                  <tr key={name} onClick={() => this.selectWebapp(name)}>
                    <td>{data.get('name')}</td>
                    <td>{name}</td>
                    <Mtd metric={'sessions.' + name}
                         snapshot={snapshot} />
                  </tr>
                ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}
        { connectors ?
          <DashboardSection title='Connectors'>
            {state.connector ?
              <ChartWithLegend snapshot={snapshot}
                     windowSize={props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80
                     }}
                     y1={{
                       metrics: [
                         'connectors.' + state.connector + '.threads',
                         'connectors.' + state.connector + '.connections'
                       ],
                       labels: [
                         state.connector + ' Threads',
                         state.connector + ' Connections'
                       ],
                       type: 'line'
                     }}/>
            : null}
            <ResponsiveTable clickable={true}>
              <thead>
                <tr>
                  <th>Connector</th>
                  <th>Threads</th>
                  <th>Max</th>
                  <th>Connections</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                {connectors.map((data, name) =>
                  <tr key={name} onClick={() => this.selectConnector(name)}>
                    <td>{name}</td>
                    <Mtd metric={'connectors.' + name + '.threads'}
                         snapshot={snapshot} />
                    <td>{data.getIn(['threads', 'max'])}</td>
                    <Mtd metric={'connectors.' + name + '.connections'}
                         snapshot={snapshot} />
                    <td>{data.getIn(['connections', 'max'])}</td>
                  </tr>
                ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}
      </div>
    );
  },

  selectServlet(metricKey, servletName) {
    this.setState({
      selectedServlet: metricKey,
      selectedServletName: servletName
    });
  },

  selectWebapp(w) {
    this.setState({
      webapp: w
    });
  },

  selectConnector(c) {
    this.setState({
      connector: c
    });
  }
});

export default TomcatDashboard;
