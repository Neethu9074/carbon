/*global require: false*/

'use strict';

import React from 'react';
import {State, Navigation} from 'react-router';
import Immutable from 'immutable';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as selectedSnapshotStore from 'instana-ui-services/stores/selectedSnapshot';
import * as timelineStore from 'instana-ui-services/stores/timeline';

import './index.less';

const block = 'in-dashboard';

const Dashboard = React.createClass({
  mixins: [SubscriptionMixin, State, Navigation],

  statics: {
    willTransitionTo(transition, params) {
      const snapshotId = Immutable.Map({
        steadyId: params.steadyId,
        pluginId: params.pluginId,
        hostId: params.hostId
      });
      selectedSnapshotStore.select(snapshotId);
    }
  },

  getInitialState() {
    return {
      snapshot: null,
      timeframe: 0
    };
  },

  componentDidMount() {
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
        <button type='button'
                onClick={this.closeDashboard}
                className={block + '__close'}>
          x
        </button>
        <div className={block + '__content'}>
          {this.state.snapshot ?
            this.renderDashboard()
          : <div>Loading...</div>}
        </div>

        <div className={block + '__sidebar'}>
          {this.state.snapshot ?
            this.renderSidebar()
          : <div>Loading...</div>}
        </div>
      </div>
    );
  },

  renderDashboard() {
    /*eslint-disable no-unused-vars*/
    const DashboardImpl = this.getForgeSpecificComponent('Content');
    return <DashboardImpl snapshot={this.state.snapshot}
                          timeframe={this.state.timeframe} />;
    /*eslint-enable no-unused-vars*/
  },

  renderSidebar() {
    /*eslint-disable no-unused-vars*/
    const Sidebar = this.getForgeSpecificComponent('Sidebar');
    return <Sidebar snapshot={this.state.snapshot}
                      timeframe={this.state.timeframe} />;
    /*eslint-enable no-unused-vars*/
  },

  getForgeSpecificComponent(name) {
    const snapshot = this.state.snapshot;
    return require('../forge/' + snapshot.get('pluginId') + '/Dashboard/' + name);
  },

  closeDashboard() {
    this.transitionTo('map');
  }

});

export default Dashboard;
