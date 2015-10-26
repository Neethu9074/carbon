import React from 'react/addons';
import {IntlMixin} from 'react-intl';
import irpt from 'react-immutable-proptypes';

import classnames from 'in-services/util/classnames';
import ResponsiveTable from 'in-components/ResponsiveTable';
import DashboardSection from 'in-components/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import Mtd from 'in-components/Mtd';

const rpt = React.PropTypes;

const NodejsDashboard = React.createClass({
  mixins: [React.addons.PureRenderMixin, IntlMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    timeframe: rpt.number.isRequired
  },

  getInitialState() {
    return {
      selectedHttpServer: null,
      selectedMongodbConnection: null
    };
  },

  render() {
    const httpServers = this.props.snapshot.getIn(['data', 'http']);
    const mongodbConnections = this.props.snapshot.getIn(['data', 'mongodb']);

    return (
      <div>
        {!httpServers.isEmpty() ?
        <DashboardSection title='HTTP Servers'>
          {this.state.selectedHttpServer ?
            <div>
              <ChartWithLegend snapshot={this.props.snapshot}
                     windowSize={this.props.timeframe}
                     height={150}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       metrics: [
                         'http.' + this.state.selectedHttpServer + '.requests',
                         'http.' + this.state.selectedHttpServer + '.responses'
                       ],
                       labels: [
                         'Requests / s',
                         'Responses / s'
                       ],
                       type: 'line'
                     }}
                     y2={{
                       min: 0,
                       metrics: [
                         'http.' + this.state.selectedHttpServer + '.responseTime50',
                         'http.' + this.state.selectedHttpServer + '.responseTime90',
                         'http.' + this.state.selectedHttpServer + '.responseTime95',
                         'http.' + this.state.selectedHttpServer + '.responseTime99'
                       ],
                       labels: [
                         'Response Time 50th in ms',
                         'Response Time 90th in ms',
                         'Response Time 95th in ms',
                         'Response Time 99th in ms'
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
                <th>Response Time 50th in ms</th>
                <th>Response Time 90th in ms</th>
                <th>Response Time 95th in ms</th>
                <th>Response Time 99th in ms</th>
              </tr>
            </thead>

            <tbody>
              {httpServers.map((httpServer, key) =>
                <tr key={key}
                    onClick={() => this.setState({
                      selectedHttpServer: key
                    })}
                    className={classnames({
                      'active': key === this.state.selectedHttpServer
                    })}>
                  <td>{httpServer.get('type')}</td>
                  <td>{httpServer.getIn(['address', 'address'])}</td>
                  <td>{httpServer.getIn(['address', 'port'])}</td>
                  <Mtd metric={'http.' + key + '.requests'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'http.' + key + '.responses'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'http.' + key + '.responseTime50'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'http.' + key + '.responseTime90'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'http.' + key + '.responseTime95'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'http.' + key + '.responseTime99'}
                       snapshot={this.props.snapshot}/>
                </tr>
              ).valueSeq()}
            </tbody>
          </ResponsiveTable>
        </DashboardSection>
        : null}


        {!mongodbConnections.isEmpty() ?
        <DashboardSection title='MongoDB Connections'>
          {this.state.selectedMongodbConnection ?
            <div>
              <ChartWithLegend snapshot={this.props.snapshot}
                     windowSize={this.props.timeframe}
                     height={150}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       metrics: [
                         'mongodb.' + this.state.selectedMongodbConnection + '.requests',
                         'mongodb.' + this.state.selectedMongodbConnection + '.failed'
                       ],
                       labels: [
                         'Requests / s',
                         'Failed requests / s'
                       ],
                       type: 'line'
                     }}
                     y2={{
                       min: 0,
                       metrics: [
                         'mongodb.' + this.state.selectedMongodbConnection + '.duration50',
                         'mongodb.' + this.state.selectedMongodbConnection + '.duration90',
                         'mongodb.' + this.state.selectedMongodbConnection + '.duration95',
                         'mongodb.' + this.state.selectedMongodbConnection + '.duration99'
                       ],
                       labels: [
                         'Request duration 50th in ms',
                         'Request duration 90th in ms',
                         'Request duration 95th in ms',
                         'Request duration 99th in ms'
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
                <th>Duration 50th in ms</th>
                <th>Duration 90th in ms</th>
                <th>Duration 95th in ms</th>
                <th>Duration 99th in ms</th>
              </tr>
            </thead>

            <tbody>
              {mongodbConnections.map((mongodbConnection, key) =>
                <tr key={key}
                    onClick={() => this.setState({
                      selectedMongodbConnection: key
                    })}
                    className={classnames({
                      'active': key === this.state.selectedMongodbConnection
                    })}>
                  <td>{mongodbConnection.get('host')}</td>
                  <td>{mongodbConnection.get('port')}</td>
                  <td>{mongodbConnection.get('databases', []).join(', ')}</td>
                  <Mtd metric={'mongodb.' + key + '.requests'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'mongodb.' + key + '.failed'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'mongodb.' + key + '.duration50'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'mongodb.' + key + '.duration90'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'mongodb.' + key + '.duration95'}
                       snapshot={this.props.snapshot}/>
                  <Mtd metric={'mongodb.' + key + '.duration99'}
                       snapshot={this.props.snapshot}/>
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
