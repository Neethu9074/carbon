/*eslint-disable react/no-multi-comp*/
import {State, Navigation} from 'react-router';
import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {create} from 'in-services/conveyer';

import './index.less';

const block = 'in-snapshot-pane';

const SnapshotsPaneContent = React.createClass({
  propTypes: {
    snapshots: irpt.list.isRequired
  },

  render() {
    const snapshots = this.props.snapshots;

    return (
      <table>
        <thead>
          <tr>
            <th>Host</th>
            <th>Steady Id</th>
            <th>Snapshot</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
        {snapshots.map((snapshot) =>
          <tr>
            <td>{snapshot.get('hostId')}</td>
            <td>{snapshot.get('steadyId')}</td>
            <td><pre>{JSON.stringify(snapshot.get('data'), null, 2)}</pre></td>
            <td>{moment(snapshot.get('timestamp')).fromNow('dddd')} ago</td>
          </tr>
        )}
        </tbody>
      </table>
    );
  }
});

const SnapshotPane = React.createClass({
  mixins: [SubscriptionMixin, State, Navigation],

  bindToDatasource() {
    const pluginId = 'com.instana.forge.infrastructure.os.OS';
    const observable = create(SnapshotConveyer, {pluginId});
    this.addSubscription(observable.subscribe(snapshots =>
      this.setState({snapshots}))
    );
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
        <div className={block + '__content'}>
            {this.state.snapshots ?
              <SnapshotsPaneContent snapshots={this.state.snapshots} />
            : 'Loading...' }
        </div>

      </div>
    );
  },

  closeDashboard() {
    this.transitionTo('map');
  }

});

export default SnapshotPane;
