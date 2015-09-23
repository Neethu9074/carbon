import React from 'react';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SnapshotDetailContent from 'in-components/SnapshotDetailContent';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import getForgeComponent from 'in-services/getForgeComponent';
import LoadingIndicator from 'in-components/LoadingIndicator';
import * as timelineStore from 'in-services/stores/timeline';
import {extractCoordinates} from 'in-services/snapshots';
import Jail from 'in-components/Jail';

import Header from './Header';

import './Dashboard.less';

const block = 'in-dashboard';

const Dashboard = React.createClass({
  mixins: [SubscriptionMixin],

  statics: {
    willTransitionTo(transition, params) {
      const snapshotCoordinates = extractCoordinates({
        pluginId: decodeURIComponent(params.pluginId),
        hostId: decodeURIComponent(params.hostId),
        steadyId: decodeURIComponent(params.steadyId)
      });
      selectedSnapshotStore.select(snapshotCoordinates);
    }
  },

  getInitialState() {
    return {
      snapshot: null,
      timeframe: 0
    };
  },

  componentWillMount() {
    this.addSubscription(
      selectedSnapshotStore.selectedSnapshot.subscribe(snapshot => {
        this.setState({snapshot});
      })
    );

    this.addSubscription(
      timelineStore.timeframe.subscribe(timeframe => {
        this.setState({timeframe});
      })
    );
  },

  render() {
    return (
      <div className={block}>

        <div className={block + '__content-wrapper'}>

          <div className={block + '__sidebar'}>
            {this.state.snapshot ?
              this.renderSidebar()
            : <LoadingIndicator />}
          </div>

          <div className={block + '__content'} ref='content'>
            <Header snapshot={this.state.snapshot}/>
            {this.state.snapshot ?
              this.renderDashboard()
            : <LoadingIndicator />}
          </div>

        </div>
      </div>
    );
  },

  renderDashboard() {
    const DashboardImpl = this.getForgeSpecificComponent('Content');
    return (
      <Jail component={DashboardImpl} props={{
        snapshot: this.state.snapshot,
        timeframe: this.state.timeframe
      }} />
    );
  },

  renderSidebar() {
    return (
      <div className={block + '__sidebar'}>
        <SnapshotDetailContent className={block + '__siderbar-content'} snapshot={this.state.snapshot}/>;
      </div>
    );
  },

  getForgeSpecificComponent(name) {
    const snapshot = this.state.snapshot;
    return getForgeComponent(
      './' +
      snapshot.get('pluginId') +
      '/Dashboard/' +
      name +
      '.es6'
    );
  }

});

export default Dashboard;
