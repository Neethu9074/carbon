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
      connector: null
    };
  },
  render() {
    const webapps = this.props.snapshot.getIn(['data', 'webapps']);
    const connectors = this.props.snapshot.getIn(['data', 'connector-config']);

    return (
      <div>
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
