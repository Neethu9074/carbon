import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';
import React from 'react';

import * as numberFormatters from 'in-services/formatters/number';
import DashboardSection from 'in-components/DashboardSection';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import classnames from 'in-services/util/classnames';
import Mtd from 'in-components/Mtd';

const rpt = React.PropTypes;
const emptyMap = Immutable.Map();

const NodejsDashboard = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    timeframe: rpt.number.isRequired,
    snapshot: irpt.map.isRequired
  },

  getInitialState() {
    return {
      selectedHttpServer: null,
      selectedMongodbConnection: null
    };
  },

  render() {
    const selectedMongodbConnection = this.state.selectedMongodbConnection;
    const selectedHttpServer = this.state.selectedHttpServer;
    const snapshot = this.props.snapshot;
    const httpServers = snapshot.getIn(['data', 'http'], emptyMap);
    const mongodbConnections = snapshot.getIn(['data', 'mongodb'], emptyMap);
    const cassandraKeyspaces = snapshot.getIn(['data', 'cassandra', 'keyspaces'], emptyMap);

    return (
      <div>
        {!httpServers.isEmpty() ?
        <DashboardSection title='HTTP Servers'>
          {this.state.selectedHttpServer ?
            <div>
              <ChartWithLegend snapshot={snapshot}
                     windowSize={this.props.timeframe}
                     height={150}
                     margins={{
                       left: 80,
                       right: 80
                     }}
                     y1={{
                       min: 0,
                       formatter: numberFormatters.twoDecimalPlaces,
                       metrics: [
                         'http.' + selectedHttpServer + '.requests',
                         'http.' + selectedHttpServer + '.responses'
                       ],
                       labels: [
                         'Requests / s',
                         'Responses / s'
                       ],
                       type: 'line'
                     }}
                     y2={{
                       min: 0,
                       formatter: numberFormatters.msTwoDecimalPlaces,
                       metrics: [
                         'http.' + selectedHttpServer + '.responseTime50',
                         'http.' + selectedHttpServer + '.responseTime90',
                         'http.' + selectedHttpServer + '.responseTime95',
                         'http.' + selectedHttpServer + '.responseTime99'
                       ],
                       labels: [
                         'Response Time 50th',
                         'Response Time 90th',
                         'Response Time 95th',
                         'Response Time 99th'
                       ],
                       type: 'line'
                     }}/>
            </div>
          : null}
          <ResponsiveTable clickable={true}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Bind Address</th>
                <th>Port</th>
                <th>Requests / s</th>
                <th>Responses / s</th>
                <th>Response Time 50th</th>
                <th>Response Time 90th</th>
                <th>Response Time 95th</th>
                <th>Response Time 99th</th>
              </tr>
            </thead>

            <tbody>
              {httpServers.map((httpServer, key) =>
                <tr key={key}
                    onClick={() => this.setState({
                      selectedHttpServer: key
                    })}
                    className={classnames({
                      'active': key === selectedHttpServer
                    })}>
                  <td>{httpServer.get('type')}</td>
                  <td>{httpServer.getIn(['address', 'address'])}</td>
                  <td>{httpServer.getIn(['address', 'port'])}</td>
                  <Mtd metric={'http.' + key + '.requests'}
                       snapshot={snapshot}
                       formatter={numberFormatters.zeroDecimalPlaces}/>
                  <Mtd metric={'http.' + key + '.responses'}
                       snapshot={snapshot}
                       formatter={numberFormatters.zeroDecimalPlaces}/>
                  <Mtd metric={'http.' + key + '.responseTime50'}
                       snapshot={snapshot}
                       formatter={numberFormatters.msTwoDecimalPlaces}/>
                  <Mtd metric={'http.' + key + '.responseTime90'}
                       snapshot={snapshot}
                       formatter={numberFormatters.msTwoDecimalPlaces}/>
                  <Mtd metric={'http.' + key + '.responseTime95'}
                       snapshot={snapshot}
                       formatter={numberFormatters.msTwoDecimalPlaces}/>
                  <Mtd metric={'http.' + key + '.responseTime99'}
                       snapshot={snapshot}
                       formatter={numberFormatters.msTwoDecimalPlaces}/>
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>
        : null}


        {!mongodbConnections.isEmpty() ?
        <DashboardSection title='MongoDB Connections'>
          {selectedMongodbConnection ?
            <div>
              <ChartWithLegend snapshot={snapshot}
                     windowSize={this.props.timeframe}
                     height={150}
                     margins={{
                       left: 80,
                       right: 80
                     }}
                     y1={{
                       min: 0,
                       formatter: numberFormatters.zeroDecimalPlaces,
                       metrics: [
                         'mongodb.' + selectedMongodbConnection + '.requests',
                         'mongodb.' + selectedMongodbConnection + '.failed'
                       ],
                       labels: [
                         'Requests / s',
                         'Failed requests / s'
                       ],
                       type: 'line'
                     }}
                     y2={{
                       min: 0,
                       formatter: numberFormatters.msTwoDecimalPlaces,
                       metrics: [
                         'mongodb.' + selectedMongodbConnection + '.duration50',
                         'mongodb.' + selectedMongodbConnection + '.duration90',
                         'mongodb.' + selectedMongodbConnection + '.duration95',
                         'mongodb.' + selectedMongodbConnection + '.duration99'
                       ],
                       labels: [
                         'Request duration 50th',
                         'Request duration 90th',
                         'Request duration 95th',
                         'Request duration 99th'
                       ],
                       type: 'line'
                     }}/>
            </div>
          : null}
          <ResponsiveTable clickable={true}>
            <thead>
              <tr>
                <th>Host</th>
                <th>Port</th>
                <th>Databases</th>
                <th>Requests / s</th>
                <th>Failed Requests / s</th>
                <th>Duration 50th</th>
                <th>Duration 90th</th>
                <th>Duration 95th</th>
                <th>Duration 99th</th>
              </tr>
            </thead>

            <tbody>
              {mongodbConnections.map((mongodbConnection, key) =>
                <tr key={key}
                    onClick={() => this.setState({
                      selectedMongodbConnection: key
                    })}
                    className={classnames({
                      'active': key === selectedMongodbConnection
                    })}>
                  <td>{mongodbConnection.get('host')}</td>
                  <td>{mongodbConnection.get('port')}</td>
                  <td>{mongodbConnection.get('databases', []).join(', ')}</td>
                  <Mtd metric={'mongodb.' + key + '.requests'}
                       snapshot={snapshot}
                       formatter={numberFormatters.zeroDecimalPlaces}/>
                  <Mtd metric={'mongodb.' + key + '.failed'}
                       snapshot={snapshot}
                       formatter={numberFormatters.zeroDecimalPlaces}/>
                  <Mtd metric={'mongodb.' + key + '.duration50'}
                       snapshot={snapshot}
                       formatter={numberFormatters.msTwoDecimalPlaces}/>
                  <Mtd metric={'mongodb.' + key + '.duration90'}
                       snapshot={snapshot}
                       formatter={numberFormatters.msTwoDecimalPlaces}/>
                  <Mtd metric={'mongodb.' + key + '.duration95'}
                       snapshot={snapshot}
                       formatter={numberFormatters.msTwoDecimalPlaces}/>
                  <Mtd metric={'mongodb.' + key + '.duration99'}
                       snapshot={snapshot}
                       formatter={numberFormatters.msTwoDecimalPlaces}/>
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>
        : null}

        {!cassandraKeyspaces.isEmpty() ?
          <DashboardSection title='Cassandra Connections'>
            <ResponsiveTable>
              <thead>
                <tr>
                  <th>Keyspace</th>
                  <th>Hosts</th>
                </tr>
              </thead>

              <tbody>
                {cassandraKeyspaces.map((hosts, keyspace) =>
                  <tr key={keyspace}>
                    <td>
                      {!keyspace ?
                        <span style={{fontStyle: 'italic'}}>not specified</span>
                      : keyspace}
                    </td>
                    <td>{hosts.join(', ')}</td>
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

export default NodejsDashboard;
