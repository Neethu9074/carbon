import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';
import ResponsiveTable from 'in-components/ResponsiveTable';

const rpt = React.PropTypes;

const chartHeight = 200;

const TomcatDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  getInitialState() {
    return {
      webapp: null,
      connector: null,
      selectedServlet: null
    };
  },
  render() {
    const servlets = this.props.snapshot.getIn(['data', 'servlets']);
    const webapps = this.props.snapshot.getIn(['data', 'webapps']);
    const connectors = this.props.snapshot.getIn(['data', 'connector-config']);

    return (
      <div>
      { servlets ?
        <DashboardSection title='Servlets'>
          {this.state.selectedServlet ?
            <ChartWithLegend snapshot={this.props.snapshot}
                   windowSize={this.props.timeframe}
                   height={chartHeight}
                   margins={{
                     left: 80
                   }}

                   y1={{
                     metrics: [
                       'servlets.' + this.state.selectedServlet + '.time',
                       'servlets.' + this.state.selectedServlet + '.inv'
                       //'servlets.' + this.state.selectedServlet + '.errors'
                     ],
                     labels: [
                       'Processing Time',
                       'Request Count'
                       //'Errors'
                     ],
                     type: 'line'
                   }}/>
          : null}
          <ResponsiveTable clickable={true}>
            <thead>
              <tr>
                <th>Servlet</th>
                <th>Time</th>
                <th>Inv</th>
                { //<th>Errors</th>
                }
              </tr>
            </thead>

            <tbody>
              {servlets.map((data, name) =>
                <tr key={name} onClick={() => this.selectServlet(name)}>
                  <td>{name}</td>
                  <Mtd metric={'servlets.' + name + '.time'}
                       snapshot={this.props.snapshot} />
                  <Mtd metric={'servlets.' + name + '.inv'}
                      snapshot={this.props.snapshot} />
                  { //<Mtd metric={'servlets.' + name + '.errors'}
                    //  snapshot={this.props.snapshot} />
                  }
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>
      : null}

        { webapps ?
          <DashboardSection title='Sessions'>
            {this.state.webapp ?
              <ChartWithLegend snapshot={this.props.snapshot}
                     windowSize={this.props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80
                     }}

                     y1={{
                       metrics: [
                         'sessions.' + this.state.webapp
                       ],
                       labels: [
                         this.state.webapp + ' Sessions'
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
                         snapshot={this.props.snapshot} />
                  </tr>
                ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}
        { connectors ?
          <DashboardSection title='Connectors'>
            {this.state.connector ?
              <ChartWithLegend snapshot={this.props.snapshot}
                     windowSize={this.props.timeframe}
                     height={chartHeight}
                     margins={{
                       left: 80
                     }}

                     y1={{
                       metrics: [
                         'connectors.' + this.state.connector + '.threads',
                         'connectors.' + this.state.connector + '.connections'
                       ],
                       labels: [
                         this.state.connector + ' Threads',
                         this.state.connector + ' Connections'
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
                         snapshot={this.props.snapshot} />
                    <td>{data.get('threads').get('max')}</td>
                    <Mtd metric={'connectors.' + name + '.connections'}
                         snapshot={this.props.snapshot} />
                    <td>{data.get('connections').get('max')}</td>
                  </tr>
                ).valueSeq()}
              </tbody>
            </ResponsiveTable>
          </DashboardSection>
        : null}
      </div>
    );
  },

  selectServlet(name) {
    this.setState({
      selectedServlet: name
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
