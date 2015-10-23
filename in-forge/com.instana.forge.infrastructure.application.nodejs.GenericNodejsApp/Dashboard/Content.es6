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
      selectedHttpServer: null
    };
  },

  render() {
    const httpServers = this.props.snapshot.getIn(['data', 'http']);

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
      </div>
    );
  }

});

export default NodejsDashboard;
