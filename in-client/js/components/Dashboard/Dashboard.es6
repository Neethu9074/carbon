import React from 'react';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import LoadingIndicator from 'in-components/LoadingIndicator';
import SidebarDashboard from 'in-components/SidebarDashboard';
import getForgeComponent from 'in-services/getForgeComponent';
import * as timelineStore from 'in-services/stores/timeline';
import {extractCoordinates} from 'in-services/snapshots';
import Jail from 'in-components/Jail';

import Navigation from './Navigation';
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
    this.addSubscription(selectedSnapshotStore.selectedSnapshot.subscribe(snapshot => this.setState({snapshot})));
    this.addSubscription(timelineStore.timeframe.subscribe(timeframe => this.setState({timeframe})));
  },

  render() {
    const snapshot = this.state.snapshot;
    if (!snapshot) {
      return <LoadingIndicator />;
    }

    const DashboardImpl = this.getForgeSpecificComponent('Content');
    return (
      <div className={block}>
        <SidebarDashboard snapshot={snapshot}/>

        <div className={block + '__graphs'} ref='content'>
          <Header snapshot={snapshot}/>
          <Navigation snapshot={snapshot}/>
          <Jail component={DashboardImpl}
                className={block + '__sections'}
                props={{ snapshot, timeframe: this.state.timeframe }}/>
        </div>
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
