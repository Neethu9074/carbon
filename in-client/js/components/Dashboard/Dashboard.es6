import React from 'react';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SnapshotDetailContent from 'in-components/SnapshotDetailContent';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import getForgeComponent from 'in-services/getForgeComponent';
import LoadingIndicator from 'in-components/LoadingIndicator';
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
        {this.renderSidebar()}

        <div className={block + '__graphs'} ref='content'>
          <Header snapshot={this.state.snapshot}/>
          {this.renderDashboard()}
        </div>

      </div>
    );
  },

  renderSidebar() {
    if (!this.state.snapshot) {
      return <LoadingIndicator />;
    }

    return (
      <div className={block + '__sidebar'}>
        <SnapshotDetailContent className={block + '__siderbar-content'}
                               snapshot={this.state.snapshot}
                               useDetailedInformation={true}/>;
      </div>
    );
  },

  rederNavigation() {
    const items = ['CPU Usage', 'CPU Load', 'Memory'];

    return (
      <Navigation>
        {items.map(item => <Navigation.Item key={item}
                                            label={item}
                                            onClick={() => {  }}/>)}
      </Navigation>
    );
  },

  renderDashboard() {
    if (!this.state.snapshot) {
      return <LoadingIndicator />;
    }

    const DashboardImpl = this.getForgeSpecificComponent('Content');
    return (
      <Jail component={DashboardImpl}
            className={block + '__sections'}
            props={{
              snapshot: this.state.snapshot,
              timeframe: this.state.timeframe
            }} />
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
