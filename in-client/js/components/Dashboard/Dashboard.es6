/*global require: false*/
import React from 'react';

import Jail from 'in-components/Jail';
import LoadingIndicator from 'in-components/LoadingIndicator';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as timelineStore from 'in-services/stores/timeline';
import {extractCoordinates} from 'in-services/snapshots';

import Header from './Header';

import './Dashboard.less';

const block = 'in-dashboard';

const Dashboard = React.createClass({
  mixins: [SubscriptionMixin],

  statics: {
    willTransitionTo(transition, params) {
      const snapshotCoordinates = extractCoordinates(params);
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
        <Header snapshot={this.state.snapshot}/>

        <div className={block + '__content-wrapper'}>
          <div className={block + '__content'} ref='content'>
            {this.state.snapshot ?
              this.renderDashboard()
            : <LoadingIndicator />}
          </div>

          <div className={block + '__sidebar'}>
            {this.state.snapshot ?
              this.renderSidebar()
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
    const Sidebar = this.getForgeSpecificComponent('Sidebar');
    return (
      <Jail component={Sidebar} props={{
        snapshot: this.state.snapshot,
        timeframe: this.state.timeframe
      }} />
    );
  },

  getForgeSpecificComponent(name) {
    const snapshot = this.state.snapshot;
    return require(
      'in-forge/' +
      snapshot.get('pluginId') +
      '/Dashboard/' +
      name +
      '.es6'
    );
  }

});

export default Dashboard;
