import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DeploymentsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/DeploymentsTable';
import ConnectorsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ConnectorsTable';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import ResponsiveTable from 'in-components/ResponsiveTable';
import {timeframeShape} from 'in-stores/timeline';
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
    const snapshot = this.props.snapshot;

    const structure = servlets.map((deploymentServlets, deploymentName) => {
      const headerRow = (
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

      const servletRows = deploymentServlets.map((servletName) => {
        const servletKey = deploymentName + '.' + servletName;
        return (
          <tr key={servletKey} onClick={() => this.selectServlet(servletKey, servletName)}>
            <td>{servletName}</td>
            <Mtd metric={'servlets.' + servletKey + '.requests'}
              snapshot={snapshot} />
            <Mtd metric={'servlets.' + servletKey + '.avgResponseTime'}
              snapshot={snapshot} formatter={msZeroDecimalPlaces} />
          </tr>
        );
      });

      return servletRows.insert(0, headerRow);
    });

    return structure.toList().flatten();
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
    const timeframe = props.timeframe;
    const servlets = snapshot.getIn(['data', 'servlets']);
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


        <DeploymentsTable snapshot={snapshot}
                          timeframe={timeframe} />

        <ConnectorsTable snapshot={snapshot}
                         timeframe={timeframe} />
      </div>
    );
  }
});

export default JBossAsDashboard;
