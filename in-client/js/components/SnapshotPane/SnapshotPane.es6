/*eslint-disable react/no-multi-comp*/
import React from 'react';
import {State, Navigation} from 'react-router';
import moment from 'moment';
import irpt from 'react-immutable-proptypes';
import {createLogger} from 'instalog';

import http from 'in-services/http';

import './SnapshotPane.less';

const logger = createLogger('in-client.SnapshotPane');
const block = 'in-dashboard';

const SnapshotsPaneContent = React.createClass({
  mixins: [Navigation],
  propTypes: {
    snapshots: irpt.list.isRequired,
    env: irpt.list.isRequired,
    unit: irpt.list.isRequired,
    tenant: irpt.list.isRequired
  },

  render() {
    const snapshots = this.props.snapshots;
    return (
      <table className='in-subtle-table in-subtle-table--clickable in-snapshots-table'>
        <thead>
          <tr>
            <th>Host</th>
            <th>Steady Id</th>
            <th>Snapshot</th>
            <th>Last Seen</th>
            <th>Online</th>
          </tr>
        </thead>
        <tbody>
        {snapshots.map((snapshot) =>
          <tr onClick={() =>
              this.transitionTo('metric-latency-pane',
                                {env: this.props.env,
                                 tenant: this.props.tenant,
                                 unit: this.props.unit,
                                 hostId: snapshot.host_id,
                                 pluginId: snapshot.plugin_id,
                                 steadyId: snapshot.steady_id})}>
            <td>{snapshot.host_id}</td>
            <td>{snapshot.steady_id}</td>
            <td>
               <pre>{JSON.stringify(JSON.parse(snapshot.snapshot), null, 2)}</pre>
            </td>
            <td>{moment(snapshot.timestamp).fromNow('dddd')} ago</td>
            <td>{snapshot.online ? 'online' : 'offline'}</td>
          </tr>
        )}
        </tbody>
      </table>
    );
  }
});

const SnapshotPane = React.createClass({
  mixins: [State, Navigation],

  propTypes: {
    params: React.PropTypes.shape({
      env: irpt.list.isRequired,
      tenant: irpt.list.isRequired,
      unit: irpt.list.isRequired
    })
  },

  bindToDatasource() {
    http({method: 'GET', url: '/internal/api/' +
                              this.props.params.env + '/' +
                              this.props.params.tenant + '/' +
                              this.props.params.unit + '/hosts'})
      .then(response => {
        this.setState({
          snapshots: response.body,
          error: null
        });
      }, err => {
        logger.error('Failed to load snapshots', err);
        this.setState({
          snapshots: null,
          error: err
        });
      });
  },

  componentDidMount() {
    this.bindToDatasource();
  },


  getInitialState() {
    return {
      snapshots: null
    };
  },

  render() {
    return (
      <div className={block}>
        <div className={block + '__content-wrapper'}>
          <div className={block + '__content'} ref='content'>
            {this.state.snapshots ?
             <SnapshotsPaneContent snapshots={this.state.snapshots}
                                   env={this.props.params.env}
                                   tenant={this.props.params.tenant}
                                   unit={this.props.params.unit} />
            : 'Loading…' }
          </div>
        </div>
      </div>
    );
  }

});

export default SnapshotPane;
